import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { searchAnime } from "@/features/anime/api";

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, "anime", 60, { results: [] });
  if (limited) return limited;

  const query = req.nextUrl.searchParams.get("q")?.trim().slice(0, 100);
  if (!query) {
    return NextResponse.json({ results: [] });
  }
  try {
    const results = await searchAnime(query);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { results: [], error: "Search failed" },
      { status: 502 },
    );
  }
}
