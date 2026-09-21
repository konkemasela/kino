import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Layers, Monitor, Play, Star, Tv, Users } from "lucide-react";
import {
  getAnime,
  getAnimeRecommendations,
  type AnimeItem,
} from "@/features/anime/api";
import { ratingOf } from "@/features/catalog/api";
import { watchHref } from "@/lib/utils";
import Rail, { RailItem } from "@/components/ui/rail";
import MediaCard from "@/features/catalog/components/media-card";
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
    const meta = await getAnime(id);
    return { title: meta.name };
  } catch {
    return { title: "Anime" };
  }
}

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let meta;
  try {
    meta = await getAnime(id);
  } catch {
    notFound();
  }

  let recommendations: AnimeItem[] = [];
  try {
    recommendations = (await getAnimeRecommendations(id, 14)).filter(
      (a) => a.id !== id,
    );
  } catch {
    recommendations = [];
  }

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pb-10 pt-28 md:px-10 md:pt-32">
        <div
          className="relative overflow-hidden rounded-[28px] border border-line bg-panel"
          style={{
            backgroundImage: meta.backdrop
              ? `linear-gradient(90deg, rgba(5,5,6,0.92), rgba(5,5,6,0.48)), url(${meta.backdrop})`
              : "linear-gradient(90deg, rgba(5,5,6,0.9), rgba(5,5,6,0.7))",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="grid gap-8 p-5 md:grid-cols-[220px_1fr] md:p-8 lg:p-10">
            <div className="relative mx-auto w-full max-w-[220px]">
              <div className="overflow-hidden rounded-[22px] border border-line bg-panel/80 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                {meta.poster ? (
                  <img
                    src={meta.poster}
                    alt={meta.name}
                    className="h-[320px] w-full object-cover md:h-[360px]"
                  />
                ) : (
                  <div className="flex h-[320px] items-center justify-center bg-panel2 text-3xl font-display tracking-[0.2em] text-fog md:h-[360px]">
                    KINO
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between py-2">
              <div>
                <p className="text-[10px] font-bold tracking-[0.34em] text-acid uppercase">
                  Anime • {meta.year || "TBA"}
                </p>
                <h1 className="mt-4 font-display text-5xl leading-none tracking-[0.08em] uppercase md:text-7xl">
                  {meta.name}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-fog uppercase">
                  {meta.genres.slice(0, 6).map((genre) => (
                    <span key={genre} className="rounded-full border border-line bg-panel/60 px-3 py-1.5">
                      {genre}
                    </span>
                  ))}
                </div>

                <p className="mt-6 max-w-3xl text-sm leading-7 text-bone/80 md:text-base">
                  {meta.synopsis}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={watchHref("anime", meta.id, 1, 1)}
                  className="group flex items-center gap-2.5 rounded-full bg-acid px-7 py-3.5 text-[12px] font-bold tracking-[0.18em] text-void uppercase shadow-[0_0_44px_rgba(215,246,55,0.28)] transition-all hover:scale-[1.04] active:scale-95"
                >
                  <Play size={15} className="fill-void" />
                  Watch E1
                </Link>
                {meta.trailerYoutubeId && (
                  <TrailerButton youtubeKey={meta.trailerYoutubeId} />
                )}
                <ListButton
                  mediaType="anime"
                  imdbId={meta.id}
                  title={meta.name}
                  posterPath={meta.poster}
                  backdropPath={meta.backdrop}
                />
                <ShareButton
                  title={meta.name}
                  path={`/anime/${meta.id}`}
                  description={`Watch ${meta.name} on KINO`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {[
            {
              icon: Calendar,
              label: "Premiered",
              value: meta.premiered || meta.year || "—",
            },
            {
              icon: Tv,
              label: "Studio",
              value: meta.studios || "—",
            },
            {
              icon: Monitor,
              label: "Source",
              value: meta.source || "—",
            },
            {
              icon: Users,
              label: "MAL rank",
              value: meta.rank ? `#${meta.rank}` : "—",
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

      <div className="space-y-20 pb-20 pt-20">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: <Star size={16} className="fill-acid text-acid" />, label: "Score", value: `${ratingOf(meta.score)} / 10` },
              { icon: <Layers size={16} />, label: "Episodes", value: meta.episodes ? `${meta.episodes}` : "TBA" },
              { icon: <Monitor size={16} />, label: "Status", value: meta.status || "Unknown" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-line bg-panel/60 p-5">
                <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-fog uppercase">
                  {stat.icon}
                  {stat.label}
                </p>
                <p className="mt-3 text-2xl font-display tracking-[0.06em] text-bone uppercase">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {recommendations.length > 0 && (
          <Rail title="More" accent="like this" href="/anime">
            {recommendations.map((item) => (
              <RailItem key={item.id}>
                <MediaCard
                  item={{
                    id: item.id,
                    name: item.name,
                    poster: item.poster,
                    imdbRating: item.score,
                    releaseInfo: item.year,
                  }}
                  type="anime"
                />
              </RailItem>
            ))}
          </Rail>
        )}
      </div>
    </>
  );
}
