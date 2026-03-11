import { NextRequest, NextResponse } from "next/server";
import { getAffirmation, type AffirmationCategory } from "@/data/affirmations";

export async function GET(request: NextRequest) {
  const period = (request.nextUrl.searchParams.get("period") || "day") as "day" | "week" | "month";
  if (!["day", "week", "month"].includes(period)) {
    return NextResponse.json({ error: "Invalid period" }, { status: 400 });
  }

  const categoryParam = (request.nextUrl.searchParams.get("category") || "any") as
    | AffirmationCategory
    | "any";

  const affirmation = getAffirmation(period, categoryParam);
  return NextResponse.json({ affirmation, period, category: categoryParam });
}
