const USER_NAME_KEY = "zenflow_user_name";

export function getUserName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(USER_NAME_KEY);
  } catch {
    return null;
  }
}

export function setUserName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_NAME_KEY, name.trim());
  } catch {
    // ignore
  }
}
