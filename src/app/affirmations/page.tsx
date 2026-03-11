"use client";

import { useSearchParams, useRouter } from "next/navigation";
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

const CATEGORY_LABELS: Record<string, string> = {
  any: "Любая тема",
  calm: "Спокойствие",
  "self-love": "Самопринятие",
  focus: "Фокус",
  gratitude: "Благодарность",
};

const CACHE_KEY = "zenflow_affirmations_v3";

function getCacheKey(period: string, category: string): string {
  const now = new Date();
  if (period === "day") return `day_${category}_${now.toDateString()}`;
  if (period === "week") return `week_${category}_${now.getFullYear()}_${Math.floor(now.getDate() / 7)}`;
  return `month_${category}_${now.getFullYear()}_${now.getMonth()}`;
}

function AffirmationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const period = searchParams.get("period") || "day";
  const category = searchParams.get("category") || "any";
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!["day", "week", "month"].includes(period)) return;

    const cacheKey = getCacheKey(period, category);
    const cached = typeof window !== "undefined" ? localStorage.getItem(`${CACHE_KEY}_${cacheKey}`) : null;
    if (cached) {
      setAffirmation(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/affirmations?period=${period}&category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const text = (data.affirmation && data.affirmation.text) || data.affirmation || "Попробуйте обновить страницу.";
        setAffirmation(text);
        try {
          localStorage.setItem(`${CACHE_KEY}_${cacheKey}`, text);
        } catch {}
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [period, category]);

  const updateQuery = (nextPeriod: string, nextCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", nextPeriod);
    params.set("category", nextCategory);
    router.push(`/affirmations?${params.toString()}`);
  };

  const handleChangePeriod = (next: "day" | "week" | "month") => {
    updateQuery(next, category);
  };

  const handleChangeCategory = (next: string) => {
    updateQuery(period, next);
  };

  const handleNewRandom = () => {
    // Сбросить кеш и загрузить новую случайную аффирмацию в рамках выбранных настроек
    const cacheKey = getCacheKey(period, category);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`${CACHE_KEY}_${cacheKey}`);
      } catch {}
    }
    setLoading(true);
    setError(null);
    fetch(`/api/affirmations?period=${period}&category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const text = (data.affirmation && data.affirmation.text) || data.affirmation || "Попробуйте обновить страницу.";
        setAffirmation(text);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

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
          className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {LABELS[period] || "Аффирмация"}
        </motion.h1>

        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200">
            Период: {LABELS[period] || "день"}
          </span>
          <span className="px-2 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200">
            Тема: {CATEGORY_LABELS[category] || CATEGORY_LABELS.any}
          </span>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(["day", "week", "month"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleChangePeriod(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                period === p
                  ? "bg-slate-800 dark:bg-slate-700 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              }`}
            >
              {LABELS[p]}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleChangeCategory(key)}
              className={`px-3 py-1.5 rounded-full text-xs ${
                category === key
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

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
          <motion.div
            className="mb-6 p-5 rounded-2xl bg-white/90 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-100">
              {affirmation}
            </p>
          </motion.div>
        )}

        <button
          type="button"
          onClick={handleNewRandom}
          className="w-full mt-2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Показать ещё одну аффирмацию
        </button>
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
