"use client";

import { useState, useEffect, useCallback } from "react";

export function useTimer(initialSeconds: number, onComplete?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, onComplete]);

  const play = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const toggle = useCallback(() => setIsRunning((r) => !r), []);
  const reset = useCallback((seconds?: number) => {
    setSecondsLeft(seconds ?? initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  return { secondsLeft, isRunning, play, pause, toggle, reset };
}
