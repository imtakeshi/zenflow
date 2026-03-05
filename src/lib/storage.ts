const STORAGE_KEY = "zenflow_meditation_minutes";

export function getMeditationMinutes(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export function addMeditationMinutes(minutes: number): void {
  if (typeof window === "undefined") return;
  try {
    const current = getMeditationMinutes();
    localStorage.setItem(STORAGE_KEY, String(current + minutes));
  } catch {
    // ignore
  }
}
