"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Bell } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { getReminders, saveReminders, type Reminder } from "@/lib/remindersStorage";

export default function RemindersPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [time, setTime] = useState("09:00");
  const [message, setMessage] = useState("Пора сделать 3-минутный breathwork");
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    setReminders(getReminders());
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const p = await Notification.requestPermission();
    setPermission(p);
  };

  const addReminder = () => {
    const newR: Reminder = {
      id: Date.now().toString(),
      time,
      message: message.trim() || "Время для медитации",
      enabled: true,
    };
    const next = [...reminders, newR];
    setReminders(next);
    saveReminders(next);
  };

  const removeReminder = (id: string) => {
    const next = reminders.filter((r) => r.id !== id);
    setReminders(next);
    saveReminders(next);
  };

  const toggleReminder = (id: string) => {
    const next = reminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setReminders(next);
    saveReminders(next);
  };

  const permissionText =
    permission === "granted"
      ? "Уведомления включены — напоминания будут приходить в указанное время."
      : permission === "denied"
      ? "Уведомления заблокированы в настройках браузера. Чтобы включить, откройте настройки сайта."
      : "Браузер ещё не спросил про уведомления. Нажмите кнопку ниже, чтобы разрешить.";

  const setPresetTime = (preset: "morning" | "day" | "evening") => {
    if (preset === "morning") setTime("08:00");
    if (preset === "day") setTime("13:00");
    if (preset === "evening") setTime("21:00");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 text-slate-700 dark:text-slate-200">
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="flex justify-between items-center p-4">
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-full bg-slate-200/80 dark:bg-slate-700/50"
          aria-label="Меню"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <ArrowLeft size={20} />
          Назад
        </Link>
      </header>
      <main className="max-w-lg mx-auto px-4 pb-12">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Напоминания
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
          Уведомления приходят, когда приложение открыто или в фоне.
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">
          {permissionText}
        </p>

        {permission !== "granted" && (
          <motion.div
            className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
              Чтобы получать напоминания, нажмите на кнопку ниже и разрешите уведомления для этого сайта.
            </p>
            <button
              onClick={requestPermission}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium"
            >
              <Bell size={16} />
              Разрешить уведомления
            </button>
          </motion.div>
        )}

        <div className="mb-6 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Добавить напоминание</p>
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <label className="text-slate-500 dark:text-slate-400 text-sm w-14">Время</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="flex gap-2 pl-14">
              <button
                type="button"
                onClick={() => setPresetTime("morning")}
                className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Утро · 08:00
              </button>
              <button
                type="button"
                onClick={() => setPresetTime("day")}
                className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                День · 13:00
              </button>
              <button
                type="button"
                onClick={() => setPresetTime("evening")}
                className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Вечер · 21:00
              </button>
            </div>
            <div className="flex gap-2 items-start">
              <label className="text-slate-500 dark:text-slate-400 text-sm w-14 pt-2">Текст</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Пора сделать 3-минутный breathwork"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
            <button
              onClick={addReminder}
              className="flex items-center gap-2 w-full justify-center py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-sm font-medium"
            >
              <Plus size={18} />
              Добавить
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Ваши напоминания</p>
        {reminders.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Пока нет. Добавьте время и текст выше.
          </p>
        ) : (
          <ul className="space-y-2">
            {reminders.map((r) => (
              <motion.li
                key={r.id}
                layout
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50"
              >
                <button
                  onClick={() => toggleReminder(r.id)}
                  className={`flex-shrink-0 w-11 h-6 rounded-full transition-colors ${
                    r.enabled ? "bg-slate-700 dark:bg-slate-600" : "bg-slate-300 dark:bg-slate-600"
                  }`}
                  aria-label={r.enabled ? "Выкл" : "Вкл"}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      r.enabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                    style={{ marginTop: 2 }}
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 dark:text-slate-100">{r.time}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{r.message}</p>
                </div>
                <button
                  onClick={() => removeReminder(r.id)}
                  className="p-2 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                  aria-label="Удалить"
                >
                  <Trash2 size={18} />
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
