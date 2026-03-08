"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getMoodToday, setMoodForToday } from "@/lib/moodStorage";

const MOODS = [
  { value: 1, label: "Плохо", emoji: "😔" },
  { value: 2, label: "Так себе", emoji: "😐" },
  { value: 3, label: "Нормально", emoji: "🙂" },
  { value: 4, label: "Хорошо", emoji: "😊" },
  { value: 5, label: "Отлично", emoji: "😌" },
];

export function MoodTracker() {
  const [mood, setMood] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMood(getMoodToday());
  }, []);

  const handleSelect = (value: number) => {
    setMood(value);
    setMoodForToday(value);
  };

  if (!mounted) return null;

  return (
    <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Настроение сегодня</p>
      <div className="flex justify-between gap-1">
        {MOODS.map(({ value, label, emoji }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            title={label}
            className={`flex-1 py-2 rounded-xl text-xl transition-colors ${
              mood === value
                ? "bg-slate-700 dark:bg-slate-600 text-white scale-105"
                : "bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
