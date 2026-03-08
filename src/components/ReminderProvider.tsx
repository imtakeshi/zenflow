"use client";

import { ReminderChecker } from "./ReminderChecker";

export function ReminderProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReminderChecker />
      {children}
    </>
  );
}
