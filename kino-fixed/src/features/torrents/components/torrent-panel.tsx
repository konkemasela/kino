"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Download,
  FileDown,
  Magnet,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/features/catalog/api";

interface MovieTorrent {
  hash: string;
  quality: string;
  type: string;
  codec: string;
  size: string;
  seeds: number;
  peers: number;
  uploaded: string;
}

interface TvTorrent {
  id: number;
  hash: string;
  title: string;
  season: number;
  episode: number;
  seeds: number;
  peers: number;
  size: string;
  released: string;
  magnet: string;
  torrentUrl: string;
  screenshot: string | null;
}

interface TorrentResponse {
  found: boolean;
  title?: string;
  year?: number | null;
  torrents: (MovieTorrent & TvTorrent)[];
  seasons?: number;
}

const TRACKERS = [
  "udp://open.demonii.com:1337/announce",
  "udp://tracker.openbittorrent.com:6969/announce",
  "udp://exodus.desync.com:6969/announce",
  "udp://tracker.opentrackr.org:1337/announce",
  "udp://tracker.torrent.eu.org:451/announce",
];

function magnetFor(hash: string, name: string) {
  const tr = TRACKERS.map((t) => `&tr=${encodeURIComponent(t)}`).join("");
  return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(name)}${tr}`;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
  }
}

export default function TorrentPanel({
  imdbId,
  title,
  mediaType = "movie",
}: {
  imdbId: string;
  title: string;
  mediaType?: MediaType;
}) {
  const [data, setData] = useState<TorrentResponse | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeSeason, setActiveSeason] = useState<number>(1);

  useEffect(() => {
    let cancelled = false;
    const query =
      mediaType === "tv" ? `?imdb=${imdbId}&type=tv` : `?imdb=${imdbId}`;
    fetch(`/api/torrent${query}`)
      .then((r) => r.json())
      .then((d: TorrentResponse) => {
        if (cancelled) return;
        setData(d);
        if (d.found && mediaType === "tv" && d.torrents.length > 0) {
          setActiveSeason(Math.min(...d.torrents.map((t) => t.season)) || 1);
        }
      })
      .catch(() => {
        if (!cancelled) setData({ found: false, torrents: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [imdbId, mediaType]);

  const flashCopied = (key: string) => {
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const isTv = mediaType === "tv";
  const tvTorrents = isTv && data?.found ? (data.torrents as TvTorrent[]) : [];
  const seasonList = [...new Set(tvTorrents.map((t) => t.season))].sort(
    (a, b) => a - b,
  );
  const visibleEpisodes = tvTorrents.filter((t) => t.season === activeSeason);

  return (
    <section id="torrent-vault" className="mt-12 scroll-mt-24">
      <div className="mb-5 flex flex-wrap items-baseline gap-3 font-display text-3xl tracking-[0.08em] uppercase">
        <Magnet size={22} className="translate-y-0.5 text-acid" />
        <span className="text-bone">Torrent vault</span>
        <span className="font-editorial text-xl italic normal-case text-acid">
          {isTv ? "every episode, one vault" : "direct magnet mirrors"}
        </span>
      </div>

      {data === null ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[92px] animate-pulse rounded-xl border border-line bg-panel/60"
            />
          ))}
        </div>
      ) : !data.found ? (
        <p className="rounded-xl border border-dashed border-line py-10 text-center text-sm text-fog">
          {isTv
            ? "No episode torrents indexed for this series yet — check back later."
            : "No torrent entries mirrored for this title yet — check back after its home-media release."}
        </p>
      ) : isTv ? (
        <>
          <p className="mb-5 flex items-baseline gap-2 text-sm text-fog">
            <span className="font-display text-xl tracking-[0.1em] text-acid uppercase">
              {tvTorrents.length}
            </span>
            episode torrents across
            <span className="font-display text-xl tracking-[0.1em] text-acid uppercase">
              {seasonList.length}
            </span>
            season{seasonList.length === 1 ? "" : "s"} — seeded by the EZTV
            relay network.
          </p>

          {seasonList.length > 1 && (
            <div className="no-scrollbar -mx-1 mb-5 flex max-w-full gap-2 overflow-x-auto px-1 py-1">
              {seasonList.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSeason(s)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-1.5 font-display text-sm tracking-[0.14em] uppercase transition-all active:scale-95",
                    s === activeSeason
                      ? "border-acid bg-acid text-void"
                      : "border-line bg-panel/60 text-fog hover:border-bone/40 hover:text-bone",
                  )}
                >
                  S{s}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visibleEpisodes.map((t) => {
              const magnetUrl =
                t.magnet || magnetFor(t.hash, `${title} S${t.season}E${t.episode}`);
              const key = `${t.season}-${t.episode}-${t.id}`;
              return (
                <div
                  key={key}
                  className="group overflow-hidden rounded-xl border border-line bg-panel/60 transition-colors hover:border-bone/25"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-panel2">
                    {t.screenshot ? (
                      <Image
                        src={t.screenshot}
                        alt={t.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-3xl text-outline">
                        S{String(t.season).padStart(2, "0")}E
                        {String(t.episode).padStart(2, "0")}
                      </div>
                    )}
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-void/70 px-2 py-1 text-[10px] font-bold tracking-wider text-acid backdrop-blur-md">
                      <Users size={10} />
                      {t.seeds}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-acid uppercase">
                      S{String(t.season).padStart(2, "0")} · E
                      {String(t.episode).padStart(2, "0")}
                    </p>
                    <p className="mt-1 line-clamp-1 text-[13px] font-semibold text-bone/90">
                      {t.title}
                    </p>
                    <p className="mt-1 text-[11px] text-fog">
                      {t.size}
                      {t.released ? ` · ${t.released.slice(0, 10)}` : ""}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => {
                          void copyText(magnetUrl);
                          flashCopied(key);
                        }}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[10px] font-bold tracking-[0.14em] uppercase transition-all active:scale-95",
                          copied === key
                            ? "border-acid bg-acid text-void"
                            : "border-line text-bone/85 hover:border-acid hover:text-acid",
                        )}
                      >
                        {copied === key ? <Check size={13} /> : <Copy size={13} />}
                        {copied === key ? "Copied" : "Magnet"}
                      </button>
                      <a
                        href={magnetUrl}
                        aria-label="Open magnet link"
                        className="flex size-10 items-center justify-center rounded-xl border border-line text-fog transition-all hover:border-acid hover:text-acid active:scale-95"
                      >
                        <Magnet size={15} />
                      </a>
                      {t.torrentUrl && (
                        <a
                          href={t.torrentUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Download torrent file"
                          className="flex size-10 items-center justify-center rounded-xl bg-acid text-void transition-transform hover:scale-105 active:scale-95"
                        >
                          <FileDown size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            {(data.torrents as MovieTorrent[]).map((t) => {
              const key = `${t.quality}-${t.hash.slice(0, 8)}`;
              return (
                <div
                  key={t.hash}
                  className="flex items-center gap-4 rounded-xl border border-line bg-panel/60 p-4 transition-colors hover:border-bone/25"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-acid/10 font-display text-lg tracking-wider text-acid">
                    {t.quality.replace("p", "P")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] font-semibold text-bone">
                      {t.quality}
                      <span className="rounded-full border border-line px-2 py-0.5 text-[9px] font-bold tracking-[0.16em] text-fog uppercase">
                        {t.type}
                      </span>
                      <span className="rounded-full border border-line px-2 py-0.5 text-[9px] font-bold tracking-[0.16em] text-fog uppercase">
                        {t.codec}
                      </span>
                    </p>
                    <p className="mt-1 flex items-center gap-3 text-[11px] text-fog">
                      <span>{t.size}</span>
                      <span className="flex items-center gap-1 text-acid">
                        <Users size={11} />
                        {t.seeds}
                      </span>
                      <span>peers {t.peers}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => {
                        void copyText(magnetFor(t.hash, `${title} ${t.quality}`));
                        flashCopied(key);
                      }}
                      aria-label="Copy magnet link"
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full border transition-all active:scale-95",
                        copied === key
                          ? "border-acid bg-acid text-void"
                          : "border-line text-fog hover:border-acid hover:text-acid",
                      )}
                    >
                      {copied === key ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <a
                      href={magnetFor(t.hash, `${title} ${t.quality}`)}
                      aria-label="Open magnet link"
                      className="flex size-9 items-center justify-center rounded-full border border-line text-fog transition-all hover:border-acid hover:text-acid active:scale-95"
                    >
                      <Magnet size={14} />
                    </a>
                    <a
                      href={`https://yts.lt/torrent/download/${t.hash}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Download torrent file"
                      className="flex size-9 items-center justify-center rounded-full bg-acid text-void transition-transform hover:scale-105 active:scale-95"
                    >
                      <FileDown size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-fog">
        <Download size={13} className="mt-0.5 shrink-0 text-acid/80" />
        {isTv
          ? "Episode torrents are fetched from the EZTV relay network and delivered as magnet links or .torrent files. Downloading copyrighted material may be unlawful where you live — use only for content you have rights to. See the legal section for details."
          : "Torrents are fetched from a public index and delivered as magnet links or .torrent files. Downloading copyrighted material may be unlawful where you live — use only for content you have rights to. See the legal section for details."}
      </p>
    </section>
  );
}
