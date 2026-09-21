import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import {
  getAnimeMovies,
  getSeasonalAnime,
  getTopAnime,
  getTrendingAnime,
  type AnimeItem,
} from "@/features/anime/api";
import Rail, { RailItem } from "@/components/ui/rail";
import MediaCard from "@/features/catalog/components/media-card";
import MediaGrid from "@/features/catalog/components/media-grid";
import AnimeSearch from "@/features/anime/components/anime-search";

export const metadata: Metadata = { title: "Anime" };
export const revalidate = 3600;

const value = <T,>(r: PromiseSettledResult<T[]>): T[] =>
  r.status === "fulfilled" ? r.value : [];

export default async function AnimePage() {
  const [trendingRes, seasonalRes, topRes, moviesRes] = await Promise.allSettled([
    getTrendingAnime(18),
    getSeasonalAnime(18),
    getTopAnime(24),
    getAnimeMovies(14),
  ]);

  const trending = value(trendingRes);
  const seasonal = value(seasonalRes);
  const top = value(topRes);
  const movies = value(moviesRes);
  const everythingFailed =
    trending.length === 0 &&
    seasonal.length === 0 &&
    top.length === 0 &&
    movies.length === 0;

  const card = (item: AnimeItem) => (
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
  );

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-32 md:px-10 md:pb-10 md:pt-40">
      <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
        <span className="h-px w-10 bg-acid" />
        Catalog — animation
      </p>
      <h1 className="mt-4 font-display text-6xl tracking-[0.03em] uppercase md:text-8xl">
        Anime{" "}
        <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">
          subbed &amp; dubbed
        </span>
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-fog">
        Every episode, one deck. Four gated mirrors with instant sub/dub
        switching — ranked by the AniList community.
      </p>

      <div className="mt-10">
        <AnimeSearch />
      </div>

      <div className="mt-16 space-y-20">
        {everythingFailed ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line py-20 text-center">
            <WifiOff size={34} className="text-acid/80" />
            <p className="max-w-sm text-sm leading-relaxed text-fog">
              The anime index is briefly unavailable. Search above still works —
              listings return shortly.
            </p>
          </div>
        ) : (
          <>
            {trending.length > 0 && (
              <Rail title="Trending" accent="right now">
                {trending.map((item) => (
                  <RailItem key={item.id}>{card(item)}</RailItem>
                ))}
              </Rail>
            )}

            {seasonal.length > 0 && (
              <Rail title="Airing" accent="this season">
                {seasonal.map((item) => (
                  <RailItem key={item.id}>{card(item)}</RailItem>
                ))}
              </Rail>
            )}

            {movies.length > 0 && (
              <Rail title="Films" accent="anime on the big screen">
                {movies.map((item) => (
                  <RailItem key={item.id}>{card(item)}</RailItem>
                ))}
              </Rail>
            )}

            {top.length > 0 && (
              <section>
                <h2 className="mb-8 flex items-baseline gap-3 font-display text-3xl tracking-[0.08em] uppercase md:text-4xl">
                  <span className="text-bone">Hall of fame</span>
                  <span className="font-editorial text-xl italic normal-case text-acid md:text-2xl">
                    highest rated of all time
                  </span>
                </h2>
                <MediaGrid>
                  {top.map((item) => (
                    <div key={item.id}>{card(item)}</div>
                  ))}
                </MediaGrid>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
