import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Layers, Monitor, Play, Star, Tv, Users } from "lucide-react";
import { getAnime, getAnimeRecommendations, type AnimeItem } from "@/features/anime/api";
import { ratingOf } from "@/features/catalog/api";
import { watchHref } from "@/lib/utils";
import Rail, { RailItem } from "@/components/ui/rail";
import MediaCard from "@/features/catalog/components/media-card";
import ListButton from "@/features/library/components/list-button";
import TrailerButton from "@/components/ui/trailer-button";
import ShareButton from "@/components/ui/share-button";
import DetailsHero from "@/features/catalog/components/details-hero";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try { return { title: (await getAnime(id)).name }; } catch { return { title: "Anime" }; }
}

export default async function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let meta;
  try { meta = await getAnime(id); } catch { notFound(); }

  let recommendations: AnimeItem[] = [];
  try { recommendations = (await getAnimeRecommendations(id, 14)).filter((item) => item.id !== id); } catch { recommendations = []; }
  const episodes = meta.streamingEpisodes.slice(0, 8);
  const facts = [
    { icon: Calendar, label: "Premiered", value: meta.premiered || meta.year || "—" },
    { icon: Tv, label: "Studio", value: meta.studios || "—" },
    { icon: Monitor, label: "Source", value: meta.source || "—" },
    { icon: Users, label: "Rank", value: meta.rank ? `#${meta.rank}` : "—" },
  ];
  const stats = [
    { icon: <Star size={16} className="fill-acid text-acid" />, label: "Rating", value: `${ratingOf(meta.score)} / 10` },
    { icon: <Layers size={16} />, label: "Episodes", value: meta.episodes ? String(meta.episodes) : "Unknown" },
    { icon: <Monitor size={16} />, label: "Status", value: meta.status || "Unknown" },
  ];

  return (
    <>
      <DetailsHero
        backdrop={meta.backdrop}
        poster={meta.poster}
        kicker={`Anime${meta.year ? ` · ${meta.year}` : ""}`}
        title={meta.name}
        tagline={null}
        overview={meta.synopsis}
        genres={meta.genres}
        meta={[{ icon: <Star size={13} className="fill-acid text-acid" />, label: `${ratingOf(meta.score)} / 10` }, ...(meta.episodes ? [{ icon: <Layers size={13} />, label: `${meta.episodes} episodes` }] : [])]}
        actions={
          <>
            <Link href={watchHref("anime", meta.id, 1, 1)} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-acid px-4 text-sm font-semibold text-void"><Play size={16} className="fill-current" />Watch episode 1</Link>
            {meta.trailerYoutubeId && <TrailerButton youtubeKey={meta.trailerYoutubeId} />}
            <ListButton mediaType="anime" imdbId={meta.id} title={meta.name} posterPath={meta.poster} backdropPath={meta.backdrop} />
            <ShareButton title={meta.name} path={`/anime/${meta.id}`} description={`Watch ${meta.name} on KINO`} />
          </>
        }
      />

      <section className="mx-auto mt-6 grid max-w-[1440px] grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line px-4 sm:px-6 md:grid-cols-4 lg:px-10">
        {facts.map((fact) => <div key={fact.label} className="min-w-0 bg-panel p-4 sm:p-5"><p className="flex items-center gap-2 text-xs text-fog"><fact.icon size={14} className="shrink-0 text-acid" />{fact.label}</p><p className="mt-2 truncate text-sm font-medium text-bone">{fact.value}</p></div>)}
      </section>

      <div className="mx-auto max-w-[1440px] space-y-10 px-4 py-10 sm:px-6 lg:px-10">
        <section><h2 className="mb-4 text-xl font-semibold text-bone">Details</h2><div className="grid gap-3 sm:grid-cols-3">{stats.map((stat) => <div key={stat.label} className="rounded-lg border border-line bg-panel p-4"><p className="flex items-center gap-2 text-sm text-fog">{stat.icon}{stat.label}</p><p className="mt-2 text-base font-medium text-bone">{stat.value}</p></div>)}</div></section>
        {episodes.length > 0 && <section><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-fog">Episodes</p><h2 className="mt-1 text-xl font-semibold text-bone">Start watching</h2></div><Link href={watchHref("anime", meta.id, 1, 1)} className="text-sm font-medium text-acid hover:underline">Play episode 1</Link></div><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{episodes.map((episode) => <Link key={`${meta.id}-${episode.number}`} href={watchHref("anime", meta.id, 1, episode.number)} className="rounded-lg border border-line bg-panel p-4 transition-colors hover:border-acid/50"><p className="text-xs text-fog">Episode {episode.number}</p><p className="mt-2 line-clamp-2 text-sm font-medium text-bone">{episode.title || `Episode ${episode.number}`}</p></Link>)}</div></section>}
      </div>

      {recommendations.length > 0 && <div className="pb-10"><Rail title="You may also like" href="/anime">{recommendations.map((item) => <RailItem key={item.id}><MediaCard item={{ id: item.id, name: item.name, poster: item.poster, imdbRating: item.score, releaseInfo: item.year }} type="anime" /></RailItem>)}</Rail></div>}
    </>
  );
}
