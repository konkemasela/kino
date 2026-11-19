import Image from "next/image";
import type { ReactNode } from "react";

interface Meta { icon?: ReactNode; label: string }
interface DetailsHeroProps {
  backdrop: string | null;
  poster: string | null;
  kicker: string;
  title: string;
  tagline?: string | null;
  overview: string;
  genres: string[];
  meta: Meta[];
  actions: ReactNode;
}

export default function DetailsHero({ backdrop, poster, kicker, title, tagline, overview, genres, meta, actions }: DetailsHeroProps) {
  return (
    <section className="theme-dark relative isolate overflow-hidden border-b border-line bg-void">
      <div className="absolute inset-x-0 top-0 h-[min(68vh,620px)] min-h-[320px]">
        {backdrop && <Image src={backdrop} alt="" fill priority unoptimized sizes="100vw" className="-z-20 object-cover object-center" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/65 to-void/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-void/70 to-transparent" />
      </div>
      <div className="relative mx-auto max-w-[1440px] px-4 pb-8 pt-32 sm:px-6 sm:pb-10 sm:pt-[35vh] lg:px-10 lg:pt-[40vh]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-7">
          {poster && <div className="relative mx-auto aspect-[2/3] w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-panel sm:mx-0 sm:w-36 md:w-44"><Image src={poster} alt={title} fill unoptimized sizes="(max-width: 640px) 112px, 176px" className="object-cover" /></div>}
          <div className="min-w-0 max-w-3xl flex-1">
            <p className="text-sm font-medium text-bone/75">{kicker}</p>
            <h1 className="mt-2 break-words text-3xl font-semibold leading-tight tracking-tight text-bone sm:text-4xl md:text-5xl lg:text-6xl">{title}</h1>
            {tagline && <p className="mt-2 max-w-2xl text-sm leading-6 text-fog sm:text-base">{tagline}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {meta.map((item, index) => <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5 rounded-md border border-line bg-void/70 px-2.5 py-1.5 text-xs text-bone/90">{item.icon}{item.label}</span>)}
              {genres.slice(0, 4).map((genre) => <span key={genre} className="rounded-md border border-line bg-void/70 px-2.5 py-1.5 text-xs text-bone/80">{genre}</span>)}
            </div>
            {overview && <p className="mt-4 max-w-2xl text-sm leading-6 text-bone/75">{overview}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-2">{actions}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
