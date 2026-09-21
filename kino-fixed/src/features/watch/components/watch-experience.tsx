"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Captions,
  ExternalLink,
  MonitorPlay,
  RotateCw,
  ShieldCheck,
  SkipForward,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ANIME_SERVERS,
  DEFAULT_ANIME_SERVER_ID,
  DEFAULT_SERVER_ID,
  STREAM_SERVERS,
  getServer,
  type Lang,
  type ServerKind,
} from "@/features/watch/servers";
import { cn } from "@/lib/utils";
import { recordWatch } from "@/lib/library-store";

export interface EpisodeDto {
  id: string;
  season: number;
  episode: number;
  name: string;
  overview: string;
  released: string;
  thumbnail: string | null;
  rating: string | null;
}

interface WatchExperienceProps {
  kind: ServerKind;
  id: string;
  moviedbId: number | null;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  initialSeason: number;
  initialEpisode: number;
  episodes: EpisodeDto[];
  supportsDub?: boolean;
}

export default function WatchExperience({
  kind,
  id,
  moviedbId,
  title,
  posterPath,
  backdropPath,
  initialSeason,
  initialEpisode,
  episodes,
  supportsDub = false,
}: WatchExperienceProps) {
  const servers = kind === "anime" ? ANIME_SERVERS : STREAM_SERVERS;
  const storageKey = `kino:server:${kind}`;
  const fallbackId = kind === "anime" ? DEFAULT_ANIME_SERVER_ID : DEFAULT_SERVER_ID;

  const [serverId, setServerId] = useState(fallbackId);
  const [lang, setLang] = useState<Lang>("sub");
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(initialEpisode);
  const [episodeSearch, setEpisodeSearch] = useState("");
  const [loadingPlayer, setLoadingPlayer] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const postedRef = useRef<string>("");
  const loadTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved && servers.some((s) => s.id === saved)) {
      setServerId(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const server = getServer(servers, serverId);
  const url = server.buildUrl(kind, id, moviedbId, season, episode, lang);

  const seasonNumbers = [...new Set(episodes.map((e) => e.season))].sort(
    (a, b) => a - b,
  );
  const showSeasons = kind !== "movie" && seasonNumbers.length > 1;
  const seasonEpisodes = episodes
    .filter((e) => (showSeasons ? e.season === season : true))
    .sort((a, b) => a.episode - b.episode);
  const availableLangs = kind === "anime" ? ["sub", server.supportsDub ? "dub" : null].filter(Boolean) as Lang[] : ["sub"];
  const activeLangIsAvailable = availableLangs.includes(lang);
  const effectiveLang = activeLangIsAvailable ? lang : "sub";
  const globalSorted = [...episodes].sort(
    (a, b) => a.season - b.season || a.episode - b.episode,
  );
  const currentIndex = globalSorted.findIndex(
    (e) => e.season === season && e.episode === episode,
  );
  const nextEpisode =
    currentIndex >= 0 ? globalSorted[currentIndex + 1] : undefined;
  const isSerial = kind !== "movie";

  const selectServer = (sid: string) => {
    setServerId(sid);
    window.localStorage.setItem(storageKey, sid);
    setLoadingPlayer(true);
  };

  const toggleLang = () => {
    if (kind !== "anime") return;
    if (!server.supportsDub && lang === "dub") {
      setLang("sub");
      return;
    }
    setLang((l) => (l === "sub" ? "dub" : "sub"));
    setLoadingPlayer(true);
  };

  const reload = () => {
    setLoadingPlayer(true);
    setReloadKey((k) => k + 1);
  };

  useEffect(() => {
    setLoadingPlayer(true);
    if (loadTimeout.current) clearTimeout(loadTimeout.current);
    loadTimeout.current = setTimeout(() => setLoadingPlayer(false), 15000);
    return () => {
      if (loadTimeout.current) clearTimeout(loadTimeout.current);
    };
  }, [url, reloadKey]);

  useEffect(() => {
    if (!server.supportsDub && lang === "dub") {
      setLang("sub");
    }
  }, [lang, server.supportsDub]);

  const watchPath = (s: number, e: number) =>
    kind === "anime"
      ? `/watch/anime/${id}?s=${s}&e=${e}`
      : kind === "tv"
        ? `/watch/tv/${id}?s=${s}&e=${e}`
        : `/watch/movie/${id}`;

  const changeSeason = (n: number) => {
    const first = episodes
      .filter((e) => e.season === n)
      .sort((a, b) => a.episode - b.episode)[0];
    const target = first?.episode ?? 1;
    setSeason(n);
    setEpisode(target);
    setEpisodeSearch("");
    window.history.replaceState(null, "", watchPath(n, target));
  };

  const changeEpisode = (n: number, s?: number) => {
    const targetSeason = s ?? season;
    setSeason(targetSeason);
    setEpisode(n);
    window.history.replaceState(null, "", watchPath(targetSeason, n));
  };

  const filteredEpisodes = seasonEpisodes.filter((ep) => {
    const q = episodeSearch.trim().toLowerCase();
    if (!q) return true;
    const label = `e${ep.episode}`;
    return (
      label.includes(q) ||
      ep.name.toLowerCase().includes(q) ||
      `${ep.episode}`.includes(q)
    );
  });

  // record watch history locally — no server, no account needed
  useEffect(() => {
    const key = `${kind}:${id}:${season}:${episode}`;
    if (postedRef.current === key) return;
    postedRef.current = key;
    recordWatch({
      mediaType: kind,
      imdbId: id,
      title: isSerial ? `${title} · E${episode}` : title,
      posterPath,
      backdropPath,
      season: kind === "tv" ? season : null,
      episode: isSerial ? episode : null,
    });
  }, [kind, id, title, posterPath, backdropPath, season, episode, isSerial]);

  return (
    <div>
      {/* ------------------------------- player ------------------------------- */}
      <div className="relative">
        <div className="pointer-events-none absolute -inset-x-2 bottom-0 h-1/3 bg-acid/[0.07] blur-3xl" />
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-panel ring-1 ring-line">
          <AnimatePresence>
            {loadingPlayer && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-panel"
              >
                <MonitorPlay size={42} className="animate-pulse-soft text-acid" />
                <p className="font-display text-xl tracking-[0.2em] text-bone uppercase">
                  Connecting mirror {server.name}
                </p>
                <p className="max-w-xs text-center text-xs leading-relaxed text-fog">
                  Streams run inside a third-party player. A free ad-blocker
                  improves the experience.
                </p>
                <div className="h-[3px] w-40 overflow-hidden rounded-full bg-line">
                  <div className="h-full w-1/3 animate-[barslide_1.2s_ease-in-out_infinite] rounded-full bg-acid" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <iframe
            key={`${url}:${reloadKey}`}
            src={url}
            title={`${title} — mirror ${server.name}`}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="origin"
            onLoad={() => setLoadingPlayer(false)}
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>

      {/* ------------------------------ server bar ----------------------------- */}
      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        <span className="mr-1 flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-fog uppercase">
          <span className="size-1.5 animate-pulse-soft rounded-full bg-acid" />
          Mirrors
          <span className="rounded-full border border-line px-1.5 py-0.5 font-mono text-[9px] tracking-normal text-fog/80">
            {servers.length}
          </span>
        </span>
        {servers.map((s, i) => (
          <button
            key={s.id}
            onClick={() => selectServer(s.id)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-bold tracking-[0.1em] uppercase transition-all active:scale-95",
              s.id === serverId
                ? "border-acid bg-acid text-void shadow-[0_0_24px_rgba(215,246,55,0.35)]"
                : "border-line bg-panel/60 text-bone/80 hover:border-bone/40 hover:text-bone",
            )}
          >
            <span
              className={cn(
                "font-editorial text-[10px] italic",
                s.id === serverId ? "text-void/60" : "text-acid/60",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {s.name}
            <span
              className={cn(
                "hidden text-[10px] font-medium normal-case tracking-normal md:inline",
                s.id === serverId ? "text-void/60" : "text-fog",
              )}
            >
              {s.tagline}
            </span>
          </button>
        ))}

        {kind === "anime" && (
          <div className="ml-1 flex items-center gap-2 rounded-full border border-line bg-panel/60 p-1">
            {(["sub", "dub"] as const).map((option) => {
              const enabled = option === "sub" || server.supportsDub !== false;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={!enabled}
                  onClick={() => {
                    if (enabled) {
                      setLang(option);
                      setLoadingPlayer(true);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all",
                    effectiveLang === option
                      ? "bg-acid text-void"
                      : enabled
                        ? "text-fog hover:text-bone"
                        : "cursor-not-allowed text-fog/40",
                  )}
                >
                  <Captions size={12} />
                  {option === "sub" ? "Sub" : "Dub"}
                </button>
              );
            })}
            {!server.supportsDub && (
              <span className="rounded-full border border-dashed border-line px-2 py-1 text-[9px] font-bold tracking-[0.18em] uppercase text-fog">
                Dub unavailable
              </span>
            )}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {isSerial && nextEpisode && (
            <button
              onClick={() =>
                changeEpisode(nextEpisode.episode, nextEpisode.season)
              }
              className="flex items-center gap-2 rounded-full border border-acid/40 bg-acid/10 px-4 py-2 text-[11px] font-bold tracking-[0.1em] text-acid uppercase transition-all hover:border-acid active:scale-95"
            >
              <SkipForward size={13} />
              Next E{nextEpisode.episode}
            </button>
          )}
          <button
            onClick={reload}
            aria-label="Reload player"
            className="flex size-9 items-center justify-center rounded-full border border-line text-fog transition-all hover:rotate-180 hover:border-bone/40 hover:text-bone"
          >
            <RotateCw size={14} />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label="Open player in new tab"
            className="flex size-9 items-center justify-center rounded-full border border-line text-fog transition-all hover:border-bone/40 hover:text-bone"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-[11px] text-fog">
        <ShieldCheck size={13} className="text-acid/80" />
        Mirrors are load-balanced and their upstream origins are intentionally
        gated — if one stalls, jump to another.
      </p>

      {/* ------------------------------- episodes ------------------------------ */}
      {isSerial && globalSorted.length > 0 && (
        <div className="mt-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <h2 className="flex items-baseline gap-3 font-display text-3xl tracking-[0.08em] uppercase">
              <span className="text-bone">Episodes</span>
              {kind === "tv" && (
                <span className="font-editorial text-xl italic normal-case text-acid">
                  season {season}
                </span>
              )}
              {kind === "anime" && (
                <span className="font-editorial text-xl italic normal-case text-acid">
                  {globalSorted.length} total
                </span>
              )}
            </h2>
            {showSeasons && (
              <div className="no-scrollbar -mx-1 flex max-w-full gap-2 overflow-x-auto px-1 py-1">
                {seasonNumbers.map((s) => (
                  <button
                    key={s}
                    onClick={() => changeSeason(s)}
                    className={cn(
                      "shrink-0 rounded-full border px-4 py-1.5 font-display text-sm tracking-[0.14em] uppercase transition-all active:scale-95",
                      s === season
                        ? "border-acid bg-acid text-void"
                        : "border-line bg-panel/60 text-fog hover:border-bone/40 hover:text-bone",
                    )}
                  >
                    S{s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-line bg-panel/60 px-3 py-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-fog uppercase">
              Search
            </span>
            <input
              value={episodeSearch}
              onChange={(e) => setEpisodeSearch(e.target.value)}
              placeholder="Episode 4, title, or keyword"
              className="w-full bg-transparent text-sm text-bone outline-none placeholder:text-fog/50"
            />
            {episodeSearch && (
              <button
                type="button"
                onClick={() => setEpisodeSearch("")}
                className="rounded-full border border-line px-2 py-1 text-[9px] font-bold tracking-[0.15em] text-fog uppercase"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-2">
            {filteredEpisodes.map((ep) => {
              const active = ep.episode === episode && (kind !== "tv" || ep.season === season);
              return (
                <button
                  key={ep.id || `${ep.season}-${ep.episode}`}
                  onClick={() => changeEpisode(ep.episode, ep.season)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-200 active:scale-[0.995]",
                    active
                      ? "border-acid bg-acid/10 shadow-[0_0_28px_rgba(215,246,55,0.12)]"
                      : "border-line bg-panel/50 hover:border-bone/30 hover:bg-panel/70",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl font-display text-xl leading-none tracking-[0.08em] uppercase",
                        active ? "bg-acid text-void" : "bg-panel2 text-bone",
                      )}
                    >
                      {String(ep.episode).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-acid uppercase">
                        {kind === "anime" ? "Episode" : `E${String(ep.episode).padStart(2, "0")}`}
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-bone/90">
                        {ep.name || `Episode ${ep.episode}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-fog uppercase">
                    {ep.released ? <span>{ep.released.slice(0, 4)}</span> : null}
                    {active && <span className="rounded-full bg-acid px-2 py-1 font-bold text-void">Now</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredEpisodes.length === 0 && (
            <p className="rounded-xl border border-dashed border-line py-10 text-center text-sm text-fog">
              No episodes match that search.
            </p>
          )}

          {seasonEpisodes.length === 0 && (
            <p className="rounded-xl border border-dashed border-line py-10 text-center text-sm text-fog">
              No episode data for this section yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
