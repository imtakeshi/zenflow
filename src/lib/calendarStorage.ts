const CALENDAR_KEY = "zenflow_calendar_days";

export function getCalendarData(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CALENDAR_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function addDayMinutes(minutes: number): void {
  if (typeof window === "undefined") return;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const data = getCalendarData();
    data[today] = (data[today] || 0) + minutes;
    localStorage.setItem(CALENDAR_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function getMinutesForDate(dateStr: string): number {
  const data = getCalendarData();
  return data[dateStr] || 0;
}
