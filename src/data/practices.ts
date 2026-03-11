import type { LucideIcon } from "lucide-react";
import { Moon, Brain, Heart, Wind } from "lucide-react";

export type PracticeGoal = "sleep" | "stress" | "focus" | "calm";

export type Practice = {
  id: string;
  name: string;
  description?: string;
  duration: number;
  goal: PracticeGoal;
  icon: LucideIcon;
  gradient: string;
};

export const practices: Practice[] = [
  {
    id: "deep-sleep",
    name: "Глубокий сон",
    description: "Плавно отпускает день и готовит ко сну.",
    duration: 10,
    goal: "sleep",
    icon: Moon,
    gradient: "from-indigo-400/30 to-purple-500/30",
  },
  {
    id: "focus",
    name: "Фокус",
    description: "Короткая практика, чтобы собраться перед задачей.",
    duration: 5,
    goal: "focus",
    icon: Brain,
    gradient: "from-amber-400/30 to-orange-500/30",
  },
  {
    id: "antistress",
    name: "Антистресс",
    description: "Снимает напряжение в теле и шум в голове.",
    duration: 15,
    goal: "stress",
    icon: Heart,
    gradient: "from-rose-400/30 to-pink-500/30",
  },
  {
    id: "breath",
    name: "Дыхание",
    description: "Несколько циклов осознанного дыхания для перезагрузки.",
    duration: 5,
    goal: "calm",
    icon: Wind,
    gradient: "from-cyan-400/30 to-teal-500/30",
  },
];

export const microPractices: Practice[] = [
  {
    id: "micro-1",
    name: "1 минута",
    description: "Микро-пауза в любой момент дня.",
    duration: 1,
    goal: "calm",
    icon: Wind,
    gradient: "from-slate-400/30 to-slate-500/30",
  },
  {
    id: "micro-2",
    name: "2 минуты",
    description: "Короткий вдох-выдох, когда времени совсем мало.",
    duration: 2,
    goal: "calm",
    icon: Wind,
    gradient: "from-slate-400/30 to-slate-500/30",
  },
  {
    id: "micro-3",
    name: "3 минуты",
    description: "Мини-перерыв, чтобы вернуться в момент.",
    duration: 3,
    goal: "calm",
    icon: Wind,
    gradient: "from-slate-400/30 to-slate-500/30",
  },
];
