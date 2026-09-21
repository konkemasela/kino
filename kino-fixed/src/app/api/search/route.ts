import { NextRequest, NextResponse } from "next/server";
import { searchCinemeta } from "@/features/catalog/api";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();
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
