"use client";

import { useEffect, useRef } from "react";
import { getReminders, getLastShown, setLastShown, todayStr } from "@/lib/remindersStorage";

function getCurrentTimeHHMM(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

export function ReminderChecker() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function check() {
      const reminders = getReminders().filter((r) => r.enabled);
      if (reminders.length === 0) return;
      const now = getCurrentTimeHHMM();
      const today = todayStr();
      const lastShown = getLastShown();
      for (const r of reminders) {
        if (r.time !== now) continue;
        if (lastShown[r.id] === today) continue;
        if (!("Notification" in window) || Notification.permission !== "granted") continue;
        try {
          new Notification("ZenFlow", { body: r.message, icon: "/icon-512.png" });
          setLastShown(r.id, today);
        } catch {
          // ignore
        }
      }
    }

    intervalRef.current = setInterval(check, 60 * 1000);
    check();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null;
}
