import type { MediaType } from "@/features/catalog/api";

export type ServerKind = MediaType | "anime";
export type Lang = "sub" | "dub";

export interface StreamServer {
  id: string;
  name: string;
  tagline: string;
  buildUrl: (
    kind: ServerKind,
    id: string,
    moviedbId: number | null,
    season?: number,
    episode?: number,
    lang?: Lang,
  ) => string;
}

/**
 * Server identities are intentionally gatekept — the UI only ever shows
 * codenames, never the upstream domains.
 */
export const STREAM_SERVERS: StreamServer[] = [
  {
    id: "s1",
    name: "Atlas",
    tagline: "primary mirror",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://vidsrc-embed.ru/embed/movie?imdb=${id}&autoplay=1`
        : `https://vidsrc-embed.ru/embed/tv?imdb=${id}&season=${s}&episode=${e}&autoplay=1&autonext=1`,
  },
  {
    id: "s2",
    name: "Orion",
    tagline: "low latency",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://vidsrc.to/embed/movie/${id}`
        : `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "s3",
    name: "Vega",
    tagline: "backup node",
    buildUrl: (kind, id, moviedb, s = 1, e = 1) => {
      const vid = moviedb ?? id;
      return kind === "movie"
        ? `https://vidsrc.cc/v2/embed/movie/${vid}`
        : `https://vidsrc.cc/v2/embed/tv/${vid}/${s}/${e}`;
    },
  },
  {
    id: "s4",
    name: "Lyra",
    tagline: "mirror cluster",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://vidsrc.xyz/embed/movie?imdb=${id}`
        : `https://vidsrc.xyz/embed/tv?imdb=${id}&season=${s}&episode=${e}`,
  },
  {
    id: "s5",
    name: "Rigel",
    tagline: "legacy pool",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://www.2embed.cc/embed/${id}`
        : `https://www.2embed.cc/embedtvfull?imdb=${id}&s=${s}&e=${e}`,
  },
  {
    id: "s6",
    name: "Sirius",
    tagline: "high seed",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://multiembed.mov/?video_id=${id}`
        : `https://multiembed.mov/?video_id=${id}&s=${s}&e=${e}`,
  },
  {
    id: "s7",
    name: "Polaris",
    tagline: "wide coverage",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://player.smashystream.com/video.php?imdb=${id}`
        : `https://player.smashystream.com/video.php?imdb=${id}&s=${s}&e=${e}`,
  },
  {
    id: "s8",
    name: "Draco",
    tagline: "4k capable",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://vidsrc.icu/embed/movie/${id}`
        : `https://vidsrc.icu/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "s9",
    name: "Castor",
    tagline: "fast start",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://embed.su/embed/movie/${id}`
        : `https://embed.su/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "s10",
    name: "Pollux",
    tagline: "clean player",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://vidfast.pro/movie/${id}?autoPlay=true`
        : `https://vidfast.pro/tv/${id}/${s}/${e}?autoPlay=true`,
  },
  {
    id: "s11",
    name: "Altair",
    tagline: "hd pool",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://vidlink.pro/movie/${id}`
        : `https://vidlink.pro/tv/${id}/${s}/${e}`,
  },
  {
    id: "s12",
    name: "Antares",
    tagline: "multi-source",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://vidjoy.pro/embed/movie/${id}`
        : `https://vidjoy.pro/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "s13",
    name: "Carina",
    tagline: "deep catalog",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://111movies.com/movie/${id}`
        : `https://111movies.com/tv/${id}/${s}/${e}`,
  },
  {
    id: "s14",
    name: "Cygnus",
    tagline: "auto failover",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://vidora.su/movie/${id}`
        : `https://vidora.su/tv/${id}/${s}/${e}`,
  },
  {
    id: "s15",
    name: "Deneb",
    tagline: "subtitle rich",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://vidsrc.vip/embed/movie/${id}`
        : `https://vidsrc.vip/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "s16",
    name: "Electra",
    tagline: "legacy pool",
    buildUrl: (kind, id, moviedb, s = 1, e = 1) => {
      const vid = moviedb ?? id;
      return kind === "movie"
        ? `https://moviesapi.club/movie/${vid}`
        : `https://moviesapi.club/tv/${vid}-${s}-${e}`;
    },
  },
  {
    id: "s17",
    name: "Fornax",
    tagline: "backup relay",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://vidsrc.rip/embed/movie/${id}`
        : `https://vidsrc.rip/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "s18",
    name: "Hydra",
    tagline: "last resort",
    buildUrl: (kind, id, _m, s = 1, e = 1) =>
      kind === "movie"
        ? `https://moviee.tv/embed/movie/${id}`
        : `https://moviee.tv/embed/tv/${id}?season=${s}&episode=${e}`,
  },
];

/**
 * Anime ids arrive either as a MAL id ("52991") or an AniList id ("ani21").
 * Every mirror supports both catalogs, so we pick the matching route.
 */
function animeRoute(id: string) {
  const isAniList = id.startsWith("ani");
  return { seg: isAniList ? "ani" : "mal", value: isAniList ? id.slice(3) : id };
}

export const ANIME_SERVERS: StreamServer[] = [
  {
    id: "a1",
    name: "Sakura",
    tagline: "sub & dub",
    buildUrl: (_k, id, _m, _s = 1, e = 1, lang = "sub") => {
      const { seg, value } = animeRoute(id);
      return `https://megaplay.buzz/stream/${seg}/${value}/${e}/${lang}`;
    },
  },
  {
    id: "a2",
    name: "Kitsune",
    tagline: "fast edge",
    buildUrl: (_k, id, _m, _s = 1, e = 1, lang = "sub") => {
      const { seg, value } = animeRoute(id);
      return `https://animeplay.cfd/stream/${seg}/${value}/${e}/${lang}`;
    },
  },
  {
    id: "a3",
    name: "Ronin",
    tagline: "hd pool",
    buildUrl: (_k, id, _m, _s = 1, e = 1, lang = "sub") => {
      const { seg, value } = animeRoute(id);
      const vid = seg === "ani" ? `ani${value}` : value;
      return `https://vidsrc.cc/v2/embed/anime/${vid}/${e}/${lang}`;
    },
  },
  {
    id: "a4",
    name: "Tenshi",
    tagline: "backup node",
    buildUrl: (_k, id, _m, _s = 1, e = 1, lang = "sub") => {
      const { seg, value } = animeRoute(id);
      return `https://megavid.buzz/${seg}/${value}/${e}/${lang}`;
    },
  },
];

export const DEFAULT_SERVER_ID = "s1";
export const DEFAULT_ANIME_SERVER_ID = "a1";

export function getServer(list: StreamServer[], id: string): StreamServer {
  return list.find((server) => server.id === id) ?? list[0];
}
