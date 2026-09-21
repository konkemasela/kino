import { NextRequest, NextResponse } from "next/server";
import { searchAnime } from "@/features/anime/api";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();
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
