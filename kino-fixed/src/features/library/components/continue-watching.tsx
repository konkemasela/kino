"use client";

import { useCallback, useEffect, useState } from "react";
import Rail, { RailItem } from "@/components/ui/rail";
import MediaCard from "@/features/catalog/components/media-card";
import { watchHref } from "@/lib/utils";
import type { ServerKind } from "@/features/watch/servers";
import {
  getHistory,
  onLibraryChange,
  removeHistory,
  type LibraryEntry,
} from "@/lib/library-store";

export default function ContinueWatching() {
  const [items, setItems] = useState<LibraryEntry[] | null>(null);

  const load = useCallback(() => {
    setItems(getHistory());
  }, []);

  useEffect(() => {
    load();
    return onLibraryChange(load);
  }, [load]);

  if (!items || items.length === 0) return null;

  const remove = (entry: LibraryEntry) => {
    setItems(removeHistory(entry.mediaType, entry.imdbId));
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
            type={entry.mediaType as ServerKind}
            href={watchHref(
              entry.mediaType as ServerKind,
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
