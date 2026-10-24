"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Grid2X2, List, SlidersHorizontal } from "lucide-react";
import type { CatalogItem } from "@/features/catalog/api";
import MediaCard from "@/features/catalog/components/media-card";
import MediaGrid from "@/features/catalog/components/media-grid";
import { mediaHref } from "@/lib/utils";

function PosterThumb({ src, title }: { src: string | null; title: string }) {
  const [failed, setFailed] = useState(false);
  return <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-panel2 text-[10px] font-bold tracking-wider text-acid sm:size-16">
    {src && !failed ? <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" onError={() => setFailed(true)} /> : <span className="px-1 text-center">KINO</span>}
    <span className="sr-only">{title}</span>
  </div>;
}

export default function CatalogDisplay({ items }: { items: CatalogItem[] }) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [year, setYear] = useState("any");
  const [minRating, setMinRating] = useState("any");
  const years = useMemo(() => Array.from(new Set(items.map((item) => item.releaseInfo.match(/\d{4}/)?.[0]).filter((v): v is string => Boolean(v)))).sort((a, b) => Number(b) - Number(a)), [items]);
  const filtered = useMemo(() => items.filter((item) => {
    const itemYear = item.releaseInfo.match(/\d{4}/)?.[0];
    const rating = Number.parseFloat(item.imdbRating || "0");
    return (year === "any" || itemYear === year) && (minRating === "any" || rating >= Number(minRating));
  }), [items, year, minRating]);
  return <section>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <button type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-2 text-xs text-fog hover:text-bone"><SlidersHorizontal size={14}/> Advanced filters {filtersOpen ? "−" : "+"}</button>
      <div className="flex items-center gap-3"><span className="text-xs text-fog">{filtered.length} titles</span><div role="group" aria-label="Catalog layout" className="inline-flex rounded-full border border-line bg-panel p-1">
        <button type="button" aria-label="Poster grid" aria-pressed={layout === "grid"} onClick={() => setLayout("grid")} className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs transition-colors ${layout === "grid" ? "bg-acid text-void" : "text-fog hover:text-bone"}`}><Grid2X2 size={15}/><span className="hidden sm:inline">Grid</span></button>
        <button type="button" aria-label="List view" aria-pressed={layout === "list"} onClick={() => setLayout("list")} className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs transition-colors ${layout === "list" ? "bg-acid text-void" : "text-fog hover:text-bone"}`}><List size={15}/><span className="hidden sm:inline">List</span></button>
      </div></div>
    </div>
    {filtersOpen && <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-line bg-panel/50 p-4 sm:grid-cols-2"><label className="text-xs text-fog">Release year<select value={year} onChange={(e) => setYear(e.target.value)} className="mt-2 block w-full rounded-lg border border-line bg-void px-3 py-2.5 text-sm text-bone"><option value="any">Any year</option>{years.map((y) => <option key={y} value={y}>{y}</option>)}</select></label><label className="text-xs text-fog">Minimum rating<select value={minRating} onChange={(e) => setMinRating(e.target.value)} className="mt-2 block w-full rounded-lg border border-line bg-void px-3 py-2.5 text-sm text-bone"><option value="any">Any rating</option><option value="6">6.0+</option><option value="7">7.0+</option><option value="8">8.0+</option><option value="9">9.0+</option></select></label><button onClick={() => { setYear("any"); setMinRating("any"); }} className="justify-self-start text-xs text-acid sm:col-span-2">Reset advanced filters</button></div>}
    {filtered.length === 0 ? <p className="rounded-2xl border border-dashed border-line py-20 text-center text-sm text-fog">No titles match these filters. Try loosening your choices.</p> : layout === "grid" ? <MediaGrid>{filtered.map((item) => <MediaCard key={`${item.type}-${item.id}`} item={item}/>)}</MediaGrid> : <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel/40">{filtered.map((item) => <Link key={`${item.type}-${item.id}`} href={mediaHref(item.type, item.id)} className="group flex items-center gap-4 p-3 transition-colors hover:bg-panel sm:gap-5 sm:p-4"><PosterThumb src={item.poster} title={item.name}/><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-bone group-hover:text-acid sm:text-base">{item.name}</p><p className="mt-1 text-xs text-fog">{item.releaseInfo || "Year unavailable"} · {item.type === "tv" ? "Series" : "Movie"}{item.imdbRating ? ` · ★ ${item.imdbRating}` : ""}</p>{item.description && <p className="mt-2 line-clamp-2 max-w-3xl text-xs leading-relaxed text-fog/80 sm:text-sm">{item.description}</p>}</div><span className="shrink-0 text-xs text-acid">Details ↗</span></Link>)}</div>}
  </section>;
}
