const MOOD_KEY = "zenflow_mood";

export type MoodEntry = { date: string; value: number };

export function getMoodEntries(): MoodEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MOOD_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function setMoodForToday(value: number): void {
  if (typeof window === "undefined") return;
  try {
    const entries = getMoodEntries();
    const today = new Date().toDateString();
    const filtered = entries.filter((e) => e.date !== today);
    filtered.push({ date: today, value });
    localStorage.setItem(MOOD_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

export function getMoodToday(): number | null {
  const today = new Date().toDateString();
  const entries = getMoodEntries();
  const found = entries.find((e) => e.date === today);
  return found ? found.value : null;
}
