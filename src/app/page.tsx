"use client";

import { motion } from "framer-motion";
import { getGreeting } from "@/lib/utils";
import { useMeditationStats } from "@/hooks/useMeditationStats";
import { practices } from "@/data/practices";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function Dashboard() {
  const { totalMinutes } = useMeditationStats();
  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 text-slate-700 dark:text-slate-200">
      <header className="flex justify-end p-4">
        <ThemeToggle />
      </header>

      <main className="max-w-lg mx-auto px-4 pb-12">
        <motion.h1
          className="text-2xl font-light text-slate-600 dark:text-slate-400 mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {greeting}
        </motion.h1>
        <motion.p
          className="text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          ZenFlow
        </motion.p>

        <motion.section
          className="mb-10 p-5 rounded-2xl bg-white/80 dark:bg-slate-800/60 shadow-sm border border-slate-100 dark:border-slate-700/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
            <Clock size={16} />
            <span>Ваша практика</span>
          </div>
          <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            {totalMinutes} мин
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            всего медитации
          </p>
        </motion.section>

        <h2 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
          Практики
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {practices.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
              >
                <Link href={`/session?duration=${p.duration}&name=${encodeURIComponent(p.name)}`}>
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${p.gradient} border border-white/30 dark:border-slate-600/30 shadow-sm hover:shadow-md transition-shadow min-h-[100px] flex flex-col justify-between`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-slate-700 dark:text-slate-100 font-medium">
                        {p.name}
                      </span>
                      <Icon size={20} className="text-slate-600/80 dark:text-slate-400" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {p.duration} мин
                    </span>
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
