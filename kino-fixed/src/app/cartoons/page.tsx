import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { getCatalog, type CatalogItem } from "@/features/catalog/api";
import Rail, { RailItem } from "@/components/ui/rail";
import MediaCard from "@/features/catalog/components/media-card";
import MediaGrid from "@/features/catalog/components/media-grid";

export const metadata: Metadata = { title: "Animation" };
export const revalidate = 3600;
const value = <T,>(result: PromiseSettledResult<T[]>): T[] => result.status === "fulfilled" ? result.value : [];

export default async function CartoonsPage() {
  const [moviesResult, seriesResult, familyResult, familySeriesResult] = await Promise.allSettled([
    getCatalog("movie", { genre: "Animation" }), getCatalog("tv", { genre: "Animation" }),
    getCatalog("movie", { genre: "Family" }), getCatalog("tv", { genre: "Family" }),
  ]);
  const movies = value(moviesResult);
  const series = value(seriesResult);
  const family = value(familyResult);
  const familySeries = value(familySeriesResult);
  const shown = new Set([...movies.slice(0, 18), ...series.slice(0, 18), ...family.slice(0, 18)].map((item) => item.id));
  const more = [...movies, ...series, ...family, ...familySeries].filter((item) => !shown.has(item.id) && !!item.poster);
  const unavailable = movies.length === 0 && series.length === 0 && family.length === 0 && more.length === 0;
  const renderCard = (item: CatalogItem) => <MediaCard item={item} />;

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <header className="mb-10 max-w-3xl"><p className="text-sm font-medium text-fog">Explore</p><h1 className="mt-2 text-3xl font-semibold text-bone sm:text-4xl md:text-5xl">Animation</h1><p className="mt-3 text-sm leading-6 text-fog">Animated films and series for every age.</p></header>
      <div className="space-y-12">
        {unavailable ? <div className="flex flex-col items-center gap-3 rounded-lg border border-line py-16 text-center"><WifiOff size={28} className="text-fog" /><p className="text-sm text-fog">Animation listings are temporarily unavailable. Please try again later.</p></div> : <>
          {movies.length > 0 && <Rail title="Animated films" href="/movies?genre=Animation">{movies.slice(0, 18).map((item) => <RailItem key={item.id}>{renderCard(item)}</RailItem>)}</Rail>}
          {series.length > 0 && <Rail title="Animated series" href="/series?genre=Animation">{series.slice(0, 18).map((item) => <RailItem key={item.id}>{renderCard(item)}</RailItem>)}</Rail>}
          {family.length > 0 && <Rail title="Family picks" href="/movies?genre=Family">{family.slice(0, 18).map((item) => <RailItem key={item.id}>{renderCard(item)}</RailItem>)}</Rail>}
          {more.length > 0 && <section><h2 className="mb-5 text-xl font-semibold text-bone">More animation</h2><MediaGrid>{more.map((item) => <div key={item.id}>{renderCard(item)}</div>)}</MediaGrid></section>}
        </>}
      </div>
    </div>
  );
}
