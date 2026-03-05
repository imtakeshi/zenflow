"use client";

import { motion } from "framer-motion";

const CYCLE_SEC = 12;
const INHALE = 4;
const HOLD = 4;
const EXHALE = 4;

export function BreathingCircle() {
  return (
    <motion.div
      className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-slate-300/60 to-slate-400/40 dark:from-slate-600/50 dark:to-slate-700/50 shadow-inner"
      animate={{
        scale: [1, 1.5, 1.5, 1],
      }}
      transition={{
        duration: CYCLE_SEC,
        repeat: Infinity,
        times: [0, INHALE / CYCLE_SEC, (INHALE + HOLD) / CYCLE_SEC, 1],
        ease: ["easeInOut", "linear", "easeInOut"],
      }}
    />
  );
}
