"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { getJournalEntries } from "@/lib/journalStorage";

export default function JournalPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [entries, setEntries] = useState<{ date: string; duration: number; text: string }[]>([]);

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

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
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-8">
          Ваши записи после сессий
        </p>
        {entries.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Пока записей нет. После медитации можно оставить заметку в окне завершения.
          </p>
        ) : (
          <div className="space-y-4">
            {entries.map((e, i) => (
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
