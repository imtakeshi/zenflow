"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { guidedThemes } from "@/data/guided";

type GuidedFilter = "all" | "sleep" | "stress" | "focus" | "gratitude" | "kindness";

export default function GuidedPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<GuidedFilter>("all");

  const filtered = useMemo(
    () =>
      guidedThemes.filter((t) => {
        if (filter === "all") return true;
        if (filter === "sleep") return t.id === "sleep";
        if (filter === "stress") return t.id === "stress" || t.id === "anxiety";
        if (filter === "focus") return t.id === "focus";
        if (filter === "gratitude") return t.id === "gratitude";
        if (filter === "kindness") return t.id === "loving-kindness";
        return true;
      }),
    [filter]
  );

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
          Гид по темам
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          Выберите тему под своё состояние — стресс, сон, фокус или благодарность.
        </p>

        <div className="mb-6 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full ${
              filter === "all"
                ? "bg-slate-800 dark:bg-slate-700 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            }`}
          >
            Все темы
          </button>
          <button
            type="button"
            onClick={() => setFilter("stress")}
            className={`px-3 py-1.5 rounded-full ${
              filter === "stress"
                ? "bg-rose-500 text-white"
                : "bg-rose-50 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200"
            }`}
          >
            Стресс и тревога
          </button>
          <button
            type="button"
            onClick={() => setFilter("sleep")}
            className={`px-3 py-1.5 rounded-full ${
              filter === "sleep"
                ? "bg-indigo-600 text-white"
                : "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200"
            }`}
          >
            Сон
          </button>
          <button
            type="button"
            onClick={() => setFilter("focus")}
            className={`px-3 py-1.5 rounded-full ${
              filter === "focus"
                ? "bg-amber-500 text-white"
                : "bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200"
            }`}
          >
            Фокус
          </button>
          <button
            type="button"
            onClick={() => setFilter("gratitude")}
            className={`px-3 py-1.5 rounded-full ${
              filter === "gratitude"
                ? "bg-yellow-400 text-slate-900"
                : "bg-yellow-50 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
            }`}
          >
            Благодарность
          </button>
          <button
            type="button"
            onClick={() => setFilter("kindness")}
            className={`px-3 py-1.5 rounded-full ${
              filter === "kindness"
                ? "bg-teal-500 text-white"
                : "bg-teal-50 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200"
            }`}
          >
            Любящая доброта
          </button>
        </div>

        <div className="space-y-3">
          {filtered.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/session?duration=${t.duration}&name=${encodeURIComponent(t.name)}`}>
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${t.gradient} border border-white/30 dark:border-slate-600/30 flex items-center gap-4`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/30 dark:bg-slate-700/30 flex items-center justify-center">
                      <Icon size={24} className="text-slate-700 dark:text-slate-200" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 dark:text-slate-100">{t.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{t.description}</p>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t.duration} мин</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
