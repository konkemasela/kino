"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, Compass, History } from "lucide-react";
import type { ServerKind } from "@/features/watch/servers";
import { watchHref } from "@/lib/utils";
import MediaCard from "@/features/catalog/components/media-card";
import MediaGrid from "@/features/catalog/components/media-grid";
import Rail, { RailItem } from "@/components/ui/rail";
import { ensureDeviceIdClient } from "@/lib/device-client";

interface HistoryEntry {
  mediaType: ServerKind;
  imdbId: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  season: number | null;
  episode: number | null;
  updatedAt: string;
}

interface ListEntry {
  mediaType: ServerKind;
  imdbId: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  createdAt: string;
}

export default function LibraryView() {
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);
  const [list, setList] = useState<ListEntry[] | null>(null);

  useEffect(() => {
    ensureDeviceIdClient();
    fetch("/api/history")
      .then((r) => r.json())
      .then((d) => setHistory(d.items ?? []))
      .catch(() => setHistory([]));
    fetch("/api/watchlist")
      .then((r) => r.json())
      .then((d) => setList(d.items ?? []))
      .catch(() => setList([]));
  }, []);

  const loading = history === null || list === null;
  const empty =
    !loading && (history?.length ?? 0) === 0 && (list?.length ?? 0) === 0;

  const removeHistory = async (entry: HistoryEntry) => {
    setHistory((prev) =>
      (prev ?? []).filter(
        (i) => !(i.mediaType === entry.mediaType && i.imdbId === entry.imdbId),
      ),
    );
    await fetch(`/api/history?type=${entry.mediaType}&id=${entry.imdbId}`, {
      method: "DELETE",
    }).catch(() => undefined);
  };

  const removeList = async (entry: ListEntry) => {
    setList((prev) =>
      (prev ?? []).filter(
        (i) => !(i.mediaType === entry.mediaType && i.imdbId === entry.imdbId),
      ),
    );
    await fetch(`/api/watchlist?type=${entry.mediaType}&id=${entry.imdbId}`, {
      method: "DELETE",
    }).catch(() => undefined);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-32 md:px-10 md:pb-10 md:pt-40">
      <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
        <span className="h-px w-10 bg-acid" />
        Stored on this device
      </p>
      <h1 className="mt-4 font-display text-6xl tracking-[0.03em] uppercase md:text-8xl">
        My{" "}
        <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">
          space
        </span>
      </h1>

      {loading ? (
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-panel" />
          ))}
        </div>
      ) : empty ? (
        <div className="mt-16 flex flex-col items-center gap-6 rounded-3xl border border-dashed border-line py-24 text-center">
          <Compass size={42} className="text-acid" />
          <p className="max-w-md text-sm leading-relaxed text-fog">
            Nothing here yet. Everything you watch appears under Continue
            Watching, and anything you bookmark lands in your list.
          </p>
          <Link
            href="/movies"
            className="rounded-full bg-acid px-7 py-3 text-[11px] font-bold tracking-[0.2em] text-void uppercase transition-transform hover:scale-105"
          >
            Start exploring
          </Link>
        </div>
      ) : (
        <div className="mt-14 space-y-20">
          {history && history.length > 0 && (
            <div>
              <Rail title="Continue" accent="pick up where you left">
                {history.map((entry) => (
                  <RailItem key={`${entry.mediaType}-${entry.imdbId}`}>
                    <MediaCard
                      item={{
                        id: entry.imdbId,
                        name: entry.title,
                        poster: entry.posterPath,
                      }}
                      type={entry.mediaType}
                      href={watchHref(
                        entry.mediaType,
                        entry.imdbId,
                        entry.season ?? 1,
                        entry.episode ?? 1,
                      )}
                      subtitle={
                        entry.mediaType === "tv"
                          ? `Resume S${entry.season ?? 1} · E${entry.episode ?? 1}`
                          : entry.mediaType === "anime"
                            ? `Resume episode ${entry.episode ?? 1}`
                            : "Resume movie"
                      }
                      onRemove={() => removeHistory(entry)}
                    />
                  </RailItem>
                ))}
              </Rail>
            </div>
          )}

          {list && list.length > 0 && (
            <section>
              <h2 className="mb-8 flex items-baseline gap-3 font-display text-3xl tracking-[0.08em] uppercase md:text-4xl">
                <Bookmark size={22} className="self-center text-acid" />
                <span className="text-bone">Saved</span>
                <span className="font-editorial text-xl italic normal-case text-acid md:text-2xl">
                  your watchlist
                </span>
                <span className="ml-auto flex items-center gap-2 text-[11px] font-sans font-bold tracking-[0.2em] text-fog uppercase">
                  <History size={13} />
                  {list.length} title{list.length === 1 ? "" : "s"}
                </span>
              </h2>
              <MediaGrid>
                {list.map((entry) => (
                  <MediaCard
                    key={`${entry.mediaType}-${entry.imdbId}`}
                    item={{
                      id: entry.imdbId,
                      name: entry.title,
                      poster: entry.posterPath,
                    }}
                    type={entry.mediaType}
                    onRemove={() => removeList(entry)}
                  />
                ))}
              </MediaGrid>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
