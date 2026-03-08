"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getGreeting } from "@/lib/utils";
import { useMeditationStats } from "@/hooks/useMeditationStats";
import { useUserName } from "@/hooks/useUserName";
import { practices, microPractices } from "@/data/practices";
import { getDailyMeditation } from "@/data/guided";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SplashScreen } from "@/components/SplashScreen";
import { NamePrompt } from "@/components/NamePrompt";
import { Sidebar } from "@/components/Sidebar";
import { MoodTracker } from "@/components/MoodTracker";
import { getStreakData } from "@/lib/streaks";
import Link from "next/link";
import { Clock, Timer, Flame, BookOpen } from "lucide-react";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalMinutes } = useMeditationStats();
  const { name, setName, hasName, isReady } = useUserName();
  const [splashDone, setSplashDone] = useState(false);

  const greeting = getGreeting();
  const greetingText = name ? `${greeting}, ${name}` : greeting;
  const { current: streak, longest } = getStreakData();
  const daily = getDailyMeditation();
  const DailyIcon = daily.icon;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 text-slate-700 dark:text-slate-200">
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      {splashDone && isReady && !hasName && <NamePrompt onSubmit={setName} />}
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <header className="flex justify-between items-center p-4">
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-full bg-slate-200/80 dark:bg-slate-700/50 hover:bg-slate-300/80"
          aria-label="Меню"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <ThemeToggle />
      </header>

      <main className="max-w-lg mx-auto px-4 pb-12">
        <motion.h1
          className="text-2xl font-light text-slate-600 dark:text-slate-400 mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {greetingText}
        </motion.h1>
        <motion.p
          className="text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          ZenFlow
        </motion.p>

        <motion.section
          className="mb-4 p-5 rounded-2xl bg-white/80 dark:bg-slate-800/60 shadow-sm border border-slate-100 dark:border-slate-700/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
            <Clock size={16} />
            <span>Ваша практика</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-4">
            <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              {totalMinutes} мин
            </p>
            {streak > 0 && (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm">
                <Flame size={16} />
                {streak} дн.
              </span>
            )}
            {longest > 0 && (
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                рекорд: {longest} дн.
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            всего медитации
          </p>
        </motion.section>

        <motion.section
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
        >
          <MoodTracker />
        </motion.section>

        <div className="flex gap-3 mb-6">
          <Link href="/timer" className="flex-1">
            <motion.div
              className="p-4 rounded-2xl bg-slate-200/80 dark:bg-slate-700/50 flex items-center gap-3"
              whileTap={{ scale: 0.98 }}
            >
              <Timer size={24} className="text-slate-600 dark:text-slate-400" />
              <span className="font-medium text-slate-800 dark:text-slate-100">Таймер</span>
            </motion.div>
          </Link>
          <Link href="/guided" className="flex-1">
            <motion.div
              className="p-4 rounded-2xl bg-slate-200/80 dark:bg-slate-700/50 flex items-center gap-3"
              whileTap={{ scale: 0.98 }}
            >
              <BookOpen size={24} className="text-slate-600 dark:text-slate-400" />
              <span className="font-medium text-slate-800 dark:text-slate-100">Гид</span>
            </motion.div>
          </Link>
        </div>

        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
          Медитация дня
        </h2>
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link href={`/session?duration=${daily.duration}&name=${encodeURIComponent(daily.name)}`}>
            <div
              className={`p-4 rounded-2xl bg-gradient-to-br ${daily.gradient} border border-white/30 dark:border-slate-600/30 flex items-center gap-4`}
            >
              <DailyIcon size={28} className="text-slate-700 dark:text-slate-200" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{daily.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{daily.description} · {daily.duration} мин</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <h2 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
          Практики
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {practices.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
              >
                <Link href={`/session?duration=${p.duration}&name=${encodeURIComponent(p.name)}`}>
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${p.gradient} border border-white/30 dark:border-slate-600/30 shadow-sm hover:shadow-md transition-shadow min-h-[100px] flex flex-col justify-between`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-slate-700 dark:text-slate-100 font-medium">
                        {p.name}
                      </span>
                      <Icon size={20} className="text-slate-600/80 dark:text-slate-400" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {p.duration} мин
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <h2 className="text-lg font-medium text-slate-700 dark:text-slate-300 mt-8 mb-4">
          Микро (1–3 мин)
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {microPractices.map((p, i) => {
            const Icon = p.icon;
            return (
              <Link key={p.id} href={`/session?duration=${p.duration}&name=${encodeURIComponent(p.name)}`}>
                <motion.div
                  className={`p-3 rounded-xl bg-gradient-to-br ${p.gradient} border border-white/30 dark:border-slate-600/30 text-center`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon size={18} className="mx-auto text-slate-600 dark:text-slate-400 mb-1" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-100">{p.duration} мин</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
