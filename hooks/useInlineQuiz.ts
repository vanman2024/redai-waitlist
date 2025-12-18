/**
 * useInlineQuiz - Custom hook for managing inline quiz state
 *
 * Handles quiz session lifecycle, answer submission, and progress tracking
 * for F047 Chat-Integrated Quiz System.
 */

import { useState, useCallback, useRef } from 'react';

/**
 * Question structure from the inline quiz API
 */
export interface InlineQuizQuestion {
  id: string;
  question_text: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_answer: string;
  explanation?: string;
  difficulty?: 'foundation' | 'intermediate' | 'advanced';
  topic?: string;
  block_name?: string;
}

/**
 * Answer feedback from the API
 */
export interface AnswerFeedback {
  is_correct: boolean;
  explanation: string;
  correct_answer: string;
  progress: {
    answered: number;
    total: number;
    score: number;
  };
}

/**
 * Quiz session state
 */
export interface InlineQuizSession {
  id: string;
  userId?: string;
  questions: InlineQuizQuestion[];
  currentQuestion: number;
  status: 'loading' | 'in_progress' | 'completed' | 'error' | 'limit_exceeded';
  answers: Array<{
    questionId: string;
    answer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  score: number;
  contextSummary?: string;
  startTime: number;
  error?: string;
}

/**
 * Upgrade prompt info when user hits a limit
 */
export interface UpgradePromptInfo {
  show: boolean;
  limitType: 'quiz' | 'exam' | 'ai_message';
  currentUsage: number;
  limit: number;
  suggestedPlan: string;
  message: string;
}

/**
 * Quiz generation request parameters
 */
export interface GenerateQuizParams {
  conversationId: string;
  userId?: string;
  messageIds?: string[];
  messages?: Array<{ role: string; content: string }>;
  questionCount?: number;
  difficulty?: 'foundation' | 'intermediate' | 'advanced';
}

/**
 * Hook return type
 */
export interface UseInlineQuizReturn {
  quiz: InlineQuizSession | null;
  isGenerating: boolean;
  currentFeedback: AnswerFeedback | null;
  upgradePrompt: UpgradePromptInfo | null;
  generateQuiz: (params: GenerateQuizParams) => Promise<void>;
  submitAnswer: (answer: string) => Promise<AnswerFeedback | null>;
  nextQuestion: () => void;
  resetQuiz: () => void;
  abandonQuiz: () => Promise<void>;
  dismissUpgradePrompt: () => void;
}

/**
 * Custom hook for managing inline quiz sessions
 */
export function useInlineQuiz(): UseInlineQuizReturn {
  const [quiz, setQuiz] = useState<InlineQuizSession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<AnswerFeedback | null>(null);
  const [upgradePrompt, setUpgradePrompt] = useState<UpgradePromptInfo | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  /**
   * Dismiss the upgrade prompt
   */
  const dismissUpgradePrompt = useCallback(() => {
    setUpgradePrompt(null);
  }, []);

  /**
   * Generate a new inline quiz from conversation context
   */
  const generateQuiz = useCallback(async (params: GenerateQuizParams) => {
    setIsGenerating(true);
    setCurrentFeedback(null);

    // Set loading state
    setQuiz({
      id: '',
      questions: [],
      currentQuestion: 0,
      status: 'loading',
      answers: [],
      score: 0,
      startTime: Date.now(),
    });

    try {
      const response = await fetch('/api/chat/inline-quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: params.conversationId,
          user_id: params.userId,
          message_ids: params.messageIds,
          messages: params.messages,
          question_count: params.questionCount || 5,
          difficulty: params.difficulty,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle 402 Payment Required (limit exceeded)
        if (response.status === 402 && errorData.error_code === 'LIMIT_EXCEEDED') {
          setUpgradePrompt({
            show: true,
            limitType: 'quiz',
            currentUsage: errorData.current_usage || 0,
            limit: errorData.limit || 3,
            suggestedPlan: errorData.suggested_plan || 'basic',
            message: errorData.message || 'Quiz limit reached. Upgrade to continue!',
          });

          setQuiz({
            id: '',
            questions: [],
            currentQuestion: 0,
            status: 'limit_exceeded',
            answers: [],
            score: 0,
            startTime: Date.now(),
            error: errorData.message,
          });

          setIsGenerating(false);
          return;
        }

        throw new Error(errorData.detail || `Failed to generate quiz: ${response.status}`);
      }

      const data = await response.json();

      setQuiz({
        id: data.inline_quiz_session_id,
        userId: params.userId,
        questions: data.questions,
        currentQuestion: 0,
        status: 'in_progress',
        answers: [],
        score: 0,
        contextSummary: data.context_summary,
        startTime: Date.now(),
      });

      questionStartTimeRef.current = Date.now();
    } catch (error) {
      console.error('Failed to generate inline quiz:', error);
      setQuiz({
        id: '',
        questions: [],
        currentQuestion: 0,
        status: 'error',
        answers: [],
        score: 0,
        startTime: Date.now(),
        error: error instanceof Error ? error.message : 'Failed to generate quiz',
      });
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Submit an answer for the current question
   */
  const submitAnswer = useCallback(async (answer: string): Promise<AnswerFeedback | null> => {
    if (!quiz || quiz.status !== 'in_progress') {
      return null;
    }

    const currentQ = quiz.questions[quiz.currentQuestion];
    if (!currentQ) {
      return null;
    }

    const timeSpent = Math.round((Date.now() - questionStartTimeRef.current) / 1000);

    try {
      const response = await fetch(`/api/chat/inline-quiz/${quiz.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: currentQ.id,
          user_answer: answer,
          time_spent_seconds: timeSpent,
          user_id: quiz.userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to submit answer');
      }

      const result: AnswerFeedback = await response.json();

      // Update quiz state with the answer
      setQuiz(prev => {
        if (!prev) return null;

        const newAnswers = [
          ...prev.answers,
          {
            questionId: currentQ.id,
            answer,
            isCorrect: result.is_correct,
            timeSpent,
          },
        ];

        // Calculate new score
        const correctCount = newAnswers.filter(a => a.isCorrect).length;
        const newScore = Math.round((correctCount / prev.questions.length) * 100);

        return {
          ...prev,
          answers: newAnswers,
          score: newScore,
        };
      });

      setCurrentFeedback(result);
      return result;
    } catch (error) {
      console.error('Failed to submit answer:', error);

      // Fallback: Calculate locally if API fails
      const isCorrect = answer === currentQ.correct_answer;
      const fallbackFeedback: AnswerFeedback = {
        is_correct: isCorrect,
        explanation: currentQ.explanation || (isCorrect
          ? 'Correct! Great job.'
          : `The correct answer was ${currentQ.correct_answer}.`),
        correct_answer: currentQ.correct_answer,
        progress: {
          answered: quiz.currentQuestion + 1,
          total: quiz.questions.length,
          score: 0,
        },
      };

      // Update quiz state even on API failure
      setQuiz(prev => {
        if (!prev) return null;

        const newAnswers = [
          ...prev.answers,
          {
            questionId: currentQ.id,
            answer,
            isCorrect,
            timeSpent,
          },
        ];

        const correctCount = newAnswers.filter(a => a.isCorrect).length;
        const newScore = Math.round((correctCount / prev.questions.length) * 100);

        return {
          ...prev,
          answers: newAnswers,
          score: newScore,
        };
      });

      setCurrentFeedback(fallbackFeedback);
      return fallbackFeedback;
    }
  }, [quiz]);

  /**
   * Move to the next question or complete the quiz
   */
  const nextQuestion = useCallback(() => {
    setCurrentFeedback(null);
    questionStartTimeRef.current = Date.now();

    setQuiz(prev => {
      if (!prev) return null;

      const nextIdx = prev.currentQuestion + 1;

      if (nextIdx >= prev.questions.length) {
        // Quiz complete
        return {
          ...prev,
          status: 'completed',
        };
      }

      return {
        ...prev,
        currentQuestion: nextIdx,
      };
    });
  }, []);

  /**
   * Reset the quiz state
   */
  const resetQuiz = useCallback(() => {
    setQuiz(null);
    setCurrentFeedback(null);
    setIsGenerating(false);
  }, []);

  /**
   * Abandon the current quiz session
   */
  const abandonQuiz = useCallback(async () => {
    if (!quiz || !quiz.id) {
      resetQuiz();
      return;
    }

    try {
      // Notify backend that quiz was abandoned
      await fetch(`/api/chat/inline-quiz/${quiz.id}/abandon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Failed to abandon quiz:', error);
    } finally {
      resetQuiz();
    }
  }, [quiz, resetQuiz]);

  return {
    quiz,
    isGenerating,
    currentFeedback,
    upgradePrompt,
    generateQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz,
    abandonQuiz,
    dismissUpgradePrompt,
  };
}

export default useInlineQuiz;
