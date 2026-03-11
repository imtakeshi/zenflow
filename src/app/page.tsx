"use client";

import { useEffect, useState } from "react";
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
import { getReminders, type Reminder } from "@/lib/remindersStorage";
import { getMinutesForDate } from "@/lib/meditationSession";
import Link from "next/link";
import { Clock, Timer, Flame, BookOpen, Bell, Award, Zap } from "lucide-react";

const DAILY_GOAL_MINUTES = 10;

type NextReminderState = {
  reminder: Reminder | null;
  permission: NotificationPermission | null;
  supported: boolean;
};

function getCurrentTimeHHMM(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

function NextReminderBanner() {
  const [state, setState] = useState<NextReminderState>({
    reminder: null,
    permission: null,
    supported: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const supported = "Notification" in window;
    const permission = supported ? Notification.permission : null;

    const reminders = getReminders().filter((r) => r.enabled);
    if (reminders.length === 0) {
      setState({ reminder: null, permission, supported });
      return;
    }

    const now = getCurrentTimeHHMM();
    const sorted = [...reminders].sort((a, b) => a.time.localeCompare(b.time));
    const todayOrNext =
      sorted.find((r) => r.time >= now) ??
      sorted[0];

    setState({ reminder: todayOrNext, permission, supported });
  }, []);

  const { reminder, permission, supported } = state;

  if (!supported || !reminder) return null;

  const canRequestPermission = permission === "default";

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    try {
      const result = await Notification.requestPermission();
      setState((prev) => ({ ...prev, permission: result }));
    } catch {
      // ignore
    }
  };

  return (
    <motion.section
      className="mb-4 p-4 rounded-2xl bg-indigo-50/90 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-700/60 flex flex-col gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
    >
      <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-200 text-sm">
        <Bell size={16} />
        <span>Напоминание о практике</span>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-100">
        Следующее напоминание в <span className="font-semibold">{reminder.time}</span> — {reminder.message}
      </p>
      <div className="flex gap-2 flex-wrap">
        <Link
          href="/reminders"
          className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 transition-colors"
        >
          Управлять напоминаниями
        </Link>
        {canRequestPermission && (
          <button
            type="button"
            onClick={requestPermission}
            className="px-3 py-1.5 rounded-full border border-indigo-300 dark:border-indigo-600 text-xs text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100/70 dark:hover:bg-indigo-800/50 transition-colors"
          >
            Включить уведомления
          </button>
        )}
      </div>
    </motion.section>
  );
}

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalMinutes } = useMeditationStats();
  const { name, setName, hasName, isReady } = useUserName();
  const [splashDone, setSplashDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const greeting = getGreeting();
  const greetingText = name ? `${greeting}, ${name}` : greeting;
  const { current: streak, longest } = getStreakData();
  const daily = getDailyMeditation();
  const DailyIcon = daily.icon;
  const todayStr = typeof window !== "undefined" ? new Date().toISOString().slice(0, 10) : "";
  const todayMinutes = todayStr ? getMinutesForDate(todayStr) : 0;
  const dailyProgress = Math.min(100, Math.round((todayMinutes / DAILY_GOAL_MINUTES) * 100));

  const badges: { id: string; label: string; unlocked: boolean; icon: string }[] = [
    { id: "streak-3", label: "3 дня подряд", unlocked: streak >= 3 || longest >= 3, icon: "🔥" },
    { id: "streak-7", label: "Неделя", unlocked: streak >= 7 || longest >= 7, icon: "⭐" },
    { id: "streak-30", label: "Месяц", unlocked: longest >= 30, icon: "🏆" },
    { id: "total-60", label: "1 час практики", unlocked: totalMinutes >= 60, icon: "🌙" },
    { id: "total-300", label: "5 часов", unlocked: totalMinutes >= 300, icon: "💎" },
    { id: "daily", label: "Цель дня", unlocked: todayMinutes >= DAILY_GOAL_MINUTES, icon: "🎯" },
  ];

  const achievementMessages: string[] = [];
  if (totalMinutes === 0 && streak === 0) {
    achievementMessages.push("Как только вы проведёте первую медитацию, здесь появятся ваши достижения.");
  } else {
    if (totalMinutes >= 1 && totalMinutes < 5) {
      achievementMessages.push("Первая минута медитации — уже шаг к себе.");
    } else if (totalMinutes >= 5 && totalMinutes < 15) {
      achievementMessages.push("Вы уже медитировали больше 5 минут — отличный старт!");
    } else if (totalMinutes >= 15 && totalMinutes < 60) {
      achievementMessages.push("Больше 15 минут практики — вы выстраиваете полезную привычку.");
    } else if (totalMinutes >= 60 && totalMinutes < 300) {
      achievementMessages.push("Больше часа медитации суммарно — это серьёзный вклад в себя.");
    } else if (totalMinutes >= 300) {
      achievementMessages.push("Больше 5 часов практики — впечатляющий путь осознанности.");
    }

    if (streak >= 1 && streak < 3) {
      achievementMessages.push("Вы практиковали сегодня — это главное.");
    } else if (streak >= 3 && streak < 7) {
      achievementMessages.push("Серия 3+ дней подряд — продолжайте в том же духе.");
    } else if (streak >= 7) {
      achievementMessages.push("Неделя ежедневной практики — это уже серьёзный уровень!");
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900" />
    );
  }

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
        <NextReminderBanner />
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
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Цель дня: {todayMinutes}/{DAILY_GOAL_MINUTES} мин</span>
              {dailyProgress >= 100 && <span>🎯 Готово!</span>}
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${dailyProgress}%` }}
                transition={{ duration: 0.5, delay: 0.15 }}
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="mb-4 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.11 }}
        >
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 text-sm mb-3">
            <Zap size={16} />
            <span>Бейджи</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b.id}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
                  b.unlocked
                    ? "bg-amber-200/80 dark:bg-amber-700/50 text-amber-900 dark:text-amber-100"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                }`}
                title={b.label}
              >
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </span>
            ))}
          </div>
        </motion.section>

        {achievementMessages.length > 0 && (
          <motion.section
            className="mb-4 p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.11 }}
          >
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-200 text-sm mb-2">
              <Award size={16} />
              <span>Ваши достижения</span>
            </div>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-100">
              {achievementMessages.map((msg) => (
                <li key={msg}>• {msg}</li>
              ))}
            </ul>
          </motion.section>
        )}

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
                    className={`p-4 rounded-2xl bg-gradient-to-br ${p.gradient} border border-white/30 dark:border-slate-600/30 shadow-sm hover:shadow-md transition-shadow min-h-[120px] flex flex-col justify-between`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-slate-700 dark:text-slate-100 font-medium">
                        {p.name}
                      </span>
                      <Icon size={20} className="text-slate-600/80 dark:text-slate-400" />
                    </div>
                    <span className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      {p.duration} мин ·{" "}
                      {p.goal === "sleep"
                        ? "сон"
                        : p.goal === "stress"
                        ? "стресс"
                        : p.goal === "focus"
                        ? "фокус"
                        : "спокойствие"}
                      {p.description ? ` — ${p.description}` : null}
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
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-100">
                    {p.duration} мин
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
