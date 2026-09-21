"use client";

import { useEffect, useRef, useState } from "react";
import { Search, SearchX, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { AnimeItem } from "@/features/anime/api";
import MediaCard from "@/features/catalog/components/media-card";
import MediaGrid from "@/features/catalog/components/media-grid";

export default function AnimeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        const res = await fetch(`/api/anime?q=${encodeURIComponent(q)}`);
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

  const showResults = query.trim().length > 0;

  return (
    <div>
      <div className="flex items-center gap-4 border-b-2 border-line pb-4 transition-colors focus-within:border-acid">
        <Search size={22} className="shrink-0 text-fog" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Frieren, One Piece, Ghibli..."
          className="w-full bg-transparent font-display text-2xl tracking-[0.04em] text-bone uppercase outline-none placeholder:text-fog/40 md:text-3xl"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-fog transition-colors hover:bg-panel hover:text-bone"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-10"
          >
            <p className="mb-6 text-[11px] font-bold tracking-[0.28em] text-fog uppercase">
              {loading
                ? "Searching the index…"
                : `${results.length} result${results.length === 1 ? "" : "s"} for “${query.trim()}”`}
            </p>
            {loading ? (
              <MediaGrid>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[2/3] rounded-xl bg-panel" />
                    <div className="mt-3 h-3 w-3/4 rounded bg-panel" />
                  </div>
                ))}
              </MediaGrid>
            ) : results.length === 0 && searched ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <SearchX size={36} className="text-acid/70" />
                <p className="max-w-sm text-sm text-fog">
                  No anime matched “{query.trim()}”. Try the English or Japanese
                  title.
                </p>
              </div>
            ) : (
              <MediaGrid>
                {results.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={{
                      id: item.id,
                      name: item.name,
                      poster: item.poster,
                      imdbRating: item.score,
                      releaseInfo: item.year,
                    }}
                    type="anime"
                  />
                ))}
              </MediaGrid>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
