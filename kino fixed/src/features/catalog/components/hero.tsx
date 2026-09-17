"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Info, Play, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn, mediaHref, watchHref } from "@/lib/utils";
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
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => {
      setIndex(((next % items.length) + items.length) % items.length);
    },
    [items.length],
  );

  const restart = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => go(indexRef.current + 1), 7000);
  }, [go]);

  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    restart();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [restart]);

  const item = items[index];
  if (!item) return null;

  const manual = (i: number) => {
    go(i);
    restart();
  };

  return (
    <section className="relative h-[94svh] min-h-[580px] w-full overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={item.backdrop}
              alt={item.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-[center_20%]"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/25 to-void/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-void/85 via-void/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 pb-28 md:pb-32">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${index}`}
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <p className="mb-5 flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
                <span className="h-px w-10 bg-acid" />
                #{index + 1} Trending {item.mediaType === "movie" ? "movie" : "series"} this week
              </p>

              <h1 className="font-display text-[clamp(3.2rem,8.5vw,8rem)] leading-[0.88] tracking-[0.02em] text-bone uppercase">
                {item.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold tracking-[0.14em] text-bone/80 uppercase">
                <span className="flex items-center gap-1.5 text-acid">
                  <Star size={13} className="fill-acid" />
                  {ratingOf(item.rating)}
                </span>
                <span className="size-1 rounded-full bg-fog" />
                <span>{item.year || "——"}</span>
                <span className="size-1 rounded-full bg-fog" />
                <span className="rounded-full border border-bone/25 px-2.5 py-0.5 text-[10px]">
                  {item.mediaType === "movie" ? "Movie" : "TV Series"}
                </span>
              </div>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-bone/70 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                {item.overview}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={watchHref(item.mediaType, item.id, 1, 1)}
                  className="group flex items-center gap-2.5 rounded-full bg-acid px-7 py-3.5 text-[12px] font-bold tracking-[0.18em] text-void uppercase shadow-[0_0_44px_rgba(215,246,55,0.28)] transition-all hover:scale-[1.04] hover:shadow-[0_0_60px_rgba(215,246,55,0.45)] active:scale-95"
                >
                  <Play size={15} className="fill-void transition-transform group-hover:scale-110" />
                  Watch now
                </Link>
                <Link
                  href={mediaHref(item.mediaType, item.id)}
                  className="flex items-center gap-2.5 rounded-full border border-bone/25 bg-void/40 px-7 py-3.5 text-[12px] font-bold tracking-[0.18em] text-bone uppercase backdrop-blur-md transition-all hover:border-bone/60 hover:bg-void/70 active:scale-95"
                >
                  <Info size={15} />
                  Details
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-10 right-5 hidden items-end gap-6 md:right-10 md:flex">
        <div className="flex items-baseline gap-1 font-display text-bone">
          <span className="text-4xl text-acid">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-lg text-fog">/ {String(items.length).padStart(2, "0")}</span>
        </div>
        <div className="mb-2 flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => manual(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-[3px] rounded-full transition-all duration-500",
                i === index ? "w-10 bg-acid" : "w-4 bg-bone/25 hover:bg-bone/60",
              )}
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[10px] font-bold tracking-[0.4em] text-fog uppercase">Scroll</span>
        <span className="h-8 w-px animate-pulse-soft bg-gradient-to-b from-acid to-transparent" />
      </div>
    </section>
  );
}
