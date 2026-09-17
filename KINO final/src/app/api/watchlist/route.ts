import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { watchlist } from "@/db/schema";
import { resolveDeviceId } from "@/lib/device";

export const dynamic = "force-dynamic";

const isValidId = (v: unknown): v is string =>
  typeof v === "string" && v.length > 1 && v.length <= 24;

export async function GET(req: NextRequest) {
  const res = NextResponse.json({ items: [] as unknown[], inList: false });
  const deviceId = await resolveDeviceId(res);

  const type = req.nextUrl.searchParams.get("type");
  const id = req.nextUrl.searchParams.get("id");

  try {
    if (type && id) {
      const rows = await db
        .select({ id: watchlist.id })
        .from(watchlist)
        .where(
          and(
            eq(watchlist.deviceId, deviceId),
            eq(watchlist.mediaType, type),
            eq(watchlist.imdbId, id),
          ),
        )
        .limit(1);
      return NextResponse.json(
        { inList: rows.length > 0 },
        { headers: res.headers },
      );
    }

    const rows = await db
      .select()
      .from(watchlist)
      .where(eq(watchlist.deviceId, deviceId))
      .orderBy(desc(watchlist.createdAt))
      .limit(100);
    return NextResponse.json(
      {
        items: rows.map((r) => ({
          mediaType: r.mediaType,
          imdbId: r.imdbId,
          title: r.title,
          posterPath: r.posterPath,
          backdropPath: r.backdropPath,
          createdAt: r.createdAt,
        })),
      },
      { headers: res.headers },
    );
  } catch {
    return NextResponse.json({ items: [], inList: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mediaType, imdbId, title, posterPath, backdropPath } = body as {
      mediaType?: string;
      imdbId?: string;
      title?: string;
      posterPath?: string | null;
      backdropPath?: string | null;
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
      .insert(watchlist)
      .values({
        deviceId,
        mediaType,
        imdbId,
        title,
        posterPath: posterPath ?? null,
        backdropPath: backdropPath ?? null,
      })
      .onConflictDoNothing();

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
      .delete(watchlist)
      .where(
        and(
          eq(watchlist.deviceId, deviceId),
          eq(watchlist.mediaType, type),
          eq(watchlist.imdbId, id),
        ),
      );
  } catch {
    // ignore
  }
  return res;
}
