"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getStreakData,
} from "@/lib/streaks";
import {
  getMinutesForDate,
  getSessionsForDate,
  addSession,
  updateSession,
  type MeditationSession,
} from "@/lib/meditationSession";
import { getCalendarData } from "@/lib/calendarStorage";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS =
  "январь февраль март апрель май июнь июль август сентябрь октябрь ноябрь декабрь".split(" ");

/** Минуты за день: сессии или legacy calendarStorage */
function getMinutes(dateStr: string): number {
  const fromSessions = getMinutesForDate(dateStr);
  if (fromSessions > 0) return fromSessions;
  return getCalendarData()[dateStr] ?? 0;
}

/** Уровень цвета: 0 пропущен, 1 короткая (3–9), 2 хорошо (10+) */
function getLevel(minutes: number): 0 | 1 | 2 {
  if (minutes < 3) return 0;
  if (minutes < 10) return 1;
  return 2;
}

/** Дни одного месяца для сетки (с пустыми ячейками в начале) */
function getDaysOfMonth(year: number, month: number): { date: string; day: number }[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = (first.getDay() + 6) % 7;
  const days: { date: string; day: number }[] = [];
  for (let i = 0; i < startPad; i++) days.push({ date: "", day: 0 });
  for (let d = 1; d <= last.getDate(); d++) {
    const date = new Date(year, month, d);
    days.push({ date: date.toISOString().slice(0, 10), day: d });
  }
  return days;
}

/** Статистика за месяц */
function getMonthStats(year: number, month: number) {
  const last = new Date(year, month + 1, 0).getDate();
  let totalMinutes = 0;
  let daysWithMeditation = 0;
  for (let d = 1; d <= last; d++) {
    const dateStr = new Date(year, month, d).toISOString().slice(0, 10);
    const min = getMinutes(dateStr);
    if (min > 0) {
      daysWithMeditation++;
      totalMinutes += min;
    }
  }
  const pct = last > 0 ? Math.round((daysWithMeditation / last) * 100) : 0;
  const avg = daysWithMeditation > 0 ? Math.round(totalMinutes / daysWithMeditation) : 0;
  return { daysWithMeditation, totalMinutes, pct, avg, totalDays: last };
}

type DayModalProps = {
  dateStr: string;
  onClose: () => void;
  onUpdate: () => void;
};

function DayModal({ dateStr, onClose, onUpdate }: DayModalProps) {
  const [sessions, setSessionsState] = useState<MeditationSession[]>(() => getSessionsForDate(dateStr));
  const totalMinutes = sessions.reduce((s, x) => s + x.durationMinutes, 0) || getCalendarData()[dateStr] || 0;
  const refreshSessions = () => {
    setSessionsState(getSessionsForDate(dateStr));
    onUpdate();
  };
  const [editingId, setEditingId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [quality, setQuality] = useState(0);
  const [quickMinutes, setQuickMinutes] = useState("");

  const d = new Date(dateStr + "T12:00:00");
  const dateLabel = d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  const isToday = dateStr === new Date().toISOString().slice(0, 10);

  const handleSaveQuick = () => {
    const min = parseInt(quickMinutes, 10);
    if (min > 0 && min <= 120) {
      addSession({ date: dateStr, durationMinutes: min });
      setQuickMinutes("");
      refreshSessions();
    }
  };

  const handleUpdateSession = (id: string, patch: { quality?: number; note?: string }) => {
    updateSession(id, patch);
    setEditingId(null);
    setSessionsState(getSessionsForDate(dateStr));
    onUpdate();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 dark:bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[85vh] overflow-y-auto"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{dateLabel}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Всего минут</p>
            <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{totalMinutes} мин</p>
          </div>

          {sessions.length > 0 && (
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Сессии</p>
              <ul className="space-y-2">
                {sessions.map((s) => (
                  <li
                    key={s.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex justify-between items-start"
                  >
                    <div>
                      <span className="font-medium text-slate-800 dark:text-slate-100">{s.durationMinutes} мин</span>
                      {editingId === s.id ? (
                        <div className="mt-2 space-y-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((q) => (
                              <button
                                key={q}
                                onClick={() => setQuality(q)}
                                className={`text-lg ${quality >= q ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                          <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Заметка"
                            className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-2"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateSession(s.id, { quality: quality || undefined, note: note || undefined })}
                              className="text-sm px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-600 text-white"
                            >
                              Сохранить
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-sm text-slate-500">
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1">
                          {s.quality != null && (
                            <span className="text-amber-500 text-sm">
                              {"★".repeat(s.quality)}
                            </span>
                          )}
                          {s.note && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{s.note}</p>}
                          <button
                            onClick={() => {
                              setEditingId(s.id);
                              setNote(s.note || "");
                              setQuality(s.quality || 0);
                            }}
                            className="text-xs text-slate-500 mt-1 hover:underline"
                          >
                            Изменить
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isToday && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Отметить сессию сегодня</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={quickMinutes}
                  onChange={(e) => setQuickMinutes(e.target.value)}
                  placeholder="Минуты"
                  className="w-20 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                />
                <button
                  onClick={handleSaveQuick}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
                >
                  Добавить
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

type CalendarGridProps = {
  onRefresh?: () => void;
};

export function CalendarGrid({ onRefresh }: CalendarGridProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });

  const days = useMemo(() => getDaysOfMonth(year, month), [year, month]);
  const stats = useMemo(() => getMonthStats(year, month), [year, month]);

  // Обновить стрик при монтировании и при смене даты/обновлении
  useEffect(() => {
    if (typeof window !== "undefined") setStreak(getStreakData());
  }, [selectedDate, year, month]);

  const levelColors = [
    "bg-slate-100 dark:bg-slate-800 border-slate-200/50 dark:border-slate-700/50",
    "bg-emerald-300 dark:bg-emerald-500/50 border-emerald-300 dark:border-emerald-500/50",
    "bg-emerald-600 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-400",
  ];

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Стрики */}
      <div className="flex flex-wrap gap-4 sm:gap-6">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Текущий стрик</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{streak.current} дней</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20">
          <span className="text-2xl">⭐</span>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Лучший стрик</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{streak.longest} дней</p>
          </div>
        </div>
      </div>

      {/* Навигация по месяцам */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (month === 0) {
              setMonth(11);
              setYear((y) => y - 1);
            } else setMonth((m) => m - 1);
          }}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
          aria-label="Предыдущий месяц"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 capitalize">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={() => {
            if (month === 11) {
              setMonth(0);
              setYear((y) => y + 1);
            } else setMonth((m) => m + 1);
          }}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
          aria-label="Следующий месяц"
        >
          →
        </button>
      </div>

      {/* Сетка дней */}
      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium py-1"
          >
            {d}
          </div>
        ))}
        {days.map((cell, i) => {
          if (!cell.date) {
            return <div key={`e-${i}`} className="aspect-square rounded-lg" />;
          }
          const minutes = getMinutes(cell.date);
          const level = getLevel(minutes);
          const isToday = cell.date === todayStr;
          return (
            <motion.button
              key={cell.date}
              type="button"
              onClick={() => setSelectedDate(cell.date)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] sm:text-xs font-medium transition-transform active:scale-95 ${levelColors[level]} border ${isToday ? "ring-2 ring-amber-400 dark:ring-amber-500 ring-offset-2 dark:ring-offset-slate-900" : ""} ${minutes > 0 ? "text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}`}
              title={minutes > 0 ? `${cell.date}: ${minutes} мин` : cell.date}
            >
              {cell.day}
              {minutes > 0 && <span className="opacity-80">{minutes}м</span>}
            </motion.button>
          );
        })}
      </div>

      {/* Статистика за месяц */}
      <div className="grid grid-cols-3 gap-3 text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
        <div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.pct}%</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">дней с медитацией</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.totalMinutes}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">мин за месяц</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.avg}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">мин в ср. за день</p>
        </div>
      </div>

      <AnimatePresence>
        {selectedDate && (
          <DayModal
            dateStr={selectedDate}
            onClose={() => setSelectedDate(null)}
            onUpdate={() => onRefresh?.()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
