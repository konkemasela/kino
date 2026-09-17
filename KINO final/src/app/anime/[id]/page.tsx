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
      <DetailsHero
        backdrop={meta.backdrop}
        poster={meta.poster}
        kicker={`Anime — ${meta.year || "TBA"}${meta.type ? ` · ${meta.type}` : ""}`}
        title={meta.name}
        tagline={meta.studios ? `Animated by ${meta.studios}` : null}
        overview={meta.synopsis}
        genres={meta.genres}
        meta={[
          {
            icon: <Star size={13} className="fill-acid text-acid" />,
            label: `${ratingOf(meta.score)} / 10 MAL`,
          },
          ...(meta.episodes
            ? [
                {
                  icon: <Layers size={13} />,
                  label: `${meta.episodes} episodes`,
                },
              ]
            : []),
          ...(meta.status ? [{ label: meta.status }] : []),
        ]}
        actions={
          <>
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
          </>
        }
      />

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
