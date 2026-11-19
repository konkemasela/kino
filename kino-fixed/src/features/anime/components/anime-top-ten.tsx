import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play, Star } from "lucide-react";
import type { AnimeItem } from "@/features/anime/api";
import { mediaHref, watchHref } from "@/lib/utils";

function AudioBadges() {
  return <span className="inline-flex gap-1">{["SUB", "DUB"].map((badge) => <span key={badge} className="rounded border border-white/15 px-1.5 py-0.5 text-[9px] text-white/80">{badge}</span>)}</span>;
}

export default function AnimeTopTen({ items }: { items: AnimeItem[] }) {
  const top = items.slice(0, 10);
  if (top.length === 0) return null;
  const featured = top[0];
  const art = featured.backdrop ?? featured.poster;
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-sm text-fog">Popular on AniList</p><h2 className="mt-1 text-xl font-semibold text-bone sm:text-2xl">Top anime</h2></div><span className="text-xs text-fog">Updated regularly</span></div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <article className="theme-dark relative isolate flex min-h-[380px] flex-col justify-end overflow-hidden rounded-lg border border-line bg-panel sm:min-h-[440px]">
          {art && <Image src={art} alt="" fill unoptimized sizes="(max-width: 1024px) 100vw, 55vw" className="-z-20 object-cover object-center" />}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/65 to-void/20" />
          <div className="relative p-4 sm:p-6"><p className="text-sm text-bone/75">{featured.type || "Anime"}{featured.status ? ` · ${featured.status}` : ""}</p><h3 className="mt-2 break-words text-2xl font-semibold text-bone sm:text-3xl">{featured.name}</h3><div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-bone/80"><span className="inline-flex items-center gap-1.5"><Star size={14} className="fill-acid text-acid" />{featured.score ?? "Not rated"}</span>{featured.year && <span>{featured.year}</span>}{featured.episodes && <span>{featured.episodes} episodes</span>}<AudioBadges /></div>{featured.synopsis && <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-6 text-bone/75">{featured.synopsis}</p>}<div className="mt-5 flex flex-wrap gap-2"><Link href={watchHref("anime", featured.id)} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-acid px-4 text-sm font-semibold text-void"><Play size={15} className="fill-current" />Watch</Link><Link href={mediaHref("anime", featured.id)} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/35 px-4 text-sm text-white">Details<ArrowUpRight size={14} /></Link></div></div>
        </article>
        <ol className="divide-y divide-line rounded-lg border border-line bg-panel px-3 sm:px-4">{top.slice(1).map((item, index) => <li key={item.id}><Link href={mediaHref("anime", item.id)} className="flex min-w-0 items-center gap-3 py-3"><span className="w-6 shrink-0 text-sm tabular-nums text-fog">{index + 2}</span><span className="relative size-12 shrink-0 overflow-hidden rounded bg-panel2">{item.poster && <Image src={item.poster} alt="" fill unoptimized sizes="48px" className="object-cover" />}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-bone">{item.name}</span><span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-fog">{item.score && <span className="inline-flex items-center gap-1"><Star size={11} className="fill-acid text-acid" />{item.score}</span>}{item.year && <span>{item.year}</span>}{item.episodes && <span>{item.episodes} episodes</span>}</span></span><ArrowUpRight size={15} className="shrink-0 text-fog" /></Link></li>)}</ol>
      </div>
    </section>
  );
}
