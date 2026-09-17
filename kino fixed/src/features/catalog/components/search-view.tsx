"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clapperboard, Search, SearchX } from "lucide-react";
import type { CatalogItem } from "@/features/catalog/api";
import MediaCard from "@/features/catalog/components/media-card";
import MediaGrid from "@/features/catalog/components/media-grid";
import { cn } from "@/lib/utils";

type Filter = "all" | "movie" | "tv";

export default function SearchView() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [results, setResults] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 320);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  const filtered = results.filter((r) =>
    filter === "all" ? true : r.type === filter,
  );

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-32 md:px-10 md:pb-10 md:pt-40">
      <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
        <span className="h-px w-10 bg-acid" />
        The entire catalog
      </p>
      <h1 className="mt-4 font-display text-6xl tracking-[0.03em] uppercase md:text-8xl">
        Search{" "}
        <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">
          anything
        </span>
      </h1>

      <div className="mt-10 flex items-center gap-4 border-b-2 border-line pb-4 transition-colors focus-within:border-acid">
        <Search size={26} className="shrink-0 text-fog" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Dune, Severance, Nolan..."
          className="w-full bg-transparent font-display text-3xl tracking-[0.04em] text-bone uppercase outline-none placeholder:text-fog/40 md:text-5xl"
        />
      </div>

      <div className="mt-6 flex items-center gap-2">
        {(
          [
            ["all", "Everything"],
            ["movie", "Movies"],
            ["tv", "Series"],
          ] as [Filter, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-[0.16em] uppercase transition-all",
              filter === value
                ? "border-acid bg-acid text-void"
                : "border-line text-fog hover:border-bone/40 hover:text-bone",
            )}
          >
            {label}
          </button>
        ))}
        {query && (
          <span className="ml-auto text-xs text-fog">
            {loading ? "Searching…" : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
          </span>
        )}
      </div>

      <div className="mt-12">
        {loading ? (
          <MediaGrid>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] rounded-xl bg-panel" />
                <div className="mt-3 h-3 w-3/4 rounded bg-panel" />
                <div className="mt-2 h-2 w-1/2 rounded bg-panel" />
              </div>
            ))}
          </MediaGrid>
        ) : !query.trim() ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <Clapperboard size={40} className="text-acid/70" />
            <p className="max-w-sm text-sm text-fog">
              Type above to search thousands of movies and series. Results
              update as you type.
            </p>
          </div>
        ) : searched && filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <SearchX size={40} className="text-acid/70" />
            <p className="max-w-sm text-sm text-fog">
              Nothing found for “{query}”. Try a different title or check the
              spelling.
            </p>
          </div>
        ) : (
          <MediaGrid>
            {filtered.map((item) => (
              <MediaCard key={`${item.type}-${item.id}`} item={item} type={item.type} />
            ))}
          </MediaGrid>
        )}
      </div>
    </div>
  );
}
