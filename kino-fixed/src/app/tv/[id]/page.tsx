import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Globe, Layers, Play, Star, User } from "lucide-react";
import {
  episodeLabelCount,
  getCatalog,
  getMeta,
  ratingOf,
  yearOfItem,
  type CatalogItem,
} from "@/features/catalog/api";
import { watchHref } from "@/lib/utils";
import Rail, { RailItem } from "@/components/ui/rail";
import MediaCard from "@/features/catalog/components/media-card";
import CastRail from "@/features/catalog/components/cast-rail";
import ListButton from "@/features/library/components/list-button";
import TrailerButton from "@/components/ui/trailer-button";
import ShareButton from "@/components/ui/share-button";
import DetailsHero from "@/features/catalog/components/details-hero";
import { Magnet } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const meta = await getMeta("tv", id);
    return { title: meta.name };
  } catch {
    return { title: "Series" };
  }
}

export default async function TvPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let meta;
  try {
    meta = await getMeta("tv", id);
  } catch {
    notFound();
  }

  const trailer = meta.trailers[0] ?? null;
  const episodes = meta.videos.filter((v) => v.season >= 1);
  const seasonNumbers = [...new Set(episodes.map((v) => v.season))].sort(
    (a, b) => a - b,
  );
  const seasons = seasonNumbers.map((n) => {
    const eps = episodes.filter((v) => v.season === n);
    const thumb = eps.find((v) => v.thumbnail)?.thumbnail ?? null;
    return { number: n, count: eps.length, thumb };
  });

  let similar: CatalogItem[] = [];
  try {
    const genre = meta.genres[0] ?? "Drama";
    similar = (await getCatalog("tv", { genre }))
      .filter((item) => item.id !== meta.id)
      .slice(0, 14);
  } catch {
    similar = [];
  }

  return (
    <>
      <DetailsHero
        backdrop={meta.backdrop}
        poster={meta.poster}
        kicker={`Series — ${yearOfItem(meta.releaseInfo || meta.year) || "TBA"}`}
        title={meta.name}
        tagline={meta.awards || null}
        overview={meta.description}
        genres={meta.genres}
        meta={[
          {
            icon: <Star size={13} className="fill-acid text-acid" />,
            label: `${ratingOf(meta.imdbRating)} / 10 IMDb`,
          },
          ...(seasonNumbers.length > 0
            ? [
                {
                  icon: <Layers size={13} />,
                  label: `${seasonNumbers.length} season${seasonNumbers.length > 1 ? "s" : ""}`,
                },
              ]
            : []),
          ...(meta.runtime
            ? [{ label: `${meta.runtime} / ep` }]
            : []),
        ]}
        actions={
          <>
            <Link
              href={watchHref("tv", meta.id, 1, 1)}
              className="group flex items-center gap-2.5 rounded-full bg-acid px-7 py-3.5 text-[12px] font-bold tracking-[0.18em] text-void uppercase shadow-[0_0_44px_rgba(215,246,55,0.28)] transition-all hover:scale-[1.04] active:scale-95"
            >
              <Play size={15} className="fill-void" />
              Watch S1 E1
            </Link>
            {trailer && <TrailerButton youtubeKey={trailer.source} />}
            <ListButton
              mediaType="tv"
              imdbId={meta.id}
              title={meta.name}
              posterPath={meta.poster}
              backdropPath={meta.backdrop}
            />
            <Link
              href={`/torrent/${meta.id}?type=tv`}
              className="flex items-center gap-2.5 rounded-full border border-bone/25 bg-void/40 px-6 py-3.5 text-[12px] font-bold tracking-[0.18em] text-bone uppercase backdrop-blur-md transition-all hover:border-acid hover:text-acid active:scale-95"
            >
              <Magnet size={15} />
              Torrent
            </Link>
            <ShareButton
              title={meta.name}
              path={`/tv/${meta.id}`}
              description={`Watch ${meta.name} on KINO`}
            />
          </>
        }
      />

      <section className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {[
            {
              icon: Calendar,
              label: "Aired",
              value: meta.releaseInfo || meta.year || "—",
            },
            {
              icon: User,
              label: "Created by",
              value: (meta.director.length > 0 ? meta.director : meta.writer).join(", ") || "—",
            },
            {
              icon: Layers,
              label: "Episodes",
              value: episodeLabelCount(meta) ? `${episodeLabelCount(meta)}` : "—",
            },
            {
              icon: Globe,
              label: "Country",
              value: meta.country || "—",
            },
          ].map((fact) => (
            <div key={fact.label} className="bg-panel p-5 md:p-6">
              <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.28em] text-fog uppercase">
                <fact.icon size={13} className="text-acid" />
                {fact.label}
              </p>
              <p className="mt-2 truncate text-sm font-semibold text-bone">
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {seasons.length > 0 && (
        <div className="pt-20">
          <Rail title="Seasons" accent="choose your chapter">
            {seasons.map((season) => (
              <RailItem key={season.number} className="w-[150px] md:w-[175px]">
                <Link
                  href={watchHref("tv", meta.id, season.number, 1)}
                  className="group/season block"
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-panel ring-1 ring-line transition-all duration-500 group-hover/season:ring-acid/60">
                    {meta.poster ? (
                      <Image
                        src={meta.poster}
                        alt={`Season ${season.number}`}
                        fill
                        unoptimized
                        sizes="175px"
                        className="object-cover transition-transform duration-700 group-hover/season:scale-[1.06]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-2xl tracking-wider text-fog">
                        S{season.number}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/season:opacity-100" />
                    <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-acid px-3 py-1.5 text-[10px] font-bold tracking-wider text-void opacity-0 transition-all duration-300 group-hover/season:opacity-100">
                      <Play size={10} className="fill-void" />
                      S{season.number}
                    </span>
                  </div>
                  <p className="mt-3 truncate text-[13px] font-semibold text-bone/90">
                    Season {season.number}
                  </p>
                  <p className="text-[11px] font-medium tracking-[0.14em] text-fog uppercase">
                    {season.count} episodes
                  </p>
                </Link>
              </RailItem>
            ))}
          </Rail>
        </div>
      )}

      <div className="space-y-20 py-20">
        <CastRail cast={meta.cast} />

        {similar.length > 0 && (
          <Rail title="More" accent="like this" href="/series">
            {similar.map((item) => (
              <RailItem key={item.id}>
                <MediaCard item={item} />
              </RailItem>
            ))}
          </Rail>
        )}
      </div>
    </>
  );
}
