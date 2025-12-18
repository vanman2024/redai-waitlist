import { useState } from 'react';

export function useDemoQuiz() {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  return {
    isQuizActive,
    setIsQuizActive,
    currentQuestion,
    setCurrentQuestion,
    handleQuizAnswer: () => {},
    resetQuiz: () => setIsQuizActive(false),
  };
}
