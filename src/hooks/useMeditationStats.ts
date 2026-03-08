"use client";

import { useState, useEffect, useCallback } from "react";
import { getMeditationMinutes, addMeditationMinutes } from "@/lib/storage";
import { addDayMinutes } from "@/lib/calendarStorage";

export function useMeditationStats() {
  const [totalMinutes, setTotalMinutes] = useState(0);

  const refresh = useCallback(() => {
    setTotalMinutes(getMeditationMinutes());
  }, []);

  const addMinutes = useCallback((minutes: number) => {
    addMeditationMinutes(minutes);
    addDayMinutes(minutes);
    setTotalMinutes(getMeditationMinutes());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { totalMinutes, refresh, addMinutes };
}
