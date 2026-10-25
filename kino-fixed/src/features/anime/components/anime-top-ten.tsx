import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play, Star } from "lucide-react";
import type { AnimeItem } from "@/features/anime/api";
import { cn, mediaHref, watchHref } from "@/lib/utils";

const AUDIO_BADGES = ["SUB", "DUB"];

function AudioBadges({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-1", className)}>
      {AUDIO_BADGES.map((badge) => (
        <span
          key={badge}
          className="rounded-full border border-bone/15 bg-void/60 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.14em] text-bone/80 uppercase backdrop-blur-md"
        >
          {badge}
        </span>
      ))}
    </span>
  );
}

export default function AnimeTopTen({ items }: { items: AnimeItem[] }) {
  const top = items.slice(0, 10);
  if (top.length === 0) return null;

  const lead = top[0];
  const rest = top.slice(1);
  const leadArt = lead.backdrop ?? lead.poster;

  return (
    <section>
      <div className="mb-8 flex items-end justify-between gap-6">
        <h2 className="flex items-baseline gap-3 font-display text-3xl tracking-[0.08em] uppercase md:text-4xl">
          <span className="text-bone">Top 10</span>
          <span className="font-editorial text-xl italic normal-case text-acid md:text-2xl">
            highest rated
          </span>
        </h2>
        <span className="hidden text-[11px] font-bold tracking-[0.2em] text-fog uppercase md:block">
          All time
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <div className="theme-dark group relative flex min-h-[460px] flex-col justify-end overflow-hidden rounded-2xl border border-line bg-panel sm:min-h-[520px] lg:min-h-[600px]">
          {leadArt && (
            <Image
              src={leadArt}
              alt={lead.name}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover object-[center_25%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-transparent to-transparent" />

          <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-acid/30 bg-void/60 px-3 py-1 text-[10px] font-bold tracking-[0.22em] text-acid uppercase backdrop-blur-md">
            No. 01
          </span>

          <Link
            href={mediaHref("anime", lead.id)}
            aria-label={`View ${lead.name}`}
            className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acid"
          />

          <div className="pointer-events-none relative z-10 p-5 md:p-7">
            <p className="text-[10px] font-bold tracking-[0.3em] text-acid uppercase">
              {lead.type || "Anime"} · {lead.status || "Airing"}
            </p>

            <h3 className="mt-3 font-display text-4xl leading-[0.95] tracking-[0.02em] text-bone uppercase md:text-5xl">
              {lead.name}
            </h3>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-bold tracking-[0.16em] text-bone/80 uppercase">
              <span className="flex items-center gap-1.5 text-acid">
                <Star size={12} className="fill-acid" />
                {lead.score ?? "NR"}
              </span>
              <span className="size-1 rounded-full bg-fog" />
              <span>{lead.year || "——"}</span>
              {lead.episodes && (
                <>
                  <span className="size-1 rounded-full bg-fog" />
                  <span>{lead.episodes} eps</span>
                </>
              )}
              <AudioBadges className="ml-1" />
            </div>

            {lead.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {lead.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-bone/15 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-bone/70 uppercase"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {lead.synopsis && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone/70 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                {lead.synopsis}
              </p>
            )}

            <div className="pointer-events-auto mt-6 flex items-center gap-3">
              <Link
                href={watchHref("anime", lead.id)}
                className="flex items-center gap-2 rounded-full bg-acid px-6 py-3 text-[11px] font-bold tracking-[0.18em] text-void uppercase shadow-[0_0_40px_rgba(215,246,55,0.25)] transition-transform hover:scale-[1.03]"
              >
                <Play size={14} className="fill-void" />
                Watch
              </Link>
              <Link
                href={mediaHref("anime", lead.id)}
                className="flex items-center gap-2 rounded-full border border-bone/20 px-6 py-3 text-[11px] font-bold tracking-[0.18em] text-bone uppercase transition-colors hover:border-bone/50"
              >
                Details
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <ol className="divide-y divide-line/70">
          {rest.map((item, index) => (
            <li key={item.id}>
              <Link
                href={mediaHref("anime", item.id)}
                className="group flex items-center gap-4 py-3.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid"
              >
                <span
                  aria-hidden
                  className="w-8 shrink-0 font-display text-2xl leading-none text-outline transition-colors group-hover:text-outline-acid md:w-10 md:text-3xl"
                >
                  {String(index + 2).padStart(2, "0")}
                </span>

                <span className="relative h-[74px] w-[50px] shrink-0 overflow-hidden rounded-md bg-panel ring-1 ring-line">
                  {item.poster && (
                    <Image
                      src={item.poster}
                      alt={item.name}
                      fill
                      unoptimized
                      sizes="50px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-bone/90 transition-colors group-hover:text-bone">
                    {item.name}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-[0.14em] text-fog uppercase">
                    <span className="flex items-center gap-1 text-acid/90">
                      <Star size={10} className="fill-acid/80" />
                      {item.score ?? "NR"}
                    </span>
                    <span>{item.year || "——"}</span>
                    {item.episodes && <span>{item.episodes} eps</span>}
                    <AudioBadges />
                  </span>
                </span>

                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-fog opacity-0 transition-opacity group-hover:opacity-100"
                />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
