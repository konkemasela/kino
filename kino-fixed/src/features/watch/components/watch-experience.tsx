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
  const [partySync, setPartySync] = useState<{
    season: number;
    episode: number;
    source: string;
  } | null>(null);
  const [nickname, setNickname] = useState("Guest");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{
    id: string;
    nickname: string;
    text: string;
    at: string;
  }[]>([]);
  const [captchaPassed, setCaptchaPassed] = useState(true);
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState({
    a: 2,
    b: 3,
    answer: 5,
  });

  const postedRef = useRef<string>("");
  const loadTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roomKey = `${kind}:${id}`;
  const sessionChatKey = `kino:watch-chat:${roomKey}`;
  const nicknameKey = `kino:watch-nickname:${kind}:${id}`;

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved && servers.some((s) => s.id === saved)) {
      setServerId(saved);
    }

    const savedNickname = window.localStorage.getItem(nicknameKey) || "Guest";
    setNickname(savedNickname || "Guest");

    const savedMessages = window.localStorage.getItem(sessionChatKey);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed)) setChatMessages(parsed.slice(-40));
      } catch {
        /* ignore */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(nicknameKey, nickname);
  }, [nickname, nicknameKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `kino:watch-captcha:${roomKey}`;
    const passed = window.localStorage.getItem(key) === "passed";
    setCaptchaPassed(passed);
    setCaptchaOpen(!passed);
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 9) + 1;
    setCaptchaQuestion({ a, b, answer: a + b });
    setCaptchaInput("");
    setCaptchaError("");
  }, [roomKey]);

  const submitCaptcha = () => {
    const value = Number(captchaInput.trim());
    if (value === captchaQuestion.answer) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(`kino:watch-captcha:${roomKey}`, "passed");
      }
      setCaptchaPassed(true);
      setCaptchaOpen(false);
      setCaptchaError("");
      setCaptchaInput("");
      return;
    }

    setCaptchaError("Incorrect answer. Please try again.");
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 9) + 1;
    setCaptchaQuestion({ a, b, answer: a + b });
    setCaptchaInput("");
  };

  const server = getServer(servers, serverId);
  const url = server.buildUrl(kind, id, moviedbId, season, episode, lang);

  const seasonNumbers = [...new Set(episodes.map((e) => e.season))].sort(
    (a, b) => a - b,
  );
  const showSeasons = kind !== "movie" && kind !== "anime" && seasonNumbers.length > 1;
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const channel = "kino:watch-chat";
    const bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(channel) : null;

    const onMessage = (event: MessageEvent) => {
      const data = event.data as {
        room?: string;
        message?: { id: string; nickname: string; text: string; at: string };
      };
      if (!data.room || data.room !== roomKey || !data.message) return;
      setChatMessages((prev) => {
        const next = [...prev, data.message!].slice(-40);
        const unique = next.filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);
        return unique;
      });
    };

    if (bc) {
      bc.addEventListener("message", onMessage as EventListener);
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key !== sessionChatKey || !event.newValue) return;
      try {
        const parsed = JSON.parse(event.newValue) as Array<{
          id: string;
          nickname: string;
          text: string;
          at: string;
        }>;
        if (Array.isArray(parsed)) setChatMessages(parsed.slice(-40));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      if (bc) {
        bc.removeEventListener("message", onMessage as EventListener);
        bc.close();
      }
      window.removeEventListener("storage", onStorage);
    };
  }, [roomKey, sessionChatKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(sessionChatKey, JSON.stringify(chatMessages.slice(-40)));
  }, [chatMessages, sessionChatKey]);

  const watchPath = (s: number, e: number) =>
    kind === "anime"
      ? `/watch/anime/${id}?s=${s}&e=${e}`
      : kind === "tv"
        ? `/watch/tv/${id}?s=${s}&e=${e}`
        : `/watch/movie/${id}`;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const isParty = params.get("party") === "community";
    const sharedType = params.get("type");
    const sharedId = params.get("id");
    const sharedSeason = Number(params.get("s") ?? "1");
    const sharedEpisode = Number(params.get("e") ?? "1");

    if (!isParty || !sharedType || !sharedId) return;
    if (sharedType !== kind || sharedId !== id) return;

    const targetSeason = Number.isFinite(sharedSeason) && sharedSeason > 0 ? sharedSeason : 1;
    const targetEpisode = Number.isFinite(sharedEpisode) && sharedEpisode > 0 ? sharedEpisode : 1;

    setPartySync({
      season: targetSeason,
      episode: targetEpisode,
      source: `community:${sharedType}:${sharedId}`,
    });

    setSeason(targetSeason);
    setEpisode(targetEpisode);

    const roomKey = `kino:party:${kind}:${id}`;
    const syncState = {
      kind,
      id,
      season: targetSeason,
      episode: targetEpisode,
      joinedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(roomKey, JSON.stringify(syncState));
    window.localStorage.setItem("kino:party:last", roomKey);
    window.history.replaceState(null, "", watchPath(targetSeason, targetEpisode));
  }, [id, kind, watchPath]);

  const sendChatMessage = () => {
    const value = chatInput.trim();
    if (!value) return;
    const message = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      nickname: nickname.trim() || "Guest",
      text: value.slice(0, 260),
      at: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, message].slice(-40));
    setChatInput("");

    if (typeof window !== "undefined") {
      const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("kino:watch-chat") : null;
      if (channel) {
        channel.postMessage({ room: roomKey, message });
        channel.close();
      }
    }
  };

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
    <div className="relative">
      <AnimatePresence>
        {captchaOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-void/85 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 18, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 8, opacity: 0 }}
              className="w-full max-w-md rounded-[24px] border border-line bg-panel p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
            >
              <p className="text-[10px] font-bold tracking-[0.3em] text-acid uppercase">
                Watch session access
              </p>
              <h3 className="mt-3 font-display text-3xl tracking-[0.06em] text-bone uppercase">
                Verify you're human
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">
                Solve the quick check to unlock this watch room and chat.
              </p>

              <div className="mt-5 rounded-2xl border border-line bg-void/40 p-4">
                <p className="text-[10px] font-bold tracking-[0.24em] text-fog uppercase">
                  CAPTCHA
                </p>
                <div className="mt-3 flex items-center justify-center gap-3 text-2xl font-display tracking-[0.08em] text-bone uppercase">
                  <span>{captchaQuestion.a}</span>
                  <span className="text-acid">+</span>
                  <span>{captchaQuestion.b}</span>
                  <span className="text-fog">=</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <input
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="Type the answer"
                  className="w-full rounded-full border border-line bg-void/50 px-3 py-2.5 text-sm text-bone outline-none placeholder:text-fog/50"
                />
                <button
                  type="button"
                  onClick={submitCaptcha}
                  className="rounded-full bg-acid px-4 py-2.5 text-[10px] font-bold tracking-[0.18em] text-void uppercase"
                >
                  Enter
                </button>
              </div>

              {captchaError && (
                <p className="mt-3 text-sm text-ember">{captchaError}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!captchaPassed && <div className="pointer-events-none absolute inset-0 z-40 bg-void/30" />}

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

      {partySync && (
        <div className="mt-5 rounded-2xl border border-acid/30 bg-acid/8 px-4 py-3 shadow-[0_0_28px_rgba(216,249,179,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.26em] text-acid uppercase">
              <span className="inline-flex size-2 rounded-full bg-acid" />
              Watch party sync
            </div>
            <span className="text-[10px] font-medium tracking-[0.12em] text-fog uppercase">
              {kind === "anime" ? "Anime room" : "Group session"}
            </span>
          </div>
          <p className="mt-2 text-sm text-bone/90">
            Jumped to {kind === "anime" ? "Episode" : "Season"} {partySync.season > 1 || kind !== "anime" ? `S${partySync.season} ` : ""}E{partySync.episode}
            {kind === "anime" ? " for everyone in the room." : " and synced to the same moment."}
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 rounded-[20px] border border-line bg-panel/55 p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <label className="text-[10px] font-bold tracking-[0.2em] text-fog uppercase">
            Nickname
          </label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 18))}
            placeholder="Guest"
            className="w-full max-w-[180px] rounded-full border border-line bg-void/50 px-3 py-2 text-sm text-bone outline-none placeholder:text-fog/50"
          />
        </div>

        <button
          type="button"
          onClick={() => setChatOpen((open) => !open)}
          disabled={!captchaPassed}
          className="inline-flex items-center justify-center rounded-full border border-acid/40 bg-acid/10 px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-acid uppercase transition-all hover:border-acid hover:bg-acid hover:text-void disabled:cursor-not-allowed disabled:border-line disabled:bg-panel/40 disabled:text-fog"
        >
          {chatOpen ? "Hide chat" : "Open chat"}
        </button>
      </div>

      {chatOpen && (
        <div className="mt-4 overflow-hidden rounded-[22px] border border-line bg-panel/70">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-[10px] font-bold tracking-[0.22em] text-acid uppercase">
              Watch session chat
            </p>
            <span className="text-[10px] text-fog">{chatMessages.length} msgs</span>
          </div>

          <div className="max-h-[260px] space-y-3 overflow-y-auto p-4">
            {chatMessages.length === 0 ? (
              <p className="py-8 text-center text-sm text-fog">
                No messages yet — start the room conversation.
              </p>
            ) : (
              chatMessages.map((message) => (
                <div key={message.id} className="rounded-2xl border border-line bg-void/35 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold tracking-[0.18em] text-acid uppercase">
                      {message.nickname}
                    </span>
                    <span className="text-[9px] text-fog">
                      {new Date(message.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-bone/90">{message.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-3 border-t border-line p-3">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendChatMessage();
              }}
              placeholder="Send a room message…"
              className="w-full rounded-full border border-line bg-void/50 px-3 py-2.5 text-sm text-bone outline-none placeholder:text-fog/50"
            />
            <button
              type="button"
              onClick={sendChatMessage}
              className="rounded-full bg-acid px-4 py-2.5 text-[10px] font-bold tracking-[0.18em] text-void uppercase"
            >
              Send
            </button>
          </div>
        </div>
      )}

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

          <div
            className={cn(
              "grid gap-3",
              kind === "anime" ? "sm:grid-cols-2 xl:grid-cols-3" : "space-y-2",
            )}
          >
            {filteredEpisodes.map((ep) => {
              const active = ep.episode === episode && (kind !== "tv" || ep.season === season);
              return (
                <button
                  key={ep.id || `${ep.season}-${ep.episode}`}
                  onClick={() => changeEpisode(ep.episode, ep.season)}
                  className={cn(
                    "text-left transition-all duration-200 active:scale-[0.995]",
                    kind === "anime"
                      ? "group flex min-h-[150px] flex-col justify-between rounded-[22px] border p-4"
                      : "flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-3",
                    active
                      ? "border-acid bg-acid/10 shadow-[0_0_28px_rgba(216,249,179,0.12)]"
                      : "border-line bg-panel/50 hover:border-bone/30 hover:bg-panel/70",
                  )}
                >
                  <div className={cn(kind === "anime" ? "flex items-start justify-between gap-3" : "flex min-w-0 items-center gap-3")}>
                    <span
                      className={cn(
                        "flex items-center justify-center rounded-xl font-display leading-none tracking-[0.08em] uppercase",
                        kind === "anime"
                          ? "h-12 w-12 text-xl"
                          : "h-12 w-12 text-xl",
                        active ? "bg-acid text-void" : "bg-panel2 text-bone",
                      )}
                    >
                      {String(ep.episode).padStart(2, "0")}
                    </span>
                    {active && (
                      <span className="rounded-full bg-acid px-2 py-1 text-[9px] font-bold tracking-[0.12em] text-void uppercase">
                        Now
                      </span>
                    )}
                  </div>

                  <div className={cn(kind === "anime" ? "mt-4 min-w-0" : "min-w-0")}>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-acid uppercase">
                      {kind === "anime" ? "Episode" : `E${String(ep.episode).padStart(2, "0")}`}
                    </p>
                    <p className={cn(
                      "mt-1 text-sm font-medium text-bone/90",
                      kind === "anime" ? "line-clamp-3" : "truncate",
                    )}>
                      {ep.name || `Episode ${ep.episode}`}
                    </p>
                  </div>

                  {kind !== "anime" && (
                    <div className="flex items-center gap-2 text-[10px] text-fog uppercase">
                      {ep.released ? <span>{ep.released.slice(0, 4)}</span> : null}
                    </div>
                  )}

                  {kind === "anime" && ep.released && (
                    <div className="mt-4 flex items-center justify-between border-t border-line/80 pt-3 text-[10px] font-bold tracking-[0.14em] text-fog uppercase">
                      <span>{ep.released.slice(0, 4)}</span>
                      <span>Open</span>
                    </div>
                  )}
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
