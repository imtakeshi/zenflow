"use client";

import { useRef, useCallback } from "react";

const BELL_URL = "/sounds/bell.mp3";
const GONG_URL = "/sounds/gong.mp3";

export function useSessionSounds(intervalMinutes: number) {
  const lastBellAt = useRef<number>(0);
  const intervalSec = intervalMinutes * 60;

  const playBell = useCallback(() => {
    const audio = new Audio(BELL_URL);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, []);

  const playGong = useCallback(() => {
    const audio = new Audio(GONG_URL);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  }, []);

  const checkIntervalBell = useCallback(
    (totalSeconds: number, secondsLeft: number) => {
      if (intervalMinutes <= 0) return;
      const elapsed = totalSeconds - secondsLeft;
      const currentInterval = Math.floor(elapsed / intervalSec);
      if (currentInterval > lastBellAt.current && elapsed >= intervalSec) {
        lastBellAt.current = currentInterval;
        playBell();
      }
    },
    [intervalMinutes, intervalSec, playBell]
  );

  return { playBell, playGong, checkIntervalBell };
}
