"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Star, X } from "lucide-react";
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
  badges?: string[];
}

export default function MediaCard({ item, type, rank, href, onRemove, subtitle, badges }: MediaCardProps) {
  const router = useRouter();
  const resolvedType = type ?? item.type ?? "movie";
  const year = yearOfItem(item.releaseInfo);
  const link = href ?? mediaHref(resolvedType, item.id);
  const watchLink = watchHref(resolvedType, item.id);

  return (
    <article className="group/card relative">
      {typeof rank === "number" && (
        <span aria-hidden className="absolute -left-3 bottom-2 z-0 select-none font-display text-[96px] leading-none text-outline md:-left-6 md:text-[120px]">
          {String(rank).padStart(2, "0")}
        </span>
      )}
      <div className={cn("relative", typeof rank === "number" && "ml-10 md:ml-16")}>
        <Link href={link} className="theme-dark relative block aspect-[2/3] overflow-hidden rounded-md bg-panel ring-1 ring-line transition-colors hover:ring-white/60">
          {item.poster ? (
            <Image src={item.poster} alt={item.name} fill unoptimized sizes="(max-width: 768px) 40vw, 220px" className="object-cover transition-transform duration-300 group-hover/card:scale-[1.03]" />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-sm text-fog">{item.name}</div>
          )}
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-sm bg-black/75 px-2 py-1 text-[10px] font-medium text-white">
            <Star size={10} className="fill-white text-white" />
            {ratingOf(item.imdbRating)}
          </span>
          {badges && badges.length > 0 && (
            <span className="absolute bottom-2 left-2 flex flex-wrap gap-1">
              {badges.map((badge) => <span key={badge} className="rounded-sm bg-black/75 px-1.5 py-0.5 text-[9px] text-white">{badge}</span>)}
            </span>
          )}
          <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); router.push(watchLink); }} aria-label={`Watch ${item.name}`} className="absolute bottom-2 right-2 flex size-9 items-center justify-center rounded-md bg-white text-black opacity-0 transition-opacity group-hover/card:opacity-100 focus:opacity-100">
            <Play size={15} className="fill-current" />
          </button>
        </Link>
        {onRemove && (
          <button type="button" onClick={onRemove} aria-label={`Remove ${item.name}`} className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-md bg-black/75 text-white opacity-0 transition-opacity group-hover/card:opacity-100 focus:opacity-100">
            <X size={13} />
          </button>
        )}
        <div className="mt-2 space-y-0.5">
          <p className="truncate text-[13px] font-medium text-bone">{item.name}</p>
          <p className="text-[11px] text-fog">{subtitle ?? `${year || "—"} · ${kindLabel(resolvedType)}`}</p>
        </div>
      </div>
    </article>
  );
}
