import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { watchHistory } from "@/db/schema";
import { resolveDeviceId } from "@/lib/device";

export const dynamic = "force-dynamic";

const isValidId = (v: unknown): v is string =>
  typeof v === "string" && v.length > 1 && v.length <= 24;

export async function GET() {
  const res = NextResponse.json({ items: [] as unknown[] });
  const deviceId = await resolveDeviceId(res);
  try {
    const rows = await db
      .select()
      .from(watchHistory)
      .where(eq(watchHistory.deviceId, deviceId))
      .orderBy(desc(watchHistory.updatedAt))
      .limit(24);
    return NextResponse.json(
      {
        items: rows.map((r) => ({
          mediaType: r.mediaType,
          imdbId: r.imdbId,
          title: r.title,
          posterPath: r.posterPath,
          backdropPath: r.backdropPath,
          season: r.season,
          episode: r.episode,
          updatedAt: r.updatedAt,
        })),
      },
      { headers: res.headers },
    );
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mediaType, imdbId, title, posterPath, backdropPath, season, episode } =
      body as {
        mediaType?: string;
        imdbId?: string;
        title?: string;
        posterPath?: string | null;
        backdropPath?: string | null;
        season?: number | null;
        episode?: number | null;
      };

    if (
      !mediaType ||
      !["movie", "tv", "anime"].includes(mediaType) ||
      !isValidId(imdbId) ||
      !title
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });
    const deviceId = await resolveDeviceId(res);

    await db
      .insert(watchHistory)
      .values({
        deviceId,
        mediaType,
        imdbId,
        title,
        posterPath: posterPath ?? null,
        backdropPath: backdropPath ?? null,
        season: season ?? null,
        episode: episode ?? null,
      })
      .onConflictDoUpdate({
        target: [
          watchHistory.deviceId,
          watchHistory.mediaType,
          watchHistory.imdbId,
        ],
        set: {
          title,
          posterPath: posterPath ?? null,
          backdropPath: backdropPath ?? null,
          season: season ?? null,
          episode: episode ?? null,
          updatedAt: new Date(),
        },
      });

    return res;
  } catch {
    return NextResponse.json({ ok: true });
  }
}

export async function DELETE(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  const id = req.nextUrl.searchParams.get("id");
  if (!type || !id) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  const deviceId = await resolveDeviceId(res);
  try {
    await db
      .delete(watchHistory)
      .where(
        and(
          eq(watchHistory.deviceId, deviceId),
          eq(watchHistory.mediaType, type),
          eq(watchHistory.imdbId, id),
        ),
      );
  } catch {
    // ignore
  }
  return res;
}
