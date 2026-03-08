import type { LucideIcon } from "lucide-react";
import { Heart, Moon, Brain, Sun, Sparkles, Wind } from "lucide-react";

export type GuidedTheme = {
  id: string;
  name: string;
  description: string;
  duration: number;
  icon: LucideIcon;
  gradient: string;
};

export const guidedThemes: GuidedTheme[] = [
  { id: "stress", name: "Стресс", description: "Снятие напряжения", duration: 10, icon: Wind, gradient: "from-rose-400/30 to-pink-500/30" },
  { id: "anxiety", name: "Тревога", description: "Успокоение ума", duration: 10, icon: Heart, gradient: "from-violet-400/30 to-purple-500/30" },
  { id: "sleep", name: "Сон", description: "Подготовка ко сну", duration: 15, icon: Moon, gradient: "from-indigo-400/30 to-blue-500/30" },
  { id: "focus", name: "Фокус", description: "Концентрация", duration: 5, icon: Brain, gradient: "from-amber-400/30 to-orange-500/30" },
  { id: "gratitude", name: "Благодарность", description: "Чувство благодарности", duration: 10, icon: Sun, gradient: "from-yellow-400/30 to-amber-500/30" },
  { id: "loving-kindness", name: "Любящая доброта", description: "Метта-медитация", duration: 15, icon: Sparkles, gradient: "from-teal-400/30 to-cyan-500/30" },
];

export function getDailyMeditation(): GuidedTheme {
  const dayIndex = new Date().getDay();
  return guidedThemes[dayIndex % guidedThemes.length];
}
