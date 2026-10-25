import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, Globe, Magnet, Play, Star, Trophy, User } from "lucide-react";
import {
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const meta = await getMeta("movie", id);
    return { title: meta.name };
  } catch {
    return { title: "Movie" };
  }
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let meta;
  try {
    meta = await getMeta("movie", id);
  } catch {
    notFound();
  }

  const trailer = meta.trailers[0] ?? null;

  let similar: CatalogItem[] = [];
  try {
    const genre = meta.genres[0] ?? "Drama";
    similar = (await getCatalog("movie", { genre }))
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
        kicker={`Movie — ${yearOfItem(meta.releaseInfo || meta.year) || "TBA"}`}
        title={meta.name}
        tagline={meta.awards || null}
        overview={meta.description}
        genres={meta.genres}
        meta={[
          {
            icon: <Star size={13} className="fill-acid text-acid" />,
            label: `${ratingOf(meta.imdbRating)} / 10 IMDb`,
          },
          ...(meta.runtime
            ? [{ icon: <Clock size={13} />, label: meta.runtime }]
            : []),
          ...(meta.moviedbId ? [{ label: "HD streams" }] : []),
        ]}
        actions={
          <>
            <Link
              href={watchHref("movie", meta.id)}
              className="group flex items-center gap-2.5 rounded-full bg-acid px-7 py-3.5 text-[12px] font-bold tracking-[0.18em] text-void uppercase shadow-[0_0_44px_rgba(215,246,55,0.28)] transition-all hover:scale-[1.04] active:scale-95"
            >
              <Play size={15} className="fill-void" />
              Watch now
            </Link>
            <Link
              href={`/torrent/${meta.id}`}
              className="flex items-center gap-2.5 rounded-full border border-bone/25 bg-void/40 px-6 py-3.5 text-[12px] font-bold tracking-[0.18em] text-bone uppercase backdrop-blur-md transition-all hover:border-acid hover:text-acid active:scale-95"
            >
              <Magnet size={15} />
              Torrent
            </Link>
            {trailer && <TrailerButton youtubeKey={trailer.source} />}
            <ListButton
              mediaType="movie"
              imdbId={meta.id}
              title={meta.name}
              posterPath={meta.poster}
              backdropPath={meta.backdrop}
            />
            <ShareButton
              title={meta.name}
              path={`/movie/${meta.id}`}
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
              label: "Released",
              value: meta.releaseInfo || meta.year || "—",
            },
            {
              icon: User,
              label: "Director",
              value: meta.director.join(", ") || "—",
            },
            {
              icon: Globe,
              label: "Country",
              value: meta.country || "—",
            },
            {
              icon: Trophy,
              label: "Rating",
              value: meta.imdbRating ? `${ratingOf(meta.imdbRating)} on IMDb` : "Unrated",
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

      <div className="space-y-20 py-20">
        <CastRail cast={meta.cast} />

        {similar.length > 0 && (
          <Rail title="More" accent="like this" href="/movies">
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
