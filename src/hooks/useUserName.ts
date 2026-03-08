"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserName, setUserName } from "@/lib/userStorage";

export function useUserName() {
  const [name, setNameState] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNameState(getUserName());
  }, []);

  const setName = useCallback((newName: string) => {
    setUserName(newName);
    setNameState(newName);
  }, []);

  return {
    name: mounted ? name : null,
    setName,
    hasName: !!name,
    isReady: mounted,
  };
}
