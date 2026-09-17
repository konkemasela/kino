"use client";

import { useCallback, useEffect, useState } from "react";
import Rail, { RailItem } from "@/components/ui/rail";
import MediaCard from "@/features/catalog/components/media-card";
import { watchHref } from "@/lib/utils";
import type { ServerKind } from "@/features/watch/servers";

export interface HistoryEntry {
  mediaType: ServerKind;
  imdbId: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  season: number | null;
  episode: number | null;
  updatedAt: string;
}

export default function ContinueWatching() {
  const [items, setItems] = useState<HistoryEntry[] | null>(null);

  const load = useCallback(() => {
    fetch("/api/history")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]));
  }, []);

  useEffect(load, [load]);

  if (!items || items.length === 0) return null;

  const remove = async (entry: HistoryEntry) => {
    setItems((prev) =>
      (prev ?? []).filter(
        (i) => !(i.mediaType === entry.mediaType && i.imdbId === entry.imdbId),
      ),
    );
    await fetch(
      `/api/history?type=${entry.mediaType}&id=${entry.imdbId}`,
      { method: "DELETE" },
    ).catch(() => undefined);
  };

  return (
    <Rail title="Continue" accent="where you left off">
      {items.map((entry) => (
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
            onRemove={() => remove(entry)}
          />
        </RailItem>
      ))}
    </Rail>
  );
}
