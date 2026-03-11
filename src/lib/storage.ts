export type StorageSchema<T> = {
  key: string;
  version?: number;
  migrate?: (oldValue: unknown, oldVersion: number | null) => T;
  fallback: () => T;
};

type Versioned<T> = {
  v: number;
  value: T;
};

function getRaw<T>(schema: StorageSchema<T>): T {
  if (typeof window === "undefined") return schema.fallback();
  try {
    const raw = localStorage.getItem(schema.key);
    const versionKey = `${schema.key}_version`;
    const rawVersion = localStorage.getItem(versionKey);
    const currentVersion = schema.version ?? 1;
    const storedVersion = rawVersion ? parseInt(rawVersion, 10) : null;

    if (!raw) {
      return schema.fallback();
    }

    const parsed = JSON.parse(raw) as T | Versioned<T>;

    if (schema.migrate) {
      const value = schema.migrate(parsed, storedVersion);
      localStorage.setItem(schema.key, JSON.stringify(value));
      localStorage.setItem(versionKey, String(currentVersion));
      return value;
    }

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "v" in (parsed as Versioned<T>) &&
      "value" in (parsed as Versioned<T>)
    ) {
      return (parsed as Versioned<T>).value;
    }

    return parsed as T;
  } catch {
    return schema.fallback();
  }
}

function setRaw<T>(schema: StorageSchema<T>, value: T): void {
  if (typeof window === "undefined") return;
  try {
    const currentVersion = schema.version ?? 1;
    localStorage.setItem(schema.key, JSON.stringify(value));
    localStorage.setItem(`${schema.key}_version`, String(currentVersion));
  } catch {
    // ignore
  }
}

export function readStorage<T>(schema: StorageSchema<T>): T {
  return getRaw(schema);
}

export function writeStorage<T>(schema: StorageSchema<T>, value: T): void {
  setRaw(schema, value);
}

const MEDITATION_MINUTES_SCHEMA: StorageSchema<number> = {
  key: "zenflow_meditation_minutes",
  version: 1,
  fallback: () => 0,
};

export function getMeditationMinutes(): number {
  return readStorage(MEDITATION_MINUTES_SCHEMA);
}

export function addMeditationMinutes(minutes: number): void {
  const current = getMeditationMinutes();
  writeStorage(MEDITATION_MINUTES_SCHEMA, current + minutes);
}
