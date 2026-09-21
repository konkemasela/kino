import Image from "next/image";
import type { ReactNode } from "react";

interface Meta {
  icon?: ReactNode;
  label: string;
}

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

export default function DetailsHero({
  backdrop,
  poster,
  kicker,
  title,
  tagline,
  overview,
  genres,
  meta,
  actions,
}: DetailsHeroProps) {
  return (
    <section className="relative">
      <div className="absolute inset-x-0 top-0 h-[68vh] min-h-[480px] md:h-[82vh]">
        {backdrop && (
          <Image
            src={backdrop}
            alt={title}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[center_18%]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/35 to-void/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 pb-10 pt-[46vh] md:px-10 md:pt-[50vh]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:gap-12">
          {poster && (
            <div className="hidden w-[210px] shrink-0 -rotate-2 md:block lg:w-[240px]">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl ring-1 ring-line shadow-[0_30px_80px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:rotate-0">
                <Image
                  src={poster}
                  alt={title}
                  fill
                  unoptimized
                  sizes="240px"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="max-w-3xl flex-1">
            <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
              <span className="h-px w-10 bg-acid" />
              {kicker}
            </p>

            <h1 className="mt-4 font-display text-[clamp(2.8rem,6.5vw,6.5rem)] leading-[0.9] tracking-[0.02em] text-bone uppercase">
              {title}
            </h1>

            {tagline && (
              <p className="mt-3 font-editorial text-xl italic text-acid/90 md:text-2xl">
                “{tagline}”
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              {meta.map((m, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 rounded-full border border-bone/20 bg-void/40 px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] text-bone/90 uppercase backdrop-blur-md"
                >
                  {m.icon}
                  {m.label}
                </span>
              ))}
              {genres.slice(0, 4).map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-acid/25 bg-acid/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] text-acid uppercase"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-bone/75 md:text-[15px]">
              {overview}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">{actions}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
