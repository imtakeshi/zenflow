"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

const PATTERNS = [
  { id: "444", name: "4-4-4", desc: "Вдох 4 сек, задержка 4 сек, выдох 4 сек", inhale: 4, hold: 4, exhale: 4 },
  { id: "478", name: "4-7-8", desc: "Вдох 4 сек, задержка 7 сек, выдох 8 сек", inhale: 4, hold: 7, exhale: 8 },
  { id: "box", name: "Квадрат", desc: "4-4-4-4: вдох, задержка, выдох, пауза", inhale: 4, hold: 4, exhale: 4 },
];

export default function BreathPage() {
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
          Дыхательные упражнения
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-8">
          Выберите паттерн — откроется сессия с визуализацией дыхания
        </p>
        <div className="space-y-3">
          {PATTERNS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/session?duration=5&name=${encodeURIComponent(p.name + ": " + p.desc)}`}
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-teal-500/30 border border-white/30 dark:border-slate-600/30">
                  <p className="font-medium text-slate-800 dark:text-slate-100">{p.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{p.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
