/**
 * Anime metadata via AniList GraphQL — keyless, CORS-open and far more
 * reliable than the MAL scrapers. AniList exposes `idMal`, which is exactly
 * what the anime stream mirrors expect, so playback stays MAL-compatible.
 */

const ENDPOINT = "https://graphql.anilist.co";

export interface AnimeItem {
  /** Route id: MAL id when known, otherwise `ani{anilistId}`. */
  id: string;
  anilistId: number;
  malId: number | null;
  name: string;
  poster: string | null;
  backdrop: string | null;
  score: string | null;
  year: string;
  type: string;
  status: string;
  episodes: number | null;
  synopsis: string;
  genres: string[];
}

export interface AnimeFull extends AnimeItem {
  studios: string;
  source: string;
  duration: string;
  premiered: string;
  rank: number | null;
  rating: string;
  trailerYoutubeId: string | null;
  streamingEpisodes: { number: number; title: string; thumbnail: string | null }[];
}

export interface AnimeEpisode {
  number: number;
  title: string;
  aired: string;
  score: string | null;
  thumbnail: string | null;
}

interface RawMedia {
  id?: number;
  idMal?: number | null;
  title?: { english?: string | null; romaji?: string | null; native?: string | null };
  coverImage?: { extraLarge?: string | null; large?: string | null } | null;
  bannerImage?: string | null;
  averageScore?: number | null;
  meanScore?: number | null;
  seasonYear?: number | null;
  season?: string | null;
  startDate?: { year?: number | null } | null;
  episodes?: number | null;
  duration?: number | null;
  format?: string | null;
  status?: string | null;
  genres?: string[] | null;
  description?: string | null;
  source?: string | null;
  popularity?: number | null;
  rankings?: { rank?: number; type?: string; allTime?: boolean }[] | null;
  studios?: { nodes?: { name?: string }[] } | null;
  trailer?: { id?: string | null; site?: string | null } | null;
  streamingEpisodes?:
    | { title?: string | null; thumbnail?: string | null }[]
    | null;
}

const MEDIA_FIELDS = `
  id
  idMal
  title { english romaji }
  coverImage { extraLarge large }
  bannerImage
  averageScore
  seasonYear
  season
  startDate { year }
  episodes
  duration
  format
  status
  genres
  description(asHtml: false)
`;

const FULL_FIELDS = `
  ${MEDIA_FIELDS}
  source
  popularity
  rankings { rank type allTime }
  studios(isMain: true) { nodes { name } }
  trailer { id site }
  streamingEpisodes { title thumbnail }
`;

function stripHtml(input?: string | null): string {
  if (!input) return "";
  return input
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(input?: string | null): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function routeIdOf(media: { idMal?: number | null; id?: number }): string {
  return media.idMal ? String(media.idMal) : `ani${media.id ?? ""}`;
}

function mapMedia(raw: RawMedia): AnimeItem {
  return {
    id: routeIdOf(raw),
    anilistId: raw.id ?? 0,
    malId: raw.idMal ?? null,
    name: raw.title?.english ?? raw.title?.romaji ?? "Untitled",
    poster: raw.coverImage?.extraLarge ?? raw.coverImage?.large ?? null,
    backdrop: raw.bannerImage ?? null,
    score:
      typeof raw.averageScore === "number" && raw.averageScore > 0
        ? (raw.averageScore / 10).toFixed(1)
        : null,
    year: raw.seasonYear
      ? String(raw.seasonYear)
      : raw.startDate?.year
        ? String(raw.startDate.year)
        : "",
    type: titleCase(raw.format),
    status: titleCase(raw.status),
    episodes: raw.episodes ?? null,
    synopsis: stripHtml(raw.description),
    genres: raw.genres ?? [],
  };
}

function mapFull(raw: RawMedia): AnimeFull {
  const base = mapMedia(raw);
  const allTimeRank = (raw.rankings ?? []).find(
    (r) => r.type === "RATED" && r.allTime,
  )?.rank;

  const streamingEpisodes = (raw.streamingEpisodes ?? []).map((ep, index) => {
    const match = ep.title?.match(/episode\s+(\d+)/i);
    const number = match ? Number(match[1]) : index + 1;
    const cleaned = (ep.title ?? "")
      .replace(/^episode\s+\d+\s*[-–—]\s*/i, "")
      .trim();
    return {
      number,
      title: cleaned || `Episode ${number}`,
      thumbnail: ep.thumbnail ?? null,
    };
  });

  return {
    ...base,
    studios: (raw.studios?.nodes ?? [])
      .map((s) => s.name ?? "")
      .filter(Boolean)
      .join(", "),
    source: titleCase(raw.source),
    duration: raw.duration ? `${raw.duration} min` : "",
    premiered:
      raw.season && raw.seasonYear
        ? `${titleCase(raw.season)} ${raw.seasonYear}`
        : base.year,
    rank: allTimeRank ?? null,
    rating: "",
    trailerYoutubeId:
      raw.trailer?.site === "youtube" && raw.trailer.id ? raw.trailer.id : null,
    streamingEpisodes,
  };
}

async function anilist<T>(
  query: string,
  variables: Record<string, unknown>,
  revalidate = 3600,
): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 400 * attempt));
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate },
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const json = (await res.json()) as { data?: T; errors?: unknown };
        if (json.data) return json.data;
        lastError = new Error("AniList returned no data");
        continue;
      }
      if (res.status === 429 || res.status >= 500) {
        lastError = new Error(`AniList ${res.status}`);
        continue;
      }
      throw new Error(`AniList request failed: ${res.status}`);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw lastError ?? new Error("AniList request failed");
}

interface PageResult {
  Page?: { media?: RawMedia[] };
}

async function pageQuery(
  sort: string,
  perPage: number,
  extra = "",
  variables: Record<string, unknown> = {},
): Promise<AnimeItem[]> {
  const data = await anilist<PageResult>(
    `query ($perPage: Int${extra ? ", $season: MediaSeason, $seasonYear: Int" : ""}) {
      Page(page: 1, perPage: $perPage) {
        media(type: ANIME, sort: ${sort}, isAdult: false${extra}) {
          ${MEDIA_FIELDS}
        }
      }
    }`,
    { perPage, ...variables },
  );
  return (data.Page?.media ?? []).map(mapMedia).filter((a) => a.poster);
}

export function getTopAnime(limit = 24) {
  return pageQuery("SCORE_DESC", limit);
}

export function getTrendingAnime(limit = 18) {
  return pageQuery("TRENDING_DESC", limit);
}

export function getPopularAnime(limit = 18) {
  return pageQuery("POPULARITY_DESC", limit);
}

export async function getSeasonalAnime(limit = 18): Promise<AnimeItem[]> {
  const now = new Date();
  const month = now.getMonth();
  const season =
    month < 3 ? "WINTER" : month < 6 ? "SPRING" : month < 9 ? "SUMMER" : "FALL";
  const data = await anilist<PageResult>(
    `query ($perPage: Int, $season: MediaSeason, $seasonYear: Int) {
      Page(page: 1, perPage: $perPage) {
        media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }`,
    { perPage: limit, season, seasonYear: now.getFullYear() },
  );
  return (data.Page?.media ?? []).map(mapMedia).filter((a) => a.poster);
}

export async function getAnimeMovies(limit = 18): Promise<AnimeItem[]> {
  const data = await anilist<PageResult>(
    `query ($perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(type: ANIME, format: MOVIE, sort: SCORE_DESC, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }`,
    { perPage: limit },
  );
  return (data.Page?.media ?? []).map(mapMedia).filter((a) => a.poster);
}

/** Accepts a MAL id (`52991`) or an AniList id (`ani123`). */
export async function getAnime(id: string): Promise<AnimeFull> {
  const isAniList = id.startsWith("ani");
  const numeric = Number(isAniList ? id.slice(3) : id);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    throw new Error(`Invalid anime id: ${id}`);
  }
  const data = await anilist<{ Media?: RawMedia }>(
    `query ($id: Int) {
      Media(${isAniList ? "id" : "idMal"}: $id, type: ANIME) {
        ${FULL_FIELDS}
      }
    }`,
    { id: numeric },
  );
  if (!data.Media?.id) throw new Error(`Anime not found: ${id}`);
  return mapFull(data.Media);
}

export async function getAnimeEpisodes(id: string): Promise<AnimeEpisode[]> {
  const meta = await getAnime(id);
  return episodesFrom(meta);
}

export function episodesFrom(meta: AnimeFull): AnimeEpisode[] {
  const total = meta.episodes ?? meta.streamingEpisodes.length;
  const byNumber = new Map(meta.streamingEpisodes.map((e) => [e.number, e]));

  if (total > 0) {
    return Array.from({ length: total }, (_, i) => {
      const n = i + 1;
      const known = byNumber.get(n);
      return {
        number: n,
        title: known?.title ?? `Episode ${n}`,
        aired: "",
        score: null,
        thumbnail: known?.thumbnail ?? null,
      };
    });
  }

  return meta.streamingEpisodes
    .sort((a, b) => a.number - b.number)
    .map((e) => ({
      number: e.number,
      title: e.title,
      aired: "",
      score: null,
      thumbnail: e.thumbnail,
    }));
}

export async function searchAnime(query: string, limit = 30): Promise<AnimeItem[]> {
  const data = await anilist<PageResult>(
    `query ($search: String, $perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }`,
    { search: query.trim(), perPage: limit },
    300,
  );
  return (data.Page?.media ?? []).map(mapMedia).filter((a) => a.poster);
}

export async function getAnimeRecommendations(
  id: string,
  limit = 14,
): Promise<AnimeItem[]> {
  const isAniList = id.startsWith("ani");
  const numeric = Number(isAniList ? id.slice(3) : id);
  const data = await anilist<{
    Media?: {
      recommendations?: {
        nodes?: { mediaRecommendation?: RawMedia | null }[];
      } | null;
    };
  }>(
    `query ($id: Int, $limit: Int) {
      Media(${isAniList ? "id" : "idMal"}: $id, type: ANIME) {
        recommendations(sort: RATING_DESC, perPage: $limit) {
          nodes {
            mediaRecommendation { ${MEDIA_FIELDS} }
          }
        }
      }
    }`,
    { id: numeric, limit },
  );
  return (data.Media?.recommendations?.nodes ?? [])
    .map((n) => (n.mediaRecommendation ? mapMedia(n.mediaRecommendation) : null))
    .filter((a): a is AnimeItem => Boolean(a && a.poster))
    .slice(0, limit);
}
