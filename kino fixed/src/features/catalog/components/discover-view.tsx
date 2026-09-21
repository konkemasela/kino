import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GENRES, getCatalog, type MediaType } from "@/features/catalog/api";
import { cn } from "@/lib/utils";
import MediaCard from "@/features/catalog/components/media-card";
import MediaGrid from "@/features/catalog/components/media-grid";

const PAGE_SIZE = 50;

interface DiscoverViewProps {
  type: MediaType;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DiscoverView({
  type,
  searchParams,
}: DiscoverViewProps) {
  const sp = await searchParams;
  const rawGenre = Array.isArray(sp.genre) ? sp.genre[0] : sp.genre;
  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const genre = rawGenre && GENRES.includes(rawGenre as (typeof GENRES)[number]) ? rawGenre : undefined;
  const page = rawPage && /^\d+$/.test(rawPage) ? Math.max(1, Number(rawPage)) : 1;

  const items = await getCatalog(type, {
    genre,
    skip: (page - 1) * PAGE_SIZE,
  });

  const base = type === "movie" ? "/movies" : "/series";
  const withGenre = (g?: string, p = 1) =>
    g ? `${base}?genre=${encodeURIComponent(g)}&page=${p}` : `${base}?page=${p}`;
  const hasMore = items.length >= PAGE_SIZE;

  const heading = type === "movie" ? "All Movies" : "All Series";
  const accent = type === "movie" ? "feature length" : "binge ready";

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-32 md:px-10 md:pb-10 md:pt-40">
      <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
        <span className="h-px w-10 bg-acid" />
        Catalog — {type === "movie" ? "film" : "television"}
      </p>
      <h1 className="mt-4 font-display text-6xl tracking-[0.03em] uppercase md:text-8xl">
        {heading}{" "}
        <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">
          {accent}
        </span>
      </h1>

      <div className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2 md:-mx-10 md:px-10">
        <Link
          href={base}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-all",
            !genre
              ? "border-acid bg-acid text-void"
              : "border-line text-fog hover:border-bone/40 hover:text-bone",
          )}
        >
          All
        </Link>
        {GENRES.map((g) => (
          <Link
            key={g}
            href={withGenre(g)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-all",
              genre === g
                ? "border-acid bg-acid text-void"
                : "border-line text-fog hover:border-bone/40 hover:text-bone",
            )}
          >
            {g}
          </Link>
        ))}
      </div>

      <div className="mt-10">
        {items.length > 0 ? (
          <MediaGrid>
            {items.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </MediaGrid>
        ) : (
          <p className="rounded-2xl border border-dashed border-line py-20 text-center text-sm text-fog">
            Nothing found in this section.
          </p>
        )}
      </div>

      <div className="mt-14 flex items-center justify-center gap-6">
        {page > 1 ? (
          <Link
            href={withGenre(genre, page - 1)}
            className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[11px] font-bold tracking-[0.2em] text-bone uppercase transition-all hover:border-acid hover:text-acid"
          >
            <ChevronLeft size={14} />
            Prev
          </Link>
        ) : (
          <span className="flex cursor-not-allowed items-center gap-2 rounded-full border border-line/50 px-5 py-2.5 text-[11px] font-bold tracking-[0.2em] text-fog/40 uppercase">
            <ChevronLeft size={14} />
            Prev
          </span>
        )}
        <span className="font-display text-lg tracking-[0.2em] text-fog uppercase">
          Page {String(page).padStart(2, "0")}
        </span>
        {hasMore ? (
          <Link
            href={withGenre(genre, page + 1)}
            className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[11px] font-bold tracking-[0.2em] text-bone uppercase transition-all hover:border-acid hover:text-acid"
          >
            Next
            <ChevronRight size={14} />
          </Link>
        ) : (
          <span className="flex cursor-not-allowed items-center gap-2 rounded-full border border-line/50 px-5 py-2.5 text-[11px] font-bold tracking-[0.2em] text-fog/40 uppercase">
            Next
            <ChevronRight size={14} />
          </span>
        )}
      </div>
    </div>
  );
}
