"use client";

import { useRef, useCallback, useState } from "react";

export type SoundOption = "rain" | "ocean" | "forest" | "silence";

const SOUND_PATHS: Record<Exclude<SoundOption, "silence">, string> = {
  rain: "/sounds/звук.mp3",
  ocean: "https://bigsoundbank.com/UPLOAD/mp3/0267.mp3",
  forest: "https://bigsoundbank.com/UPLOAD/mp3/0100.mp3",
};

const FALLBACK_URLS: Record<Exclude<SoundOption, "silence">, string> = {
  rain: "https://bigsoundbank.com/UPLOAD/mp3/1290.mp3",
  ocean: "https://bigsoundbank.com/UPLOAD/mp3/0267.mp3",
  forest: "https://bigsoundbank.com/UPLOAD/mp3/0100.mp3",
};

export function useAmbientSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSound, setCurrentSound] = useState<SoundOption>("silence");

  const stopCurrent = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.removeAttribute("src");
      a.load();
    }
  }, []);

  const play = useCallback((option: SoundOption) => {
    stopCurrent();
    if (option === "silence") {
      setCurrentSound("silence");
      return;
    }
    const src = SOUND_PATHS[option];
    const fallback = FALLBACK_URLS[option];
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.4;
    audio.src = src;
    let fallbackUsed = false;
    const tryFallback = () => {
      if (fallbackUsed || src === fallback) return;
      fallbackUsed = true;
      audio.src = fallback;
      audio.play().catch(() => {});
    };
    audio.onerror = tryFallback;
    audio.play().catch(tryFallback);
    setCurrentSound(option);
  }, [stopCurrent]);

  const stop = useCallback(() => {
    stopCurrent();
    setCurrentSound("silence");
  }, [stopCurrent]);

  return { currentSound, play, stop };
}
