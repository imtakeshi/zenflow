import type { LucideIcon } from "lucide-react";
import { Moon, Brain, Heart, Wind } from "lucide-react";

export type Practice = {
  id: string;
  name: string;
  duration: number;
  icon: LucideIcon;
  gradient: string;
};

export const practices: Practice[] = [
  {
    id: "deep-sleep",
    name: "Глубокий сон",
    duration: 10,
    icon: Moon,
    gradient: "from-indigo-400/30 to-purple-500/30",
  },
  {
    id: "focus",
    name: "Фокус",
    duration: 5,
    icon: Brain,
    gradient: "from-amber-400/30 to-orange-500/30",
  },
  {
    id: "antistress",
    name: "Антистресс",
    duration: 15,
    icon: Heart,
    gradient: "from-rose-400/30 to-pink-500/30",
  },
  {
    id: "breath",
    name: "Дыхание",
    duration: 5,
    icon: Wind,
    gradient: "from-cyan-400/30 to-teal-500/30",
  },
];

export const microPractices: Practice[] = [
  { id: "micro-1", name: "1 минута", duration: 1, icon: Wind, gradient: "from-slate-400/30 to-slate-500/30" },
  { id: "micro-2", name: "2 минуты", duration: 2, icon: Wind, gradient: "from-slate-400/30 to-slate-500/30" },
  { id: "micro-3", name: "3 минуты", duration: 3, icon: Wind, gradient: "from-slate-400/30 to-slate-500/30" },
];
