"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { getCalendarData } from "@/lib/calendarStorage";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = "янв фев мар апр май июн июл авг сен окт ноя дек".split(" ");

function getLevel(minutes: number): 0 | 1 | 2 | 3 {
  if (minutes === 0) return 0;
  if (minutes < 5) return 1;
  if (minutes < 15) return 2;
  return 3;
}

function getDaysForGrid(weeksBack: number): { date: string; day: number; month: string; year: number }[] {
  const totalDays = weeksBack * 7;
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - totalDays + 1);
  const mondayOffset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - mondayOffset);
  const days: { date: string; day: number; month: string; year: number }[] = [];
  const cur = new Date(start);
  for (let i = 0; i < totalDays; i++) {
    const dateStr = cur.toISOString().slice(0, 10);
    days.push({
      date: dateStr,
      day: cur.getDate(),
      month: MONTHS[cur.getMonth()],
      year: cur.getFullYear(),
    });
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

export default function CalendarPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState<Record<string, number>>({});
  const weeksBack = 12;
  const days = getDaysForGrid(weeksBack);

  useEffect(() => {
    setData(getCalendarData());
  }, []);

  const levelColors = [
    "bg-slate-100 dark:bg-slate-800",
    "bg-emerald-300 dark:bg-emerald-600/60",
    "bg-emerald-500 dark:bg-emerald-500/80",
    "bg-emerald-600 dark:bg-emerald-400",
  ];

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
          Календарь
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          Дни с медитацией выделены цветом. Чем больше минут — тем насыщеннее цвет.
        </p>

        <div className="mb-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>Меньше</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((l) => (
              <div
                key={l}
                className={`w-4 h-4 rounded ${levelColors[l]}`}
                title={l === 0 ? "0 мин" : l === 1 ? "1–5 мин" : l === 2 ? "5–15 мин" : "15+ мин"}
              />
            ))}
          </div>
          <span>Больше</span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[280px]">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium"
                >
                  {d}
                </div>
              ))}
            </div>
            <motion.div
              className="grid grid-cols-7 gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {days.map((cell) => {
                const minutes = data[cell.date] ?? 0;
                const level = getLevel(minutes);
                const isToday = cell.date === new Date().toISOString().slice(0, 10);
                return (
                  <div
                    key={cell.date}
                    className={`aspect-square rounded-md ${levelColors[level]} flex flex-col items-center justify-center border border-slate-200/50 dark:border-slate-700/50 ${isToday ? "ring-2 ring-slate-500 dark:ring-slate-400" : ""}`}
                    title={minutes > 0 ? `${cell.date}: ${minutes} мин` : cell.date}
                  >
                    <span className={`text-[10px] leading-tight ${minutes > 0 ? "text-slate-700 dark:text-slate-200 font-medium" : "text-slate-400 dark:text-slate-500"}`}>
                      {cell.day}
                    </span>
                    {minutes > 0 && (
                      <span className="text-[9px] text-slate-600 dark:text-slate-300">
                        {minutes}м
                      </span>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          Последние {weeksBack} недель. Сегодня выделен обводкой.
        </p>
      </main>
    </div>
  );
}
