import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { searchCinemeta } from "@/features/catalog/api";

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, "search", 60, { results: [] });
  if (limited) return limited;

  const query = req.nextUrl.searchParams.get("q")?.trim().slice(0, 100);
  if (!query) {
    return NextResponse.json({ results: [] });
  }
  try {
    const results = await searchCinemeta(query);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { results: [], error: "Search failed" },
      { status: 502 },
    );
  }
}
