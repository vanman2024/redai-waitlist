'use client';

/**
 * InlineQuizMessage - Renders a single quiz question within the chat
 *
 * Features:
 * - Multiple choice answer selection
 * - Visual feedback for correct/incorrect answers
 * - Progress indicator
 * - Smooth transitions
 * - Mobile-friendly touch targets (48px minimum)
 */

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, X, Loader2, ArrowRight, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { InlineQuizQuestion, AnswerFeedback } from '@/hooks/useInlineQuiz';

interface InlineQuizMessageProps {
  question: InlineQuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => Promise<AnswerFeedback | null>;
  onNext: () => void;
  feedback: AnswerFeedback | null;
  disabled?: boolean;
}

export function InlineQuizMessage({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  feedback,
  disabled = false,
}: InlineQuizMessageProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to quiz question when it appears
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [question.id]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsSubmitting(false);
    setShowFeedback(false);
  }, [question.id]);

  // Show feedback when it arrives
  useEffect(() => {
    if (feedback) {
      setShowFeedback(true);
    }
  }, [feedback]);

  const handleAnswerSelect = async (answer: string) => {
    if (feedback || isSubmitting || disabled) return;

    setSelectedAnswer(answer);
    setIsSubmitting(true);

    try {
      await onAnswer(answer);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    onNext();
  };

  const answers = [
    { key: 'A', text: question.choice_a },
    { key: 'B', text: question.choice_b },
    { key: 'C', text: question.choice_c },
    { key: 'D', text: question.choice_d },
  ].filter(a => a.text); // Filter out empty options

  const progressPercentage = ((questionNumber - 1) / totalQuestions) * 100;
  const isLastQuestion = questionNumber === totalQuestions;

  return (
    <Card
      ref={cardRef}
      className="my-4 border-2 border-blue-500/30 bg-gray-800/50 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-300"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              Quick Quiz
            </span>
          </div>
          <span className="text-sm text-gray-400">
            {questionNumber} of {totalQuestions}
          </span>
        </div>
        <Progress
          value={showFeedback ? (questionNumber / totalQuestions) * 100 : progressPercentage}
          className="h-1.5 bg-gray-700"
        />
      </CardHeader>

      <CardContent className="pt-0">
        {/* Question text */}
        <div className="text-base font-medium text-gray-100 mb-4 leading-relaxed prose prose-invert prose-sm max-w-none [&_p]:my-0 [&_strong]:text-white [&_em]:text-blue-300">
          <ReactMarkdown>{question.question_text}</ReactMarkdown>
        </div>

        {/* Topic/Block info if available */}
        {(question.topic || question.block_name) && (
          <div className="flex gap-2 mb-4">
            {question.block_name && (
              <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                {question.block_name}
              </span>
            )}
            {question.topic && (
              <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                {question.topic}
              </span>
            )}
          </div>
        )}

        {/* Answer options */}
        <div className="space-y-2">
          {answers.map((answer) => {
            const isSelected = selectedAnswer === answer.key;
            const isCorrectAnswer = feedback?.correct_answer === answer.key;
            const wasIncorrect = showFeedback && isSelected && !feedback?.is_correct;
            const showAsCorrect = showFeedback && isCorrectAnswer;

            return (
              <Button
                key={answer.key}
                variant="outline"
                className={`
                  w-full justify-start text-left h-auto min-h-[48px] py-3 px-4
                  transition-all duration-200 ease-in-out whitespace-normal break-words
                  ${isSelected && !showFeedback ? 'border-blue-500 bg-blue-500/20' : ''}
                  ${showAsCorrect ? 'border-green-500 bg-green-500/20 text-green-100' : ''}
                  ${wasIncorrect ? 'border-red-500 bg-red-500/20 text-red-100' : ''}
                  ${!showFeedback && !isSelected ? 'hover:border-gray-500 hover:bg-gray-700/50' : ''}
                  ${showFeedback ? 'cursor-default' : 'cursor-pointer'}
                `}
                onClick={() => handleAnswerSelect(answer.key)}
                disabled={!!feedback || isSubmitting || disabled}
              >
                <span className={`
                  font-semibold mr-3 w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-sm
                  ${showAsCorrect ? 'bg-green-500 text-white' : ''}
                  ${wasIncorrect ? 'bg-red-500 text-white' : ''}
                  ${!showFeedback ? 'bg-gray-600' : ''}
                `}>
                  {showAsCorrect ? (
                    <Check className="w-4 h-4" />
                  ) : wasIncorrect ? (
                    <X className="w-4 h-4" />
                  ) : (
                    answer.key
                  )}
                </span>
                <span className="flex-1 text-sm leading-relaxed break-words overflow-hidden">{answer.text}</span>
                {isSubmitting && isSelected && (
                  <Loader2 className="ml-2 h-4 w-4 flex-shrink-0 animate-spin text-blue-400" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Feedback section */}
        {showFeedback && feedback && (
          <div
            className={`
              mt-4 p-4 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300
              ${feedback.is_correct
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                ${feedback.is_correct ? 'bg-green-500' : 'bg-red-500'}
              `}>
                {feedback.is_correct ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <X className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium mb-1 ${
                  feedback.is_correct ? 'text-green-400' : 'text-red-400'
                }`}>
                  {feedback.is_correct ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {feedback.explanation}
                </p>
              </div>
            </div>

            {/* Next button */}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleNext}
                className="min-h-[44px] px-6"
                variant="default"
              >
                {isLastQuestion ? 'View Results' : 'Next Question'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InlineQuizMessage;
