"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Star, X } from "lucide-react";
import type { MediaType } from "@/features/catalog/api";
import type { ServerKind } from "@/features/watch/servers";
import { ratingOf, yearOfItem } from "@/features/catalog/api";
import { cn, kindLabel, mediaHref, watchHref } from "@/lib/utils";

export interface CardItem {
  id: string;
  name: string;
  poster?: string | null;
  type?: ServerKind;
  imdbRating?: string | null;
  releaseInfo?: string;
}

interface MediaCardProps {
  item: CardItem;
  type?: ServerKind;
  rank?: number;
  href?: string;
  onRemove?: () => void;
  subtitle?: string;
}

export default function MediaCard({
  item,
  type,
  rank,
  href,
  onRemove,
  subtitle,
}: MediaCardProps) {
  const router = useRouter();
  const resolvedType: ServerKind = type ?? item.type ?? "movie";
  const year = yearOfItem(item.releaseInfo);
  const link = href ?? mediaHref(resolvedType, item.id);
  const watchLink = watchHref(resolvedType, item.id);

  return (
    <div className="group/card relative">
      {typeof rank === "number" && (
        <span
          aria-hidden
          className="absolute -left-3 z-0 select-none font-display text-[96px] leading-none text-outline transition-colors duration-300 group-hover/card:text-outline-acid md:-left-6 md:text-[120px]"
          style={{ bottom: 8 }}
        >
          {String(rank).padStart(2, "0")}
        </span>
      )}

      <div
        className={cn(
          "relative",
          typeof rank === "number" && "ml-10 md:ml-16",
        )}
      >
        <Link
          href={link}
          className="relative block aspect-[2/3] overflow-hidden rounded-xl bg-panel ring-1 ring-line transition-all duration-500 group-hover/card:ring-acid/60"
        >
          {item.poster ? (
            <Image
              src={item.poster}
              alt={item.name}
              fill
              unoptimized
              sizes="(max-width: 768px) 40vw, 220px"
              className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center font-display text-xl tracking-wider text-fog">
              {item.name}
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-void/10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />

          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-void/70 px-2 py-1 text-[10px] font-bold tracking-wider text-bone backdrop-blur-md">
            <Star size={10} className="fill-acid text-acid" />
            {ratingOf(item.imdbRating)}
          </span>

          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(watchLink);
            }}
            aria-label={`Watch ${item.name}`}
            className="absolute bottom-3 right-3 flex size-10 translate-y-3 items-center justify-center rounded-full bg-acid text-void opacity-0 shadow-[0_0_30px_rgba(215,246,55,0.5)] transition-all duration-400 hover:scale-110 group-hover/card:translate-y-0 group-hover/card:opacity-100"
          >
            <Play size={16} className="fill-void" />
          </span>
        </Link>

        {onRemove && (
          <button
            onClick={onRemove}
            aria-label="Remove"
            className="absolute -right-2 -top-2 z-10 flex size-7 items-center justify-center rounded-full border border-line bg-panel text-fog opacity-0 transition-all hover:border-ember hover:text-ember group-hover/card:opacity-100"
          >
            <X size={13} />
          </button>
        )}

        <div className="mt-3 space-y-0.5">
          <p className="truncate text-[13px] font-semibold text-bone/90 transition-colors group-hover/card:text-bone">
            {item.name}
          </p>
          <p className="text-[11px] font-medium tracking-[0.14em] text-fog uppercase">
            {subtitle ?? (
              <>
                {year || "——"} · {kindLabel(resolvedType)}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
