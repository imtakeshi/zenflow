const STREAK_KEY = "zenflow_streak";
const LAST_DATE_KEY = "zenflow_last_meditation_date";
const LONGEST_KEY = "zenflow_longest_streak";

function todayStr(): string {
  return new Date().toDateString();
}

export function getStreakData(): { current: number; longest: number; lastDate: string | null } {
  if (typeof window === "undefined") return { current: 0, longest: 0, lastDate: null };
  try {
    const current = parseInt(localStorage.getItem(STREAK_KEY) || "0", 10);
    const longest = parseInt(localStorage.getItem(LONGEST_KEY) || "0", 10);
    const lastDate = localStorage.getItem(LAST_DATE_KEY);
    return { current, longest, lastDate };
  } catch {
    return { current: 0, longest: 0, lastDate: null };
  }
}

export function recordMeditationDay(): void {
  if (typeof window === "undefined") return;
  try {
    const today = todayStr();
    const { current, longest, lastDate } = getStreakData();
    let newStreak = current;
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      if (lastDate === yesterdayStr) {
        newStreak = current + 1;
      } else {
        newStreak = 1;
      }
      localStorage.setItem(LAST_DATE_KEY, today);
      localStorage.setItem(STREAK_KEY, String(newStreak));
      if (newStreak > longest) {
        localStorage.setItem(LONGEST_KEY, String(newStreak));
      }
    }
  } catch {
    // ignore
  }
}
