import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseOtpTimerOptions {
  initialSeconds?: number;
  autoStart?: boolean;
}

export const useOtpTimer = ({
  initialSeconds = 60,
  autoStart = true,
}: UseOtpTimerOptions = {}) => {
  const [secondsLeft, setSecondsLeft] = useState(autoStart ? initialSeconds : 0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (seconds = initialSeconds) => {
      clearTimer();
      setSecondsLeft(seconds);

      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimer, initialSeconds],
  );

  const resetTimer = useCallback(() => {
    startTimer(initialSeconds);
  }, [startTimer, initialSeconds]);

  useEffect(() => {
    if (autoStart) {
      startTimer(initialSeconds);
    }
    return () => clearTimer();
  }, [autoStart, initialSeconds, startTimer, clearTimer]);

  const canResend = secondsLeft === 0;

  return {
    secondsLeft,
    canResend,
    startTimer,
    resetTimer,
  };
};
