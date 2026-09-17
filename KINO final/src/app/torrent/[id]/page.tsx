import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft, DownloadCloud, Play } from "lucide-react";
import { getMeta, yearOfItem, type MediaType } from "@/features/catalog/api";
import { watchHref } from "@/lib/utils";
import TorrentPanel from "@/features/torrents/components/torrent-panel";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { id } = await params;
  const sp = await searchParams;
  const type = sp.type === "tv" ? "tv" : "movie";
  try {
    const meta = await getMeta(type, id);
    return { title: `Torrent — ${meta.name}` };
  } catch {
    return { title: "Torrent Vault" };
  }
}

export default async function TorrentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const mediaType: MediaType = sp.type === "tv" ? "tv" : "movie";

  let title = id;
  let year = "";
  try {
    const meta = await getMeta(mediaType, id);
    title = meta.name;
    year = yearOfItem(meta.releaseInfo || meta.year);
  } catch {
    // The vault below reports its own state — a missing catalog entry just
    // means we show it without a friendly header.
  }

  const backHref = mediaType === "tv" ? `/tv/${id}` : `/movie/${id}`;
  const backLabel = mediaType === "tv" ? "Back to series" : "Back to movie";

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-28 pt-28 md:px-10 md:pb-16 md:pt-36">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.24em] text-fog uppercase transition-colors hover:text-acid"
          >
            <ChevronLeft size={14} />
            {backLabel}
          </Link>
          <h1 className="mt-3 font-display text-4xl tracking-[0.04em] text-bone uppercase md:text-6xl">
            {title}
            {year && (
              <span className="ml-3 font-editorial text-2xl italic normal-case text-outline md:text-4xl">
                {year}
              </span>
            )}
          </h1>
          {mediaType === "tv" && (
            <p className="mt-2 flex items-center gap-2 font-editorial text-lg italic text-acid/90 md:text-xl">
              <DownloadCloud size={18} />
              Every episode, seeded by EZTV
            </p>
          )}
        </div>
        <Link
          href={watchHref(mediaType, id, 1, 1)}
          className="flex items-center gap-2.5 rounded-full bg-acid px-6 py-3 text-[11px] font-bold tracking-[0.18em] text-void uppercase shadow-[0_0_32px_rgba(215,246,55,0.25)] transition-transform hover:scale-105 active:scale-95"
        >
          <Play size={14} className="fill-void" />
          Stream instead
        </Link>
      </div>

      <TorrentPanel imdbId={id} title={title} mediaType={mediaType} />
    </div>
  );
}
