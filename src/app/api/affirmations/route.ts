import { NextRequest, NextResponse } from "next/server";
import { getAffirmation } from "@/data/affirmations";

export async function GET(request: NextRequest) {
  const period = (request.nextUrl.searchParams.get("period") || "day") as "day" | "week" | "month";
  if (!["day", "week", "month"].includes(period)) {
    return NextResponse.json({ error: "Invalid period" }, { status: 400 });
  }

  const affirmation = getAffirmation(period);
  return NextResponse.json({ affirmation, period });
}
