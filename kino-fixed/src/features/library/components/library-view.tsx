"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Bookmark, Compass, History } from "lucide-react";
import type { ServerKind } from "@/features/watch/servers";
import { watchHref } from "@/lib/utils";
import MediaCard from "@/features/catalog/components/media-card";
import MediaGrid from "@/features/catalog/components/media-grid";
import Rail, { RailItem } from "@/components/ui/rail";
import { clearHistory as clearStoredHistory, clearList as clearStoredList, getHistory, getList, onLibraryChange, removeFromList, removeHistory, type LibraryEntry, type ListEntry } from "@/lib/library-store";

export default function LibraryView() {
  const [history, setHistory] = useState<LibraryEntry[] | null>(null);
  const [list, setList] = useState<ListEntry[] | null>(null);
  const load = useCallback(() => { setHistory(getHistory()); setList(getList()); }, []);
  useEffect(() => { load(); return onLibraryChange(load); }, [load]);
  const loading = history === null || list === null;
  const empty = !loading && (history?.length ?? 0) === 0 && (list?.length ?? 0) === 0;

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <header className="mb-8"><p className="text-sm text-fog">Your titles, saved on this device</p><h1 className="mt-2 text-3xl font-semibold text-bone sm:text-4xl">Your library</h1></header>
      {!loading && (history?.length || list?.length) ? <div className="mb-6 flex flex-wrap gap-2">{history && history.length > 0 && <button type="button" onClick={() => setHistory(clearStoredHistory())} className="min-h-10 rounded-md border border-line px-3 text-sm text-fog hover:text-bone">Clear history</button>}{list && list.length > 0 && <button type="button" onClick={() => setList(clearStoredList())} className="min-h-10 rounded-md border border-line px-3 text-sm text-fog hover:text-bone">Clear saved titles</button>}</div> : null}
      {loading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">{Array.from({ length: 10 }).map((_, index) => <div key={index} className="aspect-[2/3] animate-pulse rounded-md bg-panel" />)}</div> : empty ? <div className="flex flex-col items-center gap-4 rounded-lg border border-line py-16 text-center"><Compass size={28} className="text-fog" /><p className="max-w-md text-sm leading-6 text-fog">Your library is empty. Save a title or start watching, and it will appear here.</p><Link href="/movies" className="inline-flex min-h-10 items-center rounded-md bg-acid px-4 text-sm font-semibold text-void">Browse movies</Link></div> : <div className="space-y-10">{history && history.length > 0 && <Rail title="Continue watching">{history.map((entry) => <RailItem key={`${entry.mediaType}-${entry.imdbId}`}><MediaCard item={{ id: entry.imdbId, name: entry.title, poster: entry.posterPath }} type={entry.mediaType as ServerKind} href={watchHref(entry.mediaType as ServerKind, entry.imdbId, entry.season ?? 1, entry.episode ?? 1)} subtitle={entry.mediaType === "tv" ? `Resume S${entry.season ?? 1} · E${entry.episode ?? 1}` : entry.mediaType === "anime" ? `Resume episode ${entry.episode ?? 1}` : "Resume movie"} onRemove={() => setHistory(removeHistory(entry.mediaType, entry.imdbId))} /></RailItem>)}</Rail>}{list && list.length > 0 && <section><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-xl font-semibold text-bone"><Bookmark size={18} className="text-acid" />Saved titles</h2><span className="flex items-center gap-2 text-sm text-fog"><History size={15} />{list.length} saved</span></div><MediaGrid>{list.map((entry) => <MediaCard key={`${entry.mediaType}-${entry.imdbId}`} item={{ id: entry.imdbId, name: entry.title, poster: entry.posterPath }} type={entry.mediaType as ServerKind} onRemove={() => setList(removeFromList(entry.mediaType, entry.imdbId))} />)}</MediaGrid></section>}</div>}
    </div>
  );
}
