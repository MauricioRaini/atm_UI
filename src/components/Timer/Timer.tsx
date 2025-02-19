import { useEffect, useState } from "react";

import "./Timer.css";
import {
  TIMER_PAD_LENGTH,
  TIMER_UPDATE_INTERVAL_MS,
  TIMER_WARNING_THRESHOLD,
} from "@/constants/Timer.constants";
import { TIMER_DEBUG_BUTTON_TEXT, TIMER_WARNING_MESSAGE } from "@/constants/Messages.constants";

export type TimerProps = {
  timeToLive: number;
  onTimeout: () => void;
};

export const Timer = ({ timeToLive, onTimeout }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(timeToLive);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setTimeLeft(timeToLive);
  }, [timeToLive]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, TIMER_UPDATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  useEffect(() => {
    if (timeLeft === TIMER_WARNING_THRESHOLD) {
      setShowWarning(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(TIMER_PAD_LENGTH, "0")}`;
  };

  return (
    <div className="timerContainer">
      {showWarning && <div className="toastMessage">{TIMER_WARNING_MESSAGE}</div>}
      <div
        data-testid="timer"
        className={`timer ${timeLeft <= TIMER_WARNING_THRESHOLD ? "warning" : ""}`}
      >
        {formatTime(timeLeft)}
      </div>
      <button
        data-testid="force-timeout-button"
        className="debugButton"
        onClick={() => setTimeLeft(0)}
      >
        {TIMER_DEBUG_BUTTON_TEXT}
      </button>
    </div>
  );
};
