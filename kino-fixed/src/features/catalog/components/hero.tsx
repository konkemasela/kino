import Image from "next/image";
import Link from "next/link";
import { Info, Play, Star } from "lucide-react";
import { mediaHref, watchHref } from "@/lib/utils";
import { ratingOf, type MediaType } from "@/features/catalog/api";

export interface HeroItem { id: string; mediaType: MediaType; title: string; overview: string; backdrop: string; year: string; rating: string | null; }

export default function Hero({ items }: { items: HeroItem[] }) {
  const item = items[0];
  if (!item) return null;
  return (
    <section className="theme-dark relative isolate flex min-h-[430px] items-end overflow-hidden bg-panel sm:min-h-[500px] lg:min-h-[560px]">
      <Image src={item.backdrop} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/65 to-void/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-void/70 to-transparent" />
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-28 sm:px-6 sm:pb-14 lg:px-10 lg:pb-16">
        <div className="max-w-2xl"><p className="mb-2 text-sm text-bone/75">Featured {item.mediaType === "movie" ? "movie" : "series"}</p><h1 className="break-words text-3xl font-semibold leading-tight text-bone sm:text-4xl lg:text-5xl">{item.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-bone/80"><span className="inline-flex items-center gap-1.5"><Star size={14} className="fill-acid text-acid" aria-hidden="true" />{ratingOf(item.rating)}</span>{item.year && <span>{item.year}</span>}<span>{item.mediaType === "movie" ? "Movie" : "Series"}</span></div>
          {item.overview && <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-6 text-bone/75">{item.overview}</p>}
          <div className="mt-5 flex flex-wrap gap-2"><Link href={watchHref(item.mediaType, item.id, 1, 1)} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-acid px-4 text-sm font-semibold text-void"><Play size={15} className="fill-current" />Watch</Link><Link href={mediaHref(item.mediaType, item.id)} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/35 px-4 text-sm text-white"><Info size={15} />Details</Link></div>
        </div>
      </div>
    </section>
  );
}
