"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

const LABELS: Record<string, string> = {
  day: "Аффирмация на день",
  week: "Аффирмация на неделю",
  month: "Аффирмация месяца",
};

const CACHE_KEY = "zenflow_affirmations";

function getCacheKey(period: string): string {
  const now = new Date();
  if (period === "day") return `day_${now.toDateString()}`;
  if (period === "week") return `week_${now.getFullYear()}_${Math.floor(now.getDate() / 7)}`;
  return `month_${now.getFullYear()}_${now.getMonth()}`;
}

function AffirmationsContent() {
  const searchParams = useSearchParams();
  const period = searchParams.get("period") || "day";
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!["day", "week", "month"].includes(period)) return;

    const cacheKey = getCacheKey(period);
    const cached = typeof window !== "undefined" ? localStorage.getItem(`${CACHE_KEY}_${cacheKey}`) : null;
    if (cached) {
      setAffirmation(cached);
      setLoading(false);
      return;
    }

    fetch(`/api/affirmations?period=${period}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const text = data.affirmation || "Попробуйте обновить страницу.";
        setAffirmation(text);
        try {
          localStorage.setItem(`${CACHE_KEY}_${cacheKey}`, text);
        } catch {}
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 text-slate-700 dark:text-slate-200">
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
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft size={20} />
          <span>Назад</span>
        </Link>
      </header>
      <main className="max-w-lg mx-auto px-4 py-8">
        <motion.h1
          className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {LABELS[period] || "Аффирмация"}
        </motion.h1>
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        )}
        {error && (
          <motion.p
            className="text-rose-600 dark:text-rose-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}
        {!loading && !error && affirmation && (
          <motion.p
            className="text-xl leading-relaxed text-slate-800 dark:text-slate-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {affirmation}
          </motion.p>
        )}
      </main>
    </div>
  );
}

export default function AffirmationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <AffirmationsContent />
    </Suspense>
  );
}
