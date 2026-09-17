"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServerKind } from "@/features/watch/servers";

interface ListButtonProps {
  mediaType: ServerKind;
  imdbId: string;
  title: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  className?: string;
}

export default function ListButton({
  mediaType,
  imdbId,
  title,
  posterPath,
  backdropPath,
  className,
}: ListButtonProps) {
  const [inList, setInList] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/watchlist?type=${mediaType}&id=${imdbId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setInList(Boolean(d.inList));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [mediaType, imdbId]);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    const next = !inList;
    setInList(next);
    try {
      if (next) {
        await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mediaType,
            imdbId,
            title,
            posterPath: posterPath ?? null,
            backdropPath: backdropPath ?? null,
          }),
        });
      } else {
        await fetch(`/api/watchlist?type=${mediaType}&id=${imdbId}`, {
          method: "DELETE",
        });
      }
    } catch {
      setInList(!next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center gap-2.5 rounded-full border px-6 py-3.5 text-[12px] font-bold tracking-[0.18em] uppercase backdrop-blur-md transition-all active:scale-95",
        inList
          ? "border-acid/60 bg-acid/15 text-acid"
          : "border-bone/25 bg-void/40 text-bone hover:border-bone/60",
        className,
      )}
    >
      {busy ? (
        <Loader2 size={15} className="animate-spin" />
      ) : inList ? (
        <BookmarkCheck size={15} />
      ) : (
        <Bookmark size={15} />
      )}
      {inList ? "In your list" : "My list"}
    </button>
  );
}
