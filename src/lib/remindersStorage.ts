const REMINDERS_KEY = "zenflow_reminders";
const LAST_SHOWN_KEY = "zenflow_reminder_last_shown";

export type Reminder = {
  id: string;
  time: string;
  message: string;
  enabled: boolean;
};

export function getReminders(): Reminder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveReminders(reminders: Reminder[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  } catch {
    // ignore
  }
}

export function getLastShown(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LAST_SHOWN_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function setLastShown(id: string, dateStr: string): void {
  if (typeof window === "undefined") return;
  try {
    const prev = getLastShown();
    prev[id] = dateStr;
    localStorage.setItem(LAST_SHOWN_KEY, JSON.stringify(prev));
  } catch {
    // ignore
  }
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}
