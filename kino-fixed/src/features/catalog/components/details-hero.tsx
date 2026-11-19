import Image from "next/image";
import type { ReactNode } from "react";

interface Meta { icon?: ReactNode; label: string; }
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
    <section className="theme-dark relative isolate">
      <div className="absolute inset-x-0 top-0 h-[min(68vh,680px)] min-h-[360px]">
        {backdrop && <Image src={backdrop} alt="" fill priority unoptimized sizes="100vw" className="-z-20 object-cover object-[center_18%]" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/55 to-void/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-void/65 to-transparent" />
      </div>
      <div className="relative mx-auto max-w-[1600px] px-5 pb-10 pt-[38vh] md:px-10 md:pt-[42vh]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
          {poster && <div className="relative hidden aspect-[2/3] w-36 shrink-0 overflow-hidden rounded-md border border-line bg-panel sm:block md:w-48"><Image src={poster} alt={title} fill unoptimized sizes="192px" className="object-cover" /></div>}
          <div className="max-w-3xl flex-1">
            <p className="text-sm font-medium text-bone/75">{kicker}</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-bone sm:text-4xl md:text-6xl">{title}</h1>
            {tagline && <p className="mt-3 text-base text-fog md:text-lg">{tagline}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {meta.map((item, index) => <span key={index} className="inline-flex items-center gap-1.5 rounded-md border border-bone/20 bg-void/50 px-2.5 py-1.5 text-xs text-bone/90">{item.icon}{item.label}</span>)}
              {genres.slice(0, 4).map((genre) => <span key={genre} className="rounded-md border border-line bg-void/50 px-2.5 py-1.5 text-xs text-bone/80">{genre}</span>)}
            </div>
            {overview && <p className="mt-5 max-w-2xl text-sm leading-6 text-bone/75">{overview}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
