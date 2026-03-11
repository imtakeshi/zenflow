export type AffirmationCategory = "calm" | "self-love" | "focus" | "gratitude";

export type Affirmation = {
  text: string;
  category: AffirmationCategory;
};

export const AFFIRMATIONS: Affirmation[] = [
  {
    text: "Я дышу спокойно и осознанно. Каждый вдох наполняет меня силой и покоем.",
    category: "calm",
  },
  {
    text: "Сегодня я выбираю гармонию. Я принимаю себя и мир вокруг.",
    category: "calm",
  },
  {
    text: "Я благодарен за этот момент. Здесь и сейчас — всё, что мне нужно.",
    category: "gratitude",
  },
  {
    text: "Мой ум спокоен. Моё тело расслаблено. Я в безопасности.",
    category: "calm",
  },
  {
    text: "Я отпускаю напряжение. Каждый выдох уносит всё лишнее.",
    category: "calm",
  },
  {
    text: "Я доверяю процессу жизни. Всё идёт так, как должно.",
    category: "calm",
  },
  {
    text: "Я наполнен светом и теплом. Я излучаю доброту.",
    category: "self-love",
  },
  {
    text: "Я принимаю свои чувства. Они — мои проводники.",
    category: "self-love",
  },
  {
    text: "Я заслуживаю покоя и счастья. Я позволяю себе отдыхать.",
    category: "self-love",
  },
  {
    text: "Моё дыхание — моя опора. Я нахожу центр в себе.",
    category: "calm",
  },
  {
    text: "Я открыт новым возможностям. Каждый день — подарок.",
    category: "gratitude",
  },
  {
    text: "Я прощаю себя и других. Свобода начинается с принятия.",
    category: "self-love",
  },
  {
    text: "Я чувствую связь с собой и миром. Я не один.",
    category: "gratitude",
  },
  {
    text: "Я выбираю мысли, которые поддерживают меня.",
    category: "focus",
  },
  {
    text: "Я в гармонии с ритмом жизни. Всё приходит в своё время.",
    category: "calm",
  },
  {
    text: "Моё тело — мой дом. Я забочусь о нём с любовью.",
    category: "self-love",
  },
  {
    text: "Я отпускаю контроль. Я доверяю себе и жизни.",
    category: "calm",
  },
  {
    text: "Я достоин любви и уважения. Начиная с себя.",
    category: "self-love",
  },
  {
    text: "Каждый вдох — новая возможность. Я готов к переменам.",
    category: "focus",
  },
  {
    text: "Я нахожу покой в настоящем моменте.",
    category: "calm",
  },
  {
    text: "Я сильнее, чем думаю. Я справлюсь.",
    category: "focus",
  },
  {
    text: "Я позволяю себе быть неидеальным. Я человек.",
    category: "self-love",
  },
  {
    text: "Я благодарен за своё тело и разум.",
    category: "gratitude",
  },
  {
    text: "Я создаю пространство для тишины и ясности.",
    category: "focus",
  },
  {
    text: "Я выбираю путь лёгкости и радости.",
    category: "gratitude",
  },
  {
    text: "Мои мысли — мои союзники. Я направляю их с добротой.",
    category: "focus",
  },
  {
    text: "Я в потоке. Жизнь поддерживает меня.",
    category: "calm",
  },
  {
    text: "Я заслуживаю моментов покоя. Я даю себе разрешение отдыхать.",
    category: "self-love",
  },
  {
    text: "Я принимаю то, что не могу изменить. Я меняю то, что могу.",
    category: "focus",
  },
  {
    text: "Я наполнен энергией и намерением. Сегодня — мой день.",
    category: "focus",
  },
];

function getDayIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return day;
}

function getWeekIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  return week;
}

function getMonthIndex(): number {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
}

export function getAffirmation(period: "day" | "week" | "month", category?: AffirmationCategory | "any") {
  let index: number;
  if (period === "day") index = getDayIndex();
  else if (period === "week") index = getWeekIndex();
  else index = getMonthIndex();
  const pool =
    category && category !== "any"
      ? AFFIRMATIONS.filter((a) => a.category === category)
      : AFFIRMATIONS;
  if (pool.length === 0) return AFFIRMATIONS[Math.abs(index) % AFFIRMATIONS.length];
  const selected = pool[Math.abs(index) % pool.length];
  return selected;
}
