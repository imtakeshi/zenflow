/**
 * Модель сессии медитации.
 * Хранится в localStorage (в веб-приложении аналог локальной БД).
 */
export type MeditationSession = {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  quality?: number; // 1–5 звёзд
  note?: string;
};

const SESSIONS_KEY = "zenflow_meditation_sessions";

function getStored(): MeditationSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function save(sessions: MeditationSession[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(-500)));
  } catch {
    // ignore
  }
}

/** Все сессии */
export function getSessions(): MeditationSession[] {
  return getStored();
}

/** Сессии за конкретную дату */
export function getSessionsForDate(dateStr: string): MeditationSession[] {
  return getStored().filter((s) => s.date === dateStr);
}

/** Сумма минут за дату (из сессий) */
export function getMinutesForDate(dateStr: string): number {
  return getSessionsForDate(dateStr).reduce((sum, s) => sum + s.durationMinutes, 0);
}

/** Добавить сессию (при завершении медитации или ручной отметке) */
export function addSession(session: Omit<MeditationSession, "id">): MeditationSession {
  const withId: MeditationSession = {
    ...session,
    id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };
  const list = [...getStored(), withId];
  save(list);
  return withId;
}

/** Обновить сессию (заметка, качество) */
export function updateSession(id: string, patch: Partial<Pick<MeditationSession, "quality" | "note">>): void {
  const list = getStored().map((s) => (s.id === id ? { ...s, ...patch } : s));
  save(list);
}

/** Удалить сессию */
export function deleteSession(id: string): void {
  save(getStored().filter((s) => s.id !== id));
}

/** Данные по дням для календаря: дата -> сумма минут (для совместимости с текущим календарём) */
export function getMinutesByDate(): Record<string, number> {
  const sessions = getStored();
  const out: Record<string, number> = {};
  for (const s of sessions) {
    out[s.date] = (out[s.date] || 0) + s.durationMinutes;
  }
  return out;
}
