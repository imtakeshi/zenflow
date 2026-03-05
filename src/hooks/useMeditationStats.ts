"use client";

import { useState, useEffect, useCallback } from "react";
import { getMeditationMinutes, addMeditationMinutes } from "@/lib/storage";

export function useMeditationStats() {
  const [totalMinutes, setTotalMinutes] = useState(0);

  const refresh = useCallback(() => {
    setTotalMinutes(getMeditationMinutes());
  }, []);

  const addMinutes = useCallback((minutes: number) => {
    addMeditationMinutes(minutes);
    setTotalMinutes(getMeditationMinutes());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { totalMinutes, refresh, addMinutes };
}
