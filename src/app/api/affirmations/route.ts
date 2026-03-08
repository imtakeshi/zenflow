import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const prompts: Record<string, string> = {
  day: "Напиши одну короткую аффирмацию на сегодня (1-2 предложения). Тема: спокойствие, уверенность, благодарность. Только текст аффирмации, без кавычек и пояснений.",
  week: "Напиши одну аффирмацию на эту неделю (2-3 предложения). Тема: намерение, рост, гармония. Только текст аффирмации, без кавычек и пояснений.",
  month: "Напиши одну аффирмацию на этот месяц (2-4 предложения). Тема: трансформация, осознанность, баланс. Только текст аффирмации, без кавычек и пояснений.",
};

export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get("period") || "day";
  if (!["day", "week", "month"].includes(period)) {
    return NextResponse.json({ error: "Invalid period" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY не настроен. Добавьте ключ в .env.local" },
      { status: 500 }
    );
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompts[period] }],
      max_tokens: 150,
    });

    const text = response.choices[0]?.message?.content?.trim() || "Попробуйте позже.";
    return NextResponse.json({ affirmation: text, period });
  } catch (err) {
    console.error("Affirmation API error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
