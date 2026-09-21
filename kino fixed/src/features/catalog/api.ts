/**
 * Cinemeta (Stremio's open community metadata service) — no API key required.
 * All ids are IMDb ids (tt...). `moviedb_id` is reused only for embed servers
 * that require a TMDB-style numeric id; no TMDB API calls are ever made.
 */

const API_BASE = "https://v3-cinemeta.strem.io";
const CATALOG_BASE = "https://cinemeta-catalogs.strem.io/top/catalog";

export type MediaType = "movie" | "tv";

const cmType = (type: MediaType) => (type === "tv" ? "series" : "movie");

export interface CatalogItem {
  id: string;
  type: MediaType;
  name: string;
  poster: string | null;
  backdrop: string | null;
  imdbRating: string | null;
  description: string;
  releaseInfo: string;
  genres: string[];
  moviedbId: number | null;
}

export interface EpisodeVideo {
  id: string;
  season: number;
  episode: number;
  name: string;
  overview: string;
  released: string;
  thumbnail: string | null;
  rating: string | null;
}

export interface FullMeta extends CatalogItem {
  logo: string | null;
  cast: string[];
  director: string[];
  writer: string[];
  runtime: string | null;
  year: string;
  country: string;
  awards: string;
  videos: EpisodeVideo[];
  trailers: { source: string; type: string }[];
}

interface RawItem {
  id?: string;
  imdb_id?: string;
  moviedb_id?: number;
  type?: string;
  name?: string;
  title?: string;
  poster?: string;
  background?: string;
  imdbRating?: string;
  description?: string;
  releaseInfo?: string | number;
  year?: string | number;
  genre?: string[];
  genres?: string[];
  cast?: string[];
  director?: string[] | string;
  writer?: string[] | string;
  runtime?: string;
  country?: string;
  awards?: string;
  logo?: string;
  trailers?: { source?: string; type?: string }[];
  videos?: RawVideo[];
  popularity?: number;
}

interface RawVideo {
  id?: string;
  name?: string;
  title?: string;
  season?: number;
  number?: number;
  episode?: number;
  released?: string;
  firstAired?: string;
  overview?: string;
  description?: string;
  thumbnail?: string;
  rating?: string;
}

export const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western",
] as const;

function normalizeType(raw?: string): MediaType {
  return raw === "series" ? "tv" : "movie";
}

/** Request larger artwork where the CDN supports size variants. */
export function upscale(url: string | null | undefined): string | null {
  if (!url) return null;
  let out = url;
  if (out.includes("m.media-amazon.com")) {
    out = out.replace(/\._V1_.*?\.jpg/, "._V1_SX600_.jpg");
  }
  if (out.includes("metahub.space")) {
    out = out.replace(/\/poster\/small\//, "/poster/large/");
    out = out.replace(/\/poster\/medium\//, "/poster/large/");
    out = out.replace(/\/background\/small\//, "/background/large/");
    out = out.replace(/\/background\/medium\//, "/background/large/");
  }
  return out;
}

function mapItem(raw: RawItem): CatalogItem {
  return {
    id: raw.id ?? raw.imdb_id ?? "",
    type: normalizeType(raw.type),
    name: raw.name ?? raw.title ?? "Untitled",
    poster: upscale(raw.poster),
    backdrop: upscale(raw.background),
    imdbRating: raw.imdbRating && raw.imdbRating !== "0" ? raw.imdbRating : null,
    description: raw.description ?? "",
    releaseInfo: String(raw.releaseInfo ?? raw.year ?? ""),
    genres: raw.genres ?? raw.genre ?? [],
    moviedbId: typeof raw.moviedb_id === "number" ? raw.moviedb_id : null,
  };
}

function mapMeta(raw: RawItem): FullMeta {
  const base = mapItem(raw);
  return {
    ...base,
    logo: raw.logo ?? null,
    cast: raw.cast ?? [],
    director: Array.isArray(raw.director)
      ? raw.director
      : raw.director
        ? [raw.director]
        : [],
    writer: Array.isArray(raw.writer)
      ? raw.writer
      : raw.writer
        ? [raw.writer]
        : [],
    runtime: raw.runtime ?? null,
    year: String(raw.year ?? raw.releaseInfo ?? ""),
    country: raw.country ?? "",
    awards: raw.awards ?? "",
    videos: (raw.videos ?? []).map((v) => ({
      id: v.id ?? "",
      season: v.season ?? 0,
      episode: v.episode ?? v.number ?? 0,
      name: v.name ?? v.title ?? `Episode ${v.episode ?? v.number ?? ""}`,
      overview: v.overview ?? v.description ?? "",
      released: v.released ?? v.firstAired ?? "",
      thumbnail: v.thumbnail ?? null,
      rating: v.rating && v.rating !== "0" ? v.rating : null,
    })),
    trailers: (raw.trailers ?? [])
      .map((t) => ({ source: t.source ?? "", type: t.type ?? "Trailer" }))
      .filter((t) => t.source),
  };
}

async function fetchJson<T>(url: string, revalidate = 3600): Promise<T> {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`Cinemeta request failed: ${res.status} ${url}`);
  }
  return (await res.json()) as T;
}

export async function getCatalog(
  type: MediaType,
  options: { genre?: string; skip?: number } = {},
): Promise<CatalogItem[]> {
  const extras: string[] = [];
  if (options.genre) extras.push(`genre=${encodeURIComponent(options.genre)}`);
  if (options.skip && options.skip > 0) extras.push(`skip=${options.skip}`);
  const suffix = extras.length > 0 ? `/${extras.join("/")}` : "";
  const data = await fetchJson<{ metas?: RawItem[] }>(
    `${CATALOG_BASE}/${cmType(type)}/top${suffix}.json`,
    3600,
  );
  return (data.metas ?? [])
    .map(mapItem)
    .filter((item) => item.id && item.poster);
}

export async function getMeta(type: MediaType, id: string): Promise<FullMeta> {
  const data = await fetchJson<{ meta?: RawItem }>(
    `${API_BASE}/meta/${cmType(type)}/${encodeURIComponent(id)}.json`,
    3600,
  );
  if (!data.meta?.id && !data.meta?.imdb_id) {
    throw new Error(`Meta not found: ${id}`);
  }
  return mapMeta(data.meta ?? {});
}

export async function searchCinemeta(query: string): Promise<CatalogItem[]> {
  const q = query.trim();
  if (!q) return [];

  const encoded = encodeURIComponent(q);
  const fetchOne = (type: MediaType) =>
    fetchJson<{ metas?: RawItem[] }>(
      `${API_BASE}/catalog/${cmType(type)}/top/search=${encoded}.json`,
      300,
    )
      .then((data) => (data.metas ?? []).map(mapItem))
      .catch(() => [] as CatalogItem[]);

  const [movies, series] = await Promise.all([
    fetchOne("movie"),
    fetchOne("tv"),
  ]);

  const normalize = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const qNorm = normalize(q);

  const seen = new Set<string>();
  const merged = [...movies, ...series]
    .filter((item) => {
      if (!item.id || !item.poster) return false;
      const key = `${item.type}:${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((item) => {
      const title = item.name ?? "";
      const normTitle = normalize(title);
      const exact = normTitle === qNorm ? 1000 : 0;
      const starts = normTitle.startsWith(qNorm) ? 500 : 0;
      const includes = normTitle.includes(qNorm) ? 250 : 0;
      const typeBias = item.type === "movie" && qNorm.includes("movie") ? 25 : 0;
      const ratingScore = Number.parseFloat(item.imdbRating ?? "0") || 0;
      const score = exact + starts + includes + ratingScore * 10 + typeBias;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .map(({ item }) => item)
    .slice(0, 60);

  return merged;
}

export function ratingOf(value?: string | number | null): string {
  const n =
    typeof value === "number" ? value : parseFloat(value?.toString() ?? "");
  return Number.isFinite(n) && n > 0 ? n.toFixed(1) : "NR";
}

export function yearOfItem(releaseInfo?: string): string {
  const match = releaseInfo?.match(/\d{4}/);
  return match ? match[0] : "";
}

export function episodeLabelCount(meta: FullMeta): number {
  return meta.videos.filter((v) => v.season >= 1).length;
}
