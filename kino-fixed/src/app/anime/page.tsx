import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { getAiringAnime, getAnimeMovies, getTrendingAnime, getUpcomingAnime, type AnimeItem } from "@/features/anime/api";
import AnimeTopTen from "@/features/anime/components/anime-top-ten";
import AnimeSearch from "@/features/anime/components/anime-search";
import Rail, { RailItem } from "@/components/ui/rail";
import MediaCard from "@/features/catalog/components/media-card";
import MediaGrid from "@/features/catalog/components/media-grid";

export const metadata: Metadata = { title: "Anime" };
export const revalidate = 3600;
const value = <T,>(result: PromiseSettledResult<T[]>): T[] => result.status === "fulfilled" ? result.value : [];

const card = (item: AnimeItem, subtitle?: string) => <MediaCard item={{ id: item.id, name: item.name, poster: item.poster, imdbRating: item.score, releaseInfo: item.year }} type="anime" badges={["SUB", "DUB"]} subtitle={subtitle} />;

export default async function AnimePage() {
  const [topResult, airingResult, upcomingResult, moviesResult] = await Promise.allSettled([getTrendingAnime(10), getAiringAnime(18), getUpcomingAnime(14), getAnimeMovies(14)]);
  const top = value(topResult);
  const airing = value(airingResult);
  const upcoming = value(upcomingResult);
  const movies = value(moviesResult);
  const unavailable = top.length === 0 && airing.length === 0 && upcoming.length === 0 && movies.length === 0;

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <header className="mb-8 max-w-3xl">
        <p className="text-sm font-medium text-fog">Explore</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-bone sm:text-4xl md:text-5xl">Anime</h1>
        <p className="mt-3 text-sm leading-6 text-fog">Browse popular and currently airing series, upcoming releases, and films.</p>
      </header>
      <AnimeSearch />
      <div className="mt-10 space-y-12 md:space-y-16">
        {unavailable ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-line py-16 text-center"><WifiOff size={28} className="text-fog" /><p className="text-sm text-fog">Anime listings are temporarily unavailable. Please try again later.</p></div>
        ) : <>
          {top.length > 0 && <AnimeTopTen items={top} />}
          {airing.length > 0 && <section><h2 className="mb-5 text-xl font-semibold text-bone">Airing now</h2><MediaGrid>{airing.map((item) => <div key={item.id}>{card(item, item.episodes ? `${item.episodes} episodes · Airing` : "Airing now")}</div>)}</MediaGrid></section>}
          {upcoming.length > 0 && <Rail title="Coming soon">{upcoming.map((item) => <RailItem key={item.id}>{card(item, item.year ? `Expected ${item.year}` : "Upcoming")}</RailItem>)}</Rail>}
          {movies.length > 0 && <Rail title="Anime films">{movies.map((item) => <RailItem key={item.id}>{card(item)}</RailItem>)}</Rail>}
        </>}
      </div>
    </div>
  );
}
