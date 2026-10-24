"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServerKind } from "@/features/watch/servers";
import { isInList, onLibraryChange, toggleList } from "@/lib/library-store";

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

  useEffect(() => {
    const sync = () => setInList(isInList(mediaType, imdbId));
    sync();
    return onLibraryChange(sync);
  }, [mediaType, imdbId]);

  const toggle = () => {
    setInList(
      toggleList({
        mediaType,
        imdbId,
        title,
        posterPath: posterPath ?? null,
        backdropPath: backdropPath ?? null,
      }),
    );
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
      {inList ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
      {inList ? "In your list" : "My list"}
    </button>
  );
}
