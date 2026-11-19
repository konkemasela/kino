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
  const [query, setQuery] = useState(() => {
    if (typeof window === "undefined") return initial;
    return window.localStorage.getItem("kino:last-search") || initial;
  });
  const [filter, setFilter] = useState<Filter>("all");
  const [results, setResults] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { window.localStorage.setItem("kino:last-search", query); }, [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (event.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const value = query.trim();
    if (!value) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    timer.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`, { signal: controller.signal });
        const data = await response.json();
        setResults(data.results ?? []);
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setSearched(true);
        }
      }
    }, 320);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      controller.abort();
    };
  }, [query]);

  const filtered = results.filter((result) => filter === "all" || result.type === filter);

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-32 md:px-10 md:pt-40">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-fog">Find something to watch</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-bone sm:text-4xl md:text-5xl">Search</h1>
      </header>

      <label className="mt-7 flex max-w-3xl items-center gap-3 rounded-lg border border-line bg-panel px-4 py-3 focus-within:border-acid">
        <Search size={19} className="shrink-0 text-fog" aria-hidden="true" />
        <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search movies and series" aria-label="Search movies and series" className="min-w-0 flex-1 bg-transparent text-base text-bone outline-none placeholder:text-fog" />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {([ ["all", "All"], ["movie", "Movies"], ["tv", "Series"] ] as [Filter, string][]).map(([value, label]) => (
          <button key={value} type="button" onClick={() => setFilter(value)} className={cn("min-h-9 rounded-md border px-3 text-sm transition-colors", filter === value ? "border-acid bg-acid text-void" : "border-line text-fog hover:text-bone")}>{label}</button>
        ))}
        {query && <span className="ml-auto text-sm text-fog">{loading ? "Searching…" : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}</span>}
      </div>

      <div className="mt-8">
        {loading ? (
          <MediaGrid>{Array.from({ length: 12 }).map((_, index) => <div key={index} className="animate-pulse"><div className="aspect-[2/3] rounded-md bg-panel" /><div className="mt-3 h-3 w-3/4 rounded bg-panel" /></div>)}</MediaGrid>
        ) : !query.trim() ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center"><Clapperboard size={28} className="text-fog" /><p className="text-sm text-fog">Type a title to search the catalog.</p></div>
        ) : searched && filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center"><SearchX size={28} className="text-fog" /><p className="text-sm text-fog">No titles found for “{query}”. Try another search.</p></div>
        ) : (
          <MediaGrid>{filtered.map((item) => <MediaCard key={`${item.type}-${item.id}`} item={item} type={item.type} />)}</MediaGrid>
        )}
      </div>
    </div>
  );
}
