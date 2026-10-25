"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { yearOfItem, type CatalogItem } from "@/features/catalog/api";
import { cn, kindLabel, mediaHref } from "@/lib/utils";

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const focus = setTimeout(() => inputRef.current?.focus(), 60);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(focus);
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (timer.current) clearTimeout(timer.current);
    if (!q) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.results ?? []);
        setActive(0);
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setSearched(true);
        }
      }
    }, 260);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      controller.abort();
    };
  }, [query]);

  const open = (item: CatalogItem) => {
    onClose();
    router.push(mediaHref(item.type, item.id));
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
      if (event.key === "Enter" && results[active]) {
        event.preventDefault();
        open(results[active]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const trimmed = query.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[130]"
    >
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-md"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search KINO"
        initial={{ opacity: 0, y: -14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-2 top-2 mx-auto flex max-h-[calc(100dvh-1rem)] w-auto max-w-[660px] flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_90px_rgba(0,0,0,0.5)] md:top-24 md:max-h-[min(72vh,640px)]"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-3">
          <Search size={20} className="shrink-0 text-fog" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search movies and series..."
            aria-label="Search movies and series"
            className="h-9 w-full bg-transparent text-base text-bone outline-none placeholder:text-fog/60"
          />
          {loading && <Loader2 size={16} className="shrink-0 animate-spin text-fog" />}
          {!loading && trimmed && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="flex size-7 shrink-0 items-center justify-center rounded-full text-fog transition-colors hover:bg-panel2 hover:text-bone"
            >
              <X size={16} />
            </button>
          )}
          {!loading && !trimmed && (
            <kbd className="hidden shrink-0 rounded-md border border-line px-1.5 py-0.5 text-[10px] font-semibold text-fog md:block">
              Esc
            </kbd>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
          {!trimmed && (
            <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
              <Search size={26} className="text-acid/70" />
              <p className="text-sm font-medium text-bone">Search the catalog</p>
              <p className="max-w-xs text-xs leading-relaxed text-fog">
                Start typing to find movies and series. Press Esc to close.
              </p>
            </div>
          )}

          {trimmed && loading && results.length === 0 && (
            <div className="space-y-2 p-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-center gap-3 px-2 py-2.5">
                  <div className="h-[58px] w-10 rounded-md bg-panel2" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-2/3 rounded bg-panel2" />
                    <div className="h-2.5 w-1/3 rounded bg-panel2/70" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {trimmed && !loading && searched && results.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
              <p className="text-sm font-medium text-bone">No matches for “{trimmed}”</p>
              <p className="max-w-xs text-xs leading-relaxed text-fog">
                Try another title or check the spelling.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div role="listbox" aria-label="Search results">
              {results.map((item, index) => (
                <button
                  key={`${item.type}-${item.id}`}
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => open(item)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors",
                    index === active ? "bg-panel2" : "hover:bg-panel2/70",
                  )}
                >
                  <span className="relative h-[58px] w-10 shrink-0 overflow-hidden rounded-md bg-panel2">
                    {item.poster && (
                      <Image
                        src={item.poster}
                        alt=""
                        fill
                        unoptimized
                        sizes="40px"
                        className="object-cover"
                      />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-bone">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] font-semibold tracking-[0.16em] text-fog uppercase">
                      {yearOfItem(item.releaseInfo) || "——"} · {kindLabel(item.type)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line px-4 py-2.5">
          <span className="hidden text-[10px] font-semibold tracking-[0.16em] text-fog uppercase sm:block">
            ↑↓ to move · Enter to open
          </span>
          {trimmed ? (
            <Link
              href={`/search?q=${encodeURIComponent(trimmed)}`}
              onClick={onClose}
              className="ml-auto flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-acid uppercase transition-colors hover:text-bone"
            >
              View all results
              <ArrowUpRight size={13} />
            </Link>
          ) : (
            <Link
              href="/search"
              onClick={onClose}
              className="ml-auto flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-fog uppercase transition-colors hover:text-bone"
            >
              Open search page
              <ArrowUpRight size={13} />
            </Link>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
