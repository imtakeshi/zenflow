"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { getJournalEntries } from "@/lib/journalStorage";

type Entry = { date: string; duration: number; text: string };
type RangeFilter = "all" | "7" | "30";

export default function JournalPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<RangeFilter>("all");

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const filtered = useMemo(() => {
    const lower = search.trim().toLowerCase();
    const now = new Date();
    const msInDay = 24 * 60 * 60 * 1000;

    return entries.filter((e) => {
      const date = new Date(e.date);
      if (range === "7" && now.getTime() - date.getTime() > 7 * msInDay) return false;
      if (range === "30" && now.getTime() - date.getTime() > 30 * msInDay) return false;

      if (!lower) return true;
      return (
        e.text.toLowerCase().includes(lower) ||
        formatDate(e.date).toLowerCase().includes(lower)
      );
    });
  }, [entries, search, range]);

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
          Журнал
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          Ваши записи после сессий
        </p>

        {entries.length > 0 && (
          <div className="mb-6 space-y-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по тексту или дате"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setRange("all")}
                className={`px-3 py-1.5 rounded-full ${
                  range === "all"
                    ? "bg-slate-800 dark:bg-slate-700 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                Всё время
              </button>
              <button
                type="button"
                onClick={() => setRange("7")}
                className={`px-3 py-1.5 rounded-full ${
                  range === "7"
                    ? "bg-slate-800 dark:bg-slate-700 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                Последние 7 дней
              </button>
              <button
                type="button"
                onClick={() => setRange("30")}
                className={`px-3 py-1.5 rounded-full ${
                  range === "30"
                    ? "bg-slate-800 dark:bg-slate-700 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                Последние 30 дней
              </button>
            </div>
          </div>
        )}

        {entries.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Пока записей нет. После медитации можно оставить заметку в окне завершения.
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            По текущим фильтрам и поиску записей не найдено.
          </p>
        ) : (
          <div className="space-y-4">
            {filtered.map((e, i) => (
              <motion.div
                key={e.date + i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50"
              >
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {formatDate(e.date)} · {e.duration} мин
                </p>
                <p className="text-slate-800 dark:text-slate-100 whitespace-pre-wrap">{e.text}</p>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
