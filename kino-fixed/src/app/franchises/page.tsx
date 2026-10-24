import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { FRANCHISES } from "@/features/catalog/franchises";

export const metadata: Metadata = { title: "Franchises", description: "Explore movie and series franchises in Kinooz." };

export default function FranchisesPage() {
  return <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 md:px-10 md:pt-40"><p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em] text-acid"><span className="h-px w-10 bg-acid"/>Explore connected stories</p><h1 className="mt-4 font-display text-6xl uppercase md:text-8xl">Movie <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">franchises</span></h1><p className="mt-5 max-w-2xl text-sm leading-relaxed text-fog">Browse well-known universes and find related entries together. Results depend on the titles available from the metadata catalog.</p><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{FRANCHISES.map((franchise) => <Link key={franchise.slug} href={`/franchise/${franchise.slug}`} className="group rounded-2xl border border-line bg-panel/40 p-5 transition-colors hover:border-acid/60"><Layers3 size={20} className="text-acid"/><h2 className="mt-5 font-display text-2xl uppercase">{franchise.name}</h2><p className="mt-2 text-sm leading-relaxed text-fog">{franchise.description}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-acid">Explore titles <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1"/></span></Link>)}</div></div>;
}
