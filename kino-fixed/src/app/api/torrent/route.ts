import { NextRequest, NextResponse } from "next/server";

const YTS_MIRRORS = ["https://yts.lt", "https://yts.am", "https://yts.mx"];
const EZTV_MIRRORS = [
  "https://eztv.re",
  "https://eztv.ag",
  "https://eztv.yt",
  "https://eztv.wf",
];

/* ---------------------------------- YTS ---------------------------------- */

interface YtsTorrent {
  url?: string;
  hash?: string;
  quality?: string;
  type?: string;
  video_codec?: string;
  size?: string;
  seeds?: number;
  peers?: number;
  date_uploaded?: string;
}

interface YtsResponse {
  status?: string;
  data?: {
    movie?: {
      title?: string;
      year?: number;
      imdb_code?: string;
      torrents?: YtsTorrent[];
    } | null;
  };
}

async function fetchYts(imdb: string): Promise<YtsResponse | null> {
  for (const mirror of YTS_MIRRORS) {
    try {
      const res = await fetch(
        `${mirror}/api/v2/movie_details.json?imdb_id=${encodeURIComponent(imdb)}&with_images=false&with_cast=false`,
        { next: { revalidate: 900 }, signal: AbortSignal.timeout(9000) },
      );
      if (!res.ok) continue;
      const json = (await res.json()) as YtsResponse;
      if (json.status === "ok") return json;
    } catch {
      continue;
    }
  }
  return null;
}

/* ---------------------------------- EZTV --------------------------------- */

interface EztvTorrent {
  id?: number;
  hash?: string;
  filename?: string;
  episode_url?: string;
  torrent_url?: string;
  magnet_url?: string;
  title?: string;
  imdb_id?: string;
  season?: string;
  episode?: string;
  small_screenshot?: string;
  large_screenshot?: string;
  seeds?: number;
  peers?: number;
  date_released_unix?: number;
  size_bytes?: string;
}

interface EztvResponse {
  imdb_id?: string;
  torrents_count?: number;
  limit?: number;
  page?: number;
  torrents?: EztvTorrent[];
}

const humanBytes = (bytes?: string) => {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n <= 0) return "?";
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} GB`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} MB`;
  return `${(n / 1e3).toFixed(0)} KB`;
};

async function fetchEztvOnce(url: string): Promise<EztvResponse | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return null;
    return (await res.json()) as EztvResponse;
  } catch {
    return null;
  }
}

async function fetchEztv(imdb: string): Promise<EztvTorrent[]> {
  const digits = imdb.replace(/^tt/i, "");
  const PAGE_LIMIT = 100;
  const MAX_PAGES = 2;

  for (const mirror of EZTV_MIRRORS) {
    const first = await fetchEztvOnce(
      `${mirror}/api/get-torrents?imdb_id=${encodeURIComponent(digits)}&limit=${PAGE_LIMIT}&page=1`,
    );
    if (!first) continue;

    const collected: EztvTorrent[] = [...(first.torrents ?? [])];
    const total = first.torrents_count ?? collected.length;

    for (
      let page = 2;
      page <= MAX_PAGES && collected.length < total;
      page++
    ) {
      const next = await fetchEztvOnce(
        `${mirror}/api/get-torrents?imdb_id=${encodeURIComponent(digits)}&limit=${PAGE_LIMIT}&page=${page}`,
      );
      if (!next || !next.torrents || next.torrents.length === 0) break;
      collected.push(...next.torrents);
    }

    return collected;
  }
  return [];
}

/* --------------------------------- route --------------------------------- */

export async function GET(req: NextRequest) {
  const imdb = req.nextUrl.searchParams.get("imdb")?.trim();
  const type = req.nextUrl.searchParams.get("type") ?? "movie";

  if (!imdb || !/^tt\d{6,10}$/.test(imdb)) {
    return NextResponse.json(
      { found: false, torrents: [] },
      { status: 400 },
    );
  }

  if (type === "tv") {
    try {
      const raw = await fetchEztv(imdb);
      if (raw.length === 0) {
        return NextResponse.json({ found: false, torrents: [] });
      }
      const torrents = raw
        .filter((t) => t.magnet_url || t.hash)
        .map((t) => {
          const rawTitle = (t.title || t.filename || "")
            .replace(/\[eztv[^]]*\]/gi, "")
            .replace(/\./g, " ")
            .replace(/\s+/g, " ")
            .trim();
          return {
            id: t.id ?? 0,
            hash: (t.hash ?? "").toUpperCase(),
            title: rawTitle || "Release",
            season: Number(t.season ?? 0),
            episode: Number(t.episode ?? 0),
            seeds: t.seeds ?? 0,
            peers: t.peers ?? 0,
            size: humanBytes(t.size_bytes),
            released: t.date_released_unix
              ? new Date(t.date_released_unix * 1000).toISOString()
              : "",
            magnet: t.magnet_url ?? "",
            torrentUrl: t.torrent_url ?? "",
            screenshot: (t.large_screenshot || t.small_screenshot) ?? null,
          };
        })
        .sort(
          (a, b) =>
            a.season - b.season || a.episode - b.episode || b.seeds - a.seeds,
        );

      const seasons = new Set(torrents.map((t) => t.season)).size;
      return NextResponse.json({
        found: true,
        torrents,
        seasons,
      });
    } catch {
      return NextResponse.json({ found: false, torrents: [] }, { status: 502 });
    }
  }

  try {
    const json = await fetchYts(imdb);
    const movie = json?.data?.movie;
    if (!movie || !movie.torrents || movie.torrents.length === 0) {
      return NextResponse.json({ found: false, torrents: [] });
    }

    const torrents = movie.torrents
      .filter((t) => t.hash)
      .map((t) => ({
        hash: t.hash!.toUpperCase(),
        quality: t.quality ?? "?",
        type: t.type ?? "web",
        codec: t.video_codec ?? "x264",
        size: t.size ?? "?",
        seeds: t.seeds ?? 0,
        peers: t.peers ?? 0,
        uploaded: t.date_uploaded ?? "",
      }))
      .sort((a, b) => {
        const rank = (q: string) =>
          q === "2160p" ? 3 : q === "1080p" ? 2 : q === "720p" ? 1 : 0;
        return rank(b.quality) - rank(a.quality);
      });

    return NextResponse.json({
      found: true,
      title: movie.title ?? "",
      year: movie.year ?? null,
      torrents,
    });
  } catch {
    return NextResponse.json({ found: false, torrents: [] }, { status: 502 });
  }
}
