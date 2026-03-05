"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("zenflow_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("zenflow_theme", next ? "dark" : "light");
  };

  return (
    <motion.button
      onClick={toggle}
      className="p-2 rounded-full bg-slate-200/80 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-300/80 dark:hover:bg-slate-600/50 transition-colors"
      whileTap={{ scale: 0.95 }}
      aria-label="Переключить тему"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </motion.button>
  );
}
