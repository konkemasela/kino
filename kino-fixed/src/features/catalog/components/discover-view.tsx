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

export default async function DiscoverView({ type, searchParams }: DiscoverViewProps) {
  const params = await searchParams;
  const rawGenre = Array.isArray(params.genre) ? params.genre[0] : params.genre;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const genre = rawGenre && GENRES.includes(rawGenre as (typeof GENRES)[number]) ? rawGenre : undefined;
  const page = rawPage && /^\d+$/.test(rawPage) ? Math.max(1, Number(rawPage)) : 1;
  const items = await getCatalog(type, { genre, skip: (page - 1) * PAGE_SIZE });
  const base = type === "movie" ? "/movies" : "/series";
  const withGenre = (selected?: string, currentPage = 1) =>
    selected ? `${base}?genre=${encodeURIComponent(selected)}&page=${currentPage}` : `${base}?page=${currentPage}`;
  const hasMore = items.length >= PAGE_SIZE;
  const heading = type === "movie" ? "Movies" : "Series";

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-32 md:px-10 md:pt-40">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-fog">Browse the catalog</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-bone sm:text-4xl md:text-5xl">{heading}</h1>
        <p className="mt-3 text-sm leading-6 text-fog">Explore titles and narrow the list by genre.</p>
      </header>

      <nav aria-label="Filter by genre" className="no-scrollbar -mx-5 mt-7 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        <Link href={base} className={cn("shrink-0 rounded-md border px-3 py-2 text-sm transition-colors", !genre ? "border-acid bg-acid text-void" : "border-line text-fog hover:text-bone")}>All</Link>
        {GENRES.map((item) => (
          <Link key={item} href={withGenre(item)} className={cn("shrink-0 rounded-md border px-3 py-2 text-sm transition-colors", genre === item ? "border-acid bg-acid text-void" : "border-line text-fog hover:text-bone")}>{item}</Link>
        ))}
      </nav>

      <div className="mt-8">
        {items.length > 0 ? (
          <MediaGrid>{items.map((item) => <MediaCard key={item.id} item={item} />)}</MediaGrid>
        ) : (
          <p className="rounded-lg border border-line py-16 text-center text-sm text-fog">No titles found in this section.</p>
        )}
      </div>

      <nav aria-label="Catalog pages" className="mt-10 flex items-center justify-center gap-3">
        {page > 1 ? <Link href={withGenre(genre, page - 1)} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-line px-4 text-sm text-bone hover:border-fog"><ChevronLeft size={16} />Previous</Link> : <span className="inline-flex min-h-10 items-center gap-2 rounded-md border border-line/60 px-4 text-sm text-fog/50"><ChevronLeft size={16} />Previous</span>}
        <span className="px-2 text-sm text-fog">Page {page}</span>
        {hasMore ? <Link href={withGenre(genre, page + 1)} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-line px-4 text-sm text-bone hover:border-fog">Next<ChevronRight size={16} /></Link> : <span className="inline-flex min-h-10 items-center gap-2 rounded-md border border-line/60 px-4 text-sm text-fog/50">Next<ChevronRight size={16} /></span>}
      </nav>
    </div>
  );
}
