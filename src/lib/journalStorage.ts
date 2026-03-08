const JOURNAL_KEY = "zenflow_journal";

export type JournalEntry = { date: string; duration: number; text: string };

export function getJournalEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addJournalEntry(duration: number, text: string): void {
  if (typeof window === "undefined") return;
  try {
    const entries = getJournalEntries();
    entries.unshift({
      date: new Date().toISOString(),
      duration,
      text,
    });
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries.slice(0, 100)));
  } catch {
    // ignore
  }
}
