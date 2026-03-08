"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Calendar, CalendarDays, CalendarRange, Timer, BookOpen, Wind, BookMarked, Bell } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const items = [
  { href: "/timer", label: "Таймер медитации", Icon: Timer },
  { href: "/guided", label: "Гид по темам", Icon: BookOpen },
  { href: "/breath", label: "Дыхательные упражнения", Icon: Wind },
  { href: "/affirmations?period=day", label: "Аффирмация на день", Icon: Calendar },
  { href: "/affirmations?period=week", label: "Аффирмация на неделю", Icon: CalendarDays },
  { href: "/affirmations?period=month", label: "Аффирмация месяца", Icon: CalendarRange },
  { href: "/journal", label: "Журнал", Icon: BookMarked },
  { href: "/reminders", label: "Напоминания", Icon: Bell },
];

export function Sidebar({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-700">
              <span className="font-semibold text-slate-800 dark:text-slate-100">Меню</span>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="p-4">
              {items.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Icon size={20} className="text-slate-500" />
                  {label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
