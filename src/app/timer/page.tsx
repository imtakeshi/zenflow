"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Bell } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

const DURATIONS = [5, 10, 15, 20, 30];
const INTERVALS = [0, 5, 10];

export default function TimerPage() {
  const [duration, setDuration] = useState(10);
  const [intervalMin, setIntervalMin] = useState(5);
  const [menuOpen, setMenuOpen] = useState(false);

  const sessionUrl = `/session?duration=${duration}&name=Свободная%20медитация&interval=${intervalMin}`;

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
      <main className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-8">
          Таймер медитации
        </h1>
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-3">
            <Clock size={18} />
            <span>Длительность</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((m) => (
              <button
                key={m}
                onClick={() => setDuration(m)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  duration === m
                    ? "bg-slate-800 dark:bg-slate-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {m} мин
              </button>
            ))}
          </div>
        </motion.section>
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-3">
            <Bell size={18} />
            <span>Колокольчик каждые</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {INTERVALS.map((m) => (
              <button
                key={m}
                onClick={() => setIntervalMin(m)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  intervalMin === m
                    ? "bg-slate-800 dark:bg-slate-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {m === 0 ? "Выкл" : `${m} мин`}
              </button>
            ))}
          </div>
        </motion.section>
        <Link href={sessionUrl}>
          <motion.button
            className="w-full py-4 rounded-2xl bg-slate-800 dark:bg-slate-700 text-white font-semibold text-lg shadow-lg"
            whileTap={{ scale: 0.98 }}
          >
            Начать
          </motion.button>
        </Link>
      </main>
    </div>
  );
}
