"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DiscoverFilters({ base, genres, selected }: { base: string; genres: readonly string[]; selected?: string }) {
  const [open, setOpen] = useState(false);
  const choices = <>
    <Link href={base} onClick={() => setOpen(false)} className={cn("rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em]", !selected ? "border-acid bg-acid text-void" : "border-line text-fog hover:border-bone/40 hover:text-bone")}>All</Link>
    {genres.map((genre) => <Link key={genre} href={`${base}?genre=${encodeURIComponent(genre)}`} onClick={() => setOpen(false)} className={cn("rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em]", selected === genre ? "border-acid bg-acid text-void" : "border-line text-fog hover:border-bone/40 hover:text-bone")}>{genre}</Link>)}
  </>;
  return <div className="mt-10">
    <div className="flex items-center justify-between md:hidden">
      <p className="text-xs text-fog">{selected ? `Genre: ${selected}` : "Browse all genres"}</p>
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2.5 text-xs font-semibold text-bone"><SlidersHorizontal size={14} /> Filters <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} /></button>
    </div>
    <div className={cn("no-scrollbar mt-3 flex-wrap gap-2 overflow-x-auto pb-2 md:flex", !open && "hidden md:flex")} style={open ? { display: "flex" } : undefined}>
      {choices}
    </div>
  </div>;
}
