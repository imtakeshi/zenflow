"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, X, CloudRain, Waves, Trees, VolumeX } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import { useMeditationStats } from "@/hooks/useMeditationStats";
import { useAmbientSound, type SoundOption } from "@/hooks/useAmbientSound";
import { useSessionSounds } from "@/hooks/useSessionSounds";
import { BreathingCircle } from "@/components/BreathingCircle";
import { Sidebar } from "@/components/Sidebar";
import { formatTime } from "@/lib/utils";
import { recordMeditationDay } from "@/lib/streaks";
import { addJournalEntry } from "@/lib/journalStorage";
import Link from "next/link";

const SOUND_OPTIONS: { id: SoundOption; label: string; Icon: typeof CloudRain }[] = [
  { id: "rain", label: "Дождь", Icon: CloudRain },
  { id: "ocean", label: "Океан", Icon: Waves },
  { id: "forest", label: "Лес", Icon: Trees },
  { id: "silence", label: "Тишина", Icon: VolumeX },
];

function SessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const duration = Math.min(60, Math.max(1, parseInt(searchParams.get("duration") || "5", 10)));
  const intervalParam = Math.max(0, parseInt(searchParams.get("interval") || "0", 10));
  const name = searchParams.get("name") || "Медитация";

  const [showComplete, setShowComplete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [completedDuration, setCompletedDuration] = useState(0);
  const { addMinutes } = useMeditationStats();
  const { playGong, checkIntervalBell } = useSessionSounds(intervalParam);

  const handleTimerComplete = () => {
    addMinutes(duration);
    recordMeditationDay();
    setCompletedDuration(duration);
    playGong();
    setShowComplete(true);
  };
  const { secondsLeft, isRunning, toggle } = useTimer(
    duration * 60,
    handleTimerComplete
  );
  const { currentSound, play, stop } = useAmbientSound();

  useEffect(() => {
    checkIntervalBell(duration * 60, secondsLeft);
  }, [secondsLeft, duration, checkIntervalBell]);

  useEffect(() => () => stop(), [stop]);

  const handleCloseModal = () => {
    if (journalText.trim() && completedDuration > 0) {
      addJournalEntry(completedDuration, journalText.trim());
    }
    setShowComplete(false);
    setJournalText("");
    router.push("/");
  };

  const handleFinish = () => {
    const completedMinutes = Math.ceil((duration * 60 - secondsLeft) / 60);
    if (completedMinutes > 0) {
      addMinutes(completedMinutes);
      recordMeditationDay();
      setCompletedDuration(completedMinutes);
    } else {
      setCompletedDuration(0);
    }
    playGong();
    setShowComplete(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex flex-col items-center justify-center px-4">
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="absolute top-0 left-0 right-0 flex justify-between p-4">
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-full bg-slate-200/80 dark:bg-slate-700/50 hover:bg-slate-300/80"
          aria-label="Меню"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link
          href="/"
          className="p-2 rounded-full bg-slate-200/80 dark:bg-slate-700/50 hover:bg-slate-300/80 dark:hover:bg-slate-600/50"
        >
          <X size={20} />
        </Link>
      </header>

      <motion.h2
        className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {name}
      </motion.h2>

      <motion.p
        className="text-5xl font-light text-slate-800 dark:text-slate-100 mb-12 tabular-nums"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {formatTime(secondsLeft)}
      </motion.p>

      <motion.div
        className="flex items-center justify-center mb-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <BreathingCircle />
      </motion.div>

      <div className="flex gap-4 mb-8">
        <motion.button
          onClick={toggle}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 dark:bg-slate-700 text-white shadow-md hover:shadow-lg transition-shadow"
          whileTap={{ scale: 0.97 }}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          <span>{isRunning ? "Пауза" : "Плей"}</span>
        </motion.button>
        <motion.button
          onClick={handleFinish}
          className="px-6 py-3 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
          whileTap={{ scale: 0.97 }}
        >
          Завершить
        </motion.button>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {SOUND_OPTIONS.map(({ id, label, Icon }) => (
          <motion.button
            key={id}
            onClick={() => play(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors ${
              currentSound === id
                ? "bg-slate-700 dark:bg-slate-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <Icon size={16} />
            {label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showComplete && (
          <motion.div
            className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Отлично!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Сессия завершена. Вы молодец!
              </p>
              <div className="mb-4 text-left">
                <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Запись в журнал (необязательно)
                </label>
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="Как вы себя чувствуете? Благодарность, мысли..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm resize-none h-20"
                  rows={3}
                />
              </div>
              <motion.button
                onClick={handleCloseModal}
                className="w-full py-3 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-medium"
                whileTap={{ scale: 0.98 }}
              >
                На главную
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <SessionContent />
    </Suspense>
  );
}
