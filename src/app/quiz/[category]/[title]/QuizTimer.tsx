"use client";

import { useEffect } from "react";

interface TimerProps {
  timeRemaining: number;
  setTimeRemaining: (time: number | ((prev: number) => number)) => void;
}

const QuizTimer: React.FC<TimerProps> = ({ timeRemaining, setTimeRemaining }) => {
  useEffect(() => {
    const timer = setInterval(() => {
    setTimeRemaining((prev: number) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [setTimeRemaining]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="text-sm font-medium">
      Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

export default QuizTimer;