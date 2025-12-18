/**
 * useDemoQuiz - Dynamic quiz hook for landing page demo
 *
 * Generates quiz questions on-the-fly using Gemini based on the
 * actual conversation, so questions are always relevant to what was discussed.
 */

import { useState, useCallback } from 'react';
import type { InlineQuizQuestion, AnswerFeedback } from './useInlineQuiz';

export interface DemoQuizSession {
  questions: InlineQuizQuestion[];
  currentQuestion: number;
  status: 'loading' | 'in_progress' | 'completed';
  score: number;
}

export interface UseDemoQuizReturn {
  quiz: DemoQuizSession | null;
  currentFeedback: AnswerFeedback | null;
  isGenerating: boolean;
  startQuiz: (messages: Array<{ role: string; content: string }>, trade?: string) => Promise<void>;
  submitAnswer: (answer: string) => Promise<AnswerFeedback | null>;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

export function useDemoQuiz(): UseDemoQuizReturn {
  const [quiz, setQuiz] = useState<DemoQuizSession | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<AnswerFeedback | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const startQuiz = useCallback(async (
    messages: Array<{ role: string; content: string }>,
    trade?: string
  ) => {
    setIsGenerating(true);
    setCurrentFeedback(null);

    // Show loading state
    setQuiz({
      questions: [],
      currentQuestion: 0,
      status: 'loading',
      score: 0,
    });

    try {
      // Call the API to generate 3 quiz questions based on the conversation
      const response = await fetch('/api/demo/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, trade }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();

      if (data.success && data.questions && data.questions.length > 0) {
        setQuiz({
          questions: data.questions,
          currentQuestion: 0,
          status: 'in_progress',
          score: 0,
        });
      } else {
        throw new Error('Invalid quiz response');
      }
    } catch (error) {
      console.error('Failed to generate demo quiz:', error);
      // Reset on error
      setQuiz(null);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const submitAnswer = useCallback(async (answer: string): Promise<AnswerFeedback | null> => {
    if (!quiz || quiz.status !== 'in_progress') {
      return null;
    }

    const currentQ = quiz.questions[quiz.currentQuestion];
    if (!currentQ) {
      return null;
    }

    const isCorrect = answer === currentQ.correct_answer;
    const pointsPerQuestion = Math.round(100 / quiz.questions.length);
    const newScore = quiz.score + (isCorrect ? pointsPerQuestion : 0);

    const feedback: AnswerFeedback = {
      is_correct: isCorrect,
      explanation: currentQ.explanation || (isCorrect
        ? 'Correct! Great job.'
        : `The correct answer was ${currentQ.correct_answer}.`),
      correct_answer: currentQ.correct_answer,
      progress: {
        answered: quiz.currentQuestion + 1,
        total: quiz.questions.length,
        score: newScore,
      },
    };

    // Update cumulative score
    setQuiz(prev => {
      if (!prev) return null;
      return {
        ...prev,
        score: newScore,
      };
    });

    setCurrentFeedback(feedback);
    return feedback;
  }, [quiz]);

  const nextQuestion = useCallback(() => {
    setCurrentFeedback(null);

    setQuiz(prev => {
      if (!prev) return null;

      const nextIdx = prev.currentQuestion + 1;

      if (nextIdx >= prev.questions.length) {
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

  const resetQuiz = useCallback(() => {
    setQuiz(null);
    setCurrentFeedback(null);
    setIsGenerating(false);
  }, []);

  return {
    quiz,
    currentFeedback,
    isGenerating,
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz,
  };
}

export default useDemoQuiz;
