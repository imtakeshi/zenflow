"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { guidedThemes } from "@/data/guided";
import { useState } from "react";

export default function GuidedPage() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-8">
          Выберите тему для направленной практики
        </p>
        <div className="space-y-3">
          {guidedThemes.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/session?duration=${t.duration}&name=${encodeURIComponent(t.name)}`}
                >
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
