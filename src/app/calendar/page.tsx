"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { CalendarGrid } from "@/components/CalendarGrid";

export default function CalendarPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

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
          Календарь медитаций
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          Нажмите на день, чтобы посмотреть сессии, заметки и оценку. Внутри дня можно отметить сессию вручную и быстро начать новую.
        </p>

        <div className="mb-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>Меньше</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800" title="Пропущен" />
            <div className="w-3 h-3 rounded bg-emerald-300 dark:bg-emerald-500/50" title="3–9 мин" />
            <div className="w-3 h-3 rounded bg-emerald-600 dark:bg-emerald-500" title="10+ мин" />
          </div>
          <span>Больше</span>
        </div>

        <CalendarGrid key={refreshKey} onRefresh={handleRefresh} />
      </main>
    </div>
  );
}
