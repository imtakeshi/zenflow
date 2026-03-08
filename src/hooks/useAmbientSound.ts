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

  const play = useCallback((option: SoundOption) => {
    const prev = audioRef.current;
    if (prev) {
      prev.pause();
      prev.currentTime = 0;
      prev.src = "";
      audioRef.current = null;
    }
    if (option === "silence") {
      setCurrentSound("silence");
      return;
    }
    const src = SOUND_PATHS[option];
    const fallback = FALLBACK_URLS[option];
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    let fallbackUsed = false;
    const tryFallback = () => {
      if (fallbackUsed || src === fallback) return;
      fallbackUsed = true;
      const fallbackAudio = new Audio(fallback);
      fallbackAudio.loop = true;
      fallbackAudio.volume = 0.4;
      audioRef.current = fallbackAudio;
      fallbackAudio.play().catch(() => {});
    };
    audio.onerror = tryFallback;
    audio.play().catch(tryFallback);
    setCurrentSound(option);
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentSound("silence");
  }, []);

  return { currentSound, play, stop };
}
