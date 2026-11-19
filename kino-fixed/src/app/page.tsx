import { WifiOff } from "lucide-react";
import Hero, { type HeroItem } from "@/features/catalog/components/hero";
import Rail, { RailItem } from "@/components/ui/rail";
import MediaCard from "@/features/catalog/components/media-card";
import ContinueWatching from "@/features/library/components/continue-watching";
import {
  getCatalog,
  getMeta,
  yearOfItem,
  type CatalogItem,
  type FullMeta,
} from "@/features/catalog/api";
import AnimeRail from "@/features/anime/components/anime-rail";

const value = (result: PromiseSettledResult<CatalogItem[]>): CatalogItem[] =>
  result.status === "fulfilled" ? result.value : [];

export default async function HomePage() {
  const results = await Promise.allSettled([
    getCatalog("movie"),
    getCatalog("tv"),
    getCatalog("movie", { genre: "Action" }),
    getCatalog("tv", { genre: "Comedy" }),
    getCatalog("movie", { genre: "Drama" }),
    getCatalog("movie", { genre: "Horror" }),
    getCatalog("tv", { genre: "Thriller" }),
    getCatalog("movie", { genre: "Romance" }),
    getCatalog("tv", { genre: "Sci-Fi" }),
    getCatalog("movie", { genre: "Animation" }),
  ]);

  const [
    topMovies,
    topSeries,
    actionMovies,
    comedySeries,
    dramaMovies,
    horrorMovies,
    thrillerSeries,
    romanceMovies,
    sciFiSeries,
    animatedMovies,
  ] = results.map(value);

  if (topMovies.length === 0 && topSeries.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <WifiOff size={28} className="text-fog" aria-hidden="true" />
        <h1 className="text-2xl font-semibold">Catalog unavailable</h1>
        <p className="max-w-md text-sm leading-6 text-fog">
          We couldn’t load the movie and series catalogs. Check your connection
          and try again.
        </p>
      </div>
    );
  }

  const heroSeeds = [topMovies[0], topSeries[0], topMovies[1], topSeries[1]].filter(Boolean);
  const heroMetas = await Promise.all(
    heroSeeds.map((item) => getMeta(item.type, item.id).catch(() => null)),
  );

  const heroItems: HeroItem[] = heroMetas
    .filter((meta): meta is FullMeta => Boolean(meta && (meta.backdrop || meta.poster)))
    .map((meta) => ({
      id: meta.id,
      mediaType: meta.type,
      title: meta.name,
      overview: meta.description,
      backdrop: (meta.backdrop ?? meta.poster)!,
      year: yearOfItem(meta.releaseInfo || meta.year),
      rating: meta.imdbRating,
    }));

  const topTen: CatalogItem[] = [];
  for (let index = 0; index < Math.max(topMovies.length, topSeries.length); index++) {
    if (topMovies[index]) topTen.push(topMovies[index]);
    if (topSeries[index]) topTen.push(topSeries[index]);
    if (topTen.length >= 10) break;
  }

  const genreRails = [
    { title: "Action", items: actionMovies, href: "/movies?genre=Action" },
    { title: "Comedy", items: comedySeries, href: "/series?genre=Comedy" },
    { title: "Drama", items: dramaMovies, href: "/movies?genre=Drama" },
    { title: "Horror", items: horrorMovies, href: "/movies?genre=Horror" },
    { title: "Thriller", items: thrillerSeries, href: "/series?genre=Thriller" },
    { title: "Romance", items: romanceMovies, href: "/movies?genre=Romance" },
    { title: "Sci-Fi", items: sciFiSeries, href: "/series?genre=Sci-Fi" },
  ].filter((rail) => rail.items.length > 0);

  return (
    <>
      <Hero items={heroItems} />

      <div className="space-y-12 py-12 md:space-y-16 md:py-16">
        {topTen.length > 0 && (
          <Rail title="Popular this week" href="/movies">
            {topTen.map((item, index) => (
              <RailItem key={`${item.type}-${item.id}`}>
                <MediaCard item={item} rank={index + 1} />
              </RailItem>
            ))}
          </Rail>
        )}

        <ContinueWatching />

        {topMovies.length > 0 && (
          <Rail title="Movies" href="/movies">
            {topMovies.slice(0, 12).map((item) => (
              <RailItem key={item.id}>
                <MediaCard item={item} />
              </RailItem>
            ))}
          </Rail>
        )}

        {topSeries.length > 0 && (
          <Rail title="Series" href="/series">
            {topSeries.slice(0, 12).map((item) => (
              <RailItem key={item.id}>
                <MediaCard item={item} />
              </RailItem>
            ))}
          </Rail>
        )}

        <AnimeRail />

        {animatedMovies.length > 0 && (
          <Rail title="Animation" href="/cartoons">
            {animatedMovies.slice(0, 12).map((item) => (
              <RailItem key={item.id}>
                <MediaCard item={item} />
              </RailItem>
            ))}
          </Rail>
        )}

        {genreRails.map((rail) => (
          <Rail key={rail.title} title={rail.title} href={rail.href}>
            {rail.items.slice(0, 12).map((item) => (
              <RailItem key={item.id}>
                <MediaCard item={item} />
              </RailItem>
            ))}
          </Rail>
        ))}
      </div>
    </>
  );
}
