import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft, Magnet } from "lucide-react";
import {
  getCatalog,
  getMeta,
  type CatalogItem,
  type MediaType,
} from "@/features/catalog/api";
import {
  episodesFrom,
  getAnime,
  getAnimeRecommendations,
  type AnimeItem,
} from "@/features/anime/api";
import WatchExperience, {
  type EpisodeDto,
} from "@/features/watch/components/watch-experience";
import ShareButton from "@/components/ui/share-button";
import Rail, { RailItem } from "@/components/ui/rail";
import MediaCard from "@/features/catalog/components/media-card";

const toInt = (v: string | string[] | undefined, fallback: number) => {
  const n = parseInt(Array.isArray(v) ? (v[0] ?? "") : (v ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}): Promise<Metadata> {
  const { type, id } = await params;
  try {
    if (type === "anime") {
      const meta = await getAnime(id);
      return { title: `Watch ${meta.name}` };
    }
    if (type === "movie" || type === "tv") {
      const meta = await getMeta(type, id);
      return { title: `Watch ${meta.name}` };
    }
    return { title: "Watch" };
  } catch {
    return { title: "Watch" };
  }
}

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { type, id } = await params;
  if (type !== "movie" && type !== "tv" && type !== "anime") notFound();
  const sp = await searchParams;

  if (type === "anime") {
    return AnimeWatch({ id, searchParams: sp });
  }
  return CinemetaWatch({ type, id, searchParams: sp });
}

async function CinemetaWatch({
  type,
  id,
  searchParams,
}: {
  type: MediaType;
  id: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  let meta;
  try {
    meta = await getMeta(type, id);
  } catch {
    notFound();
  }

  const episodes: EpisodeDto[] = meta.videos
    .filter((v) => v.season >= 1)
    .map((v) => ({
      id: v.id,
      season: v.season,
      episode: v.episode,
      name: v.name,
      overview: v.overview,
      released: v.released,
      thumbnail: v.thumbnail,
      rating: v.rating,
    }))
    .sort((a, b) => a.season - b.season || a.episode - b.episode);

  let season = toInt(searchParams.s, 1);
  let episode = toInt(searchParams.e, 1);
  const current = episodes.find(
    (e) => e.season === season && e.episode === episode,
  );
  if (type === "tv" && !current && episodes.length > 0) {
    season = episodes[0].season;
    episode = episodes[0].episode;
  }

  let recommended: CatalogItem[] = [];
  try {
    const genre = meta.genres[0] ?? "Drama";
    recommended = (await getCatalog(type, { genre }))
      .filter((item) => item.id !== meta.id && item.poster)
      .slice(0, 14);
  } catch {
    recommended = [];
  }

  return (
    <div className="pt-20 pb-10 md:pt-24">
      <div className="mx-auto max-w-[1500px] px-4 md:px-8">
        <WatchHeader
          href={`/${type}/${id}`}
          back={`Back to ${type === "movie" ? "movie" : "series"}`}
          title={meta.name}
          subtitle={
            type === "tv"
              ? `Season ${season} — Episode ${episode}`
              : null
          }
          episodeName={current?.name}
        />

        <WatchExperience
          kind={type}
          id={meta.id}
          moviedbId={meta.moviedbId}
          title={meta.name}
          posterPath={meta.poster}
          backdropPath={meta.backdrop}
          initialSeason={season}
          initialEpisode={episode}
          episodes={episodes}
        />

        <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
          <ShareButton
            title={meta.name}
            path={`/watch/${type}/${meta.id}?s=${season}&e=${episode}`}
            description={`Watch ${meta.name} on KINO`}
            className="!px-6 !py-3 !text-[11px]"
            party={{ type, id: meta.id, season, episode }}
          />
          <Link
            href={
              type === "movie"
                ? `/torrent/${meta.id}`
                : `/torrent/${meta.id}?type=tv`
            }
            className="flex items-center gap-2.5 rounded-full border border-line bg-panel/60 px-6 py-3 text-[11px] font-bold tracking-[0.18em] text-bone uppercase transition-all hover:border-acid hover:text-acid active:scale-95"
          >
            <Magnet size={14} />
            Open torrent vault
          </Link>
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="mt-16 md:mt-20">
          <Rail title="Up" accent="next in your queue">
            {recommended.map((item) => (
              <RailItem key={item.id}>
                <MediaCard item={item} />
              </RailItem>
            ))}
          </Rail>
        </div>
      )}
    </div>
  );
}

async function AnimeWatch({
  id,
  searchParams,
}: {
  id: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  let meta;
  try {
    meta = await getAnime(id);
  } catch {
    notFound();
  }

  const episodeList: EpisodeDto[] = episodesFrom(meta).map((e) => ({
    id: `${id}-${e.number}`,
    season: 1,
    episode: e.number,
    name: e.title,
    overview: "",
    released: e.aired,
    thumbnail: e.thumbnail,
    rating: e.score,
  }));

  const season = 1;
  let episode = toInt(searchParams.e, 1);

  if (!episodeList.some((e) => e.episode === episode)) {
    const fallback = episodeList.find((e) => e.episode === episode) ?? episodeList[0];
    episode = fallback?.episode ?? 1;
  }

  const current = episodeList.find((e) => e.episode === episode);

  let recommended: AnimeItem[] = [];
  try {
    recommended = (await getAnimeRecommendations(id, 14)).filter(
      (a) => a.id !== id,
    );
  } catch {
    recommended = [];
  }

  return (
    <div className="pt-20 pb-10 md:pt-24">
      <div className="mx-auto max-w-[1500px] px-4 md:px-8">
        <WatchHeader
          href={`/anime/${id}`}
          back="Back to anime"
          title={meta.name}
          subtitle={`Episode ${episode}`}
          episodeName={current?.name}
        />

        <WatchExperience
          kind="anime"
          id={id}
          moviedbId={null}
          title={meta.name}
          posterPath={meta.poster}
          backdropPath={meta.backdrop}
          initialSeason={season}
          initialEpisode={episode}
          episodes={episodeList}
          supportsDub
        />

        <div className="mt-8 flex justify-end">
          <ShareButton
            title={meta.name}
            path={`/watch/anime/${id}?e=${episode}`}
            description={`Watch ${meta.name} on KINO`}
            className="!px-6 !py-3 !text-[11px]"
            party={{ type: "anime", id, episode }}
          />
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="mt-16 md:mt-20">
          <Rail title="More" accent="anime for you" href="/anime">
            {recommended.map((item) => (
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
        </div>
      )}
    </div>
  );
}

function WatchHeader({
  href,
  back,
  title,
  subtitle,
  episodeName,
}: {
  href: string;
  back: string;
  title: string;
  subtitle: string | null;
  episodeName?: string | null;
}) {
  return (
    <div className="mb-6">
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.24em] text-fog uppercase transition-colors hover:text-acid"
      >
        <ChevronLeft size={14} />
        {back}
      </Link>
      <h1 className="mt-3 font-display text-4xl tracking-[0.04em] text-bone uppercase md:text-6xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 font-editorial text-lg italic text-acid/90 md:text-xl">
          {subtitle}
          {episodeName ? (
            <span className="text-bone/60"> · “{episodeName}”</span>
          ) : null}
        </p>
      )}
    </div>
  );
}
