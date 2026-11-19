"use client";

import Image from "next/image";
import Link from "next/link";
import { Info, Play, Star } from "lucide-react";
import { mediaHref, watchHref } from "@/lib/utils";
import { ratingOf, type MediaType } from "@/features/catalog/api";

export interface HeroItem {
  id: string;
  mediaType: MediaType;
  title: string;
  overview: string;
  backdrop: string;
  year: string;
  rating: string | null;
}

export default function Hero({ items }: { items: HeroItem[] }) {
  const item = items[0];
  if (!item) return null;

  return (
    <section className="theme-dark relative isolate flex min-h-[540px] items-end overflow-hidden bg-panel md:min-h-[620px]">
      <Image
        src={item.backdrop}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/55 to-void/15" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-void/70 to-transparent" />

      <div className="mx-auto w-full max-w-[1600px] px-5 pb-20 pt-32 md:px-10 md:pb-24">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium text-bone/75">
            Featured {item.mediaType === "movie" ? "movie" : "series"}
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-bone sm:text-5xl md:text-7xl">
            {item.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-bone/80">
            <span className="inline-flex items-center gap-1.5">
              <Star size={14} className="fill-current text-acid" aria-hidden="true" />
              {ratingOf(item.rating)}
            </span>
            {item.year && <span>{item.year}</span>}
            <span>{item.mediaType === "movie" ? "Movie" : "Series"}</span>
          </div>

          {item.overview && (
            <p className="mt-4 max-w-xl text-sm leading-6 text-bone/75 sm:text-base">
              {item.overview}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={watchHref(item.mediaType, item.id, 1, 1)}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-bone px-5 text-sm font-semibold text-void transition-colors hover:bg-white"
            >
              <Play size={16} className="fill-current" aria-hidden="true" />
              Watch now
            </Link>
            <Link
              href={mediaHref(item.mediaType, item.id)}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-bone/35 px-5 text-sm font-medium text-bone transition-colors hover:bg-bone/10"
            >
              <Info size={16} aria-hidden="true" />
              More info
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
