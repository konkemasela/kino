import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, CircleDot, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog",
  description: "See what is new and improving in Kinooz.",
};

const entries = [
  { version: "Latest update", date: "October 2026", status: "Improved", icon: CheckCircle2, color: "text-acid", items: ["Removed the scrolling marquee from the homepage for a cleaner first impression.", "Added polished skeleton placeholders while pages and catalogs load.", "Added poster fallbacks for missing or failed images.", "Added a grid/list switch on movie and series catalog pages.", "Improved reduced-motion support for people who prefer less animation.", "Made genre filters easier to use on mobile.", "Added a release calendar based on available catalog metadata.", "Added this changelog page to make updates easier to follow."] },
  { version: "Ongoing", date: "In development", status: "In progress", icon: Wrench, color: "text-fog", items: ["Catalog reliability and metadata quality improvements.", "Further polish for mobile browsing and accessibility.", "More useful discovery and personalization features."] },
];

export default function ChangelogPage() {
  return <div className="mx-auto min-h-[65vh] max-w-[1100px] px-5 pb-24 pt-32 md:px-10 md:pt-40">
    <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em] text-acid"><span className="h-px w-10 bg-acid" />Built in the open</p>
    <h1 className="mt-4 font-display text-6xl uppercase tracking-[0.03em] md:text-8xl">What’s <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">new</span></h1>
    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-fog md:text-base">A simple record of what’s changed in Kinooz, what’s being improved, and what’s still in progress.</p>
    <div className="mt-12 space-y-6">{entries.map((entry) => { const Icon = entry.icon; return <article key={entry.version} className="rounded-2xl border border-line bg-panel/40 p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-fog">{entry.date}</p><h2 className="mt-2 font-display text-3xl uppercase tracking-wider">{entry.version}</h2></div><span className={`inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${entry.color}`}><Icon size={13} />{entry.status}</span></div>
      <ul className="mt-6 space-y-4">{entry.items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-fog"><CircleDot size={15} className="mt-0.5 shrink-0 text-acid/70" />{item}</li>)}</ul>
    </article>; })}</div>
    <div className="mt-10 flex flex-wrap gap-3"><Link href="/" className="inline-flex items-center gap-2 rounded-full bg-acid px-5 py-3 text-xs font-bold uppercase tracking-wider text-void">Back to Kinooz <ArrowUpRight size={14} /></Link><Link href="/releases" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-xs font-bold uppercase tracking-wider text-bone transition-colors hover:border-acid hover:text-acid">Release calendar <ArrowUpRight size={14} /></Link></div>
  </div>;
}
