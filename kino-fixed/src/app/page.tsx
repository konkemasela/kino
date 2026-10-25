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

const value = (r: PromiseSettledResult<CatalogItem[]>): CatalogItem[] =>
  r.status === "fulfilled" ? r.value : [];

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <WifiOff size={40} className="text-acid" />
        <h1 className="font-display text-5xl tracking-[0.08em] uppercase">
          Signal lost
        </h1>
        <p className="max-w-md text-sm text-fog">
          The community metadata catalogs could not be reached. Check your
          connection and reload.
        </p>
      </div>
    );
  }

  const heroSeeds = [
    topMovies[0],
    topSeries[0],
    topMovies[1],
    topSeries[1],
    topMovies[2],
    topSeries[2],
  ].filter(Boolean);

  const heroMetas = await Promise.all(
    heroSeeds.map((s) => getMeta(s.type, s.id).catch(() => null)),
  );

  const heroItems: HeroItem[] = heroMetas
    .filter((m): m is FullMeta => Boolean(m && (m.backdrop || m.poster)))
    .map((m) => ({
      id: m.id,
      mediaType: m.type,
      title: m.name,
      overview: m.description,
      backdrop: (m.backdrop ?? m.poster)!,
      year: yearOfItem(m.releaseInfo || m.year),
      rating: m.imdbRating,
    }));

  const topTen: CatalogItem[] = [];
  for (let i = 0; i < Math.max(topMovies.length, topSeries.length); i++) {
    if (topMovies[i]) topTen.push(topMovies[i]);
    if (topSeries[i]) topTen.push(topSeries[i]);
    if (topTen.length >= 10) break;
  }

  const genreRails = [
    { title: "Action", accent: "adrenaline", items: actionMovies, href: "/movies?genre=Action" },
    { title: "Comedy", accent: "laugh track", items: comedySeries, href: "/series?genre=Comedy" },
    { title: "Drama", accent: "slow burn", items: dramaMovies, href: "/movies?genre=Drama" },
    { title: "Horror", accent: "after dark", items: horrorMovies, href: "/movies?genre=Horror" },
    { title: "Thriller", accent: "edge of your seat", items: thrillerSeries, href: "/series?genre=Thriller" },
    { title: "Romance", accent: "heart first", items: romanceMovies, href: "/movies?genre=Romance" },
    { title: "Sci-Fi", accent: "future shock", items: sciFiSeries, href: "/series?genre=Sci-Fi" },
  ].filter((rail) => rail.items.length > 0);

  return (
    <>
      <Hero items={heroItems} />

      <div className="space-y-20 py-20 md:space-y-24">
        <Rail title="Top 10" accent="this week" href="/movies">
          {topTen.map((item, i) => (
            <RailItem key={`${item.type}-${item.id}`}>
              <MediaCard item={item} rank={i + 1} />
            </RailItem>
          ))}
        </Rail>

        <ContinueWatching />

        <Rail title="Movies" accent="big screen picks" href="/movies">
          {topMovies.slice(0, 14).map((item) => (
            <RailItem key={item.id}>
              <MediaCard item={item} />
            </RailItem>
          ))}
        </Rail>

        <Rail title="Series" accent="must-watch television" href="/series">
          {topSeries.slice(0, 14).map((item) => (
            <RailItem key={item.id}>
              <MediaCard item={item} />
            </RailItem>
          ))}
        </Rail>

        <AnimeRail />

        {animatedMovies.length > 0 && (
          <Rail title="Cartoons" accent="animation for all ages" href="/cartoons">
            {animatedMovies.slice(0, 14).map((item) => (
              <RailItem key={item.id}>
                <MediaCard item={item} />
              </RailItem>
            ))}
          </Rail>
        )}

        <section className="space-y-20 md:space-y-24">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
              <span className="h-px w-10 bg-acid" />
              Browse
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-[0.06em] uppercase md:text-5xl">
              All genres
            </h2>
          </div>

          {genreRails.map((rail) => (
            <Rail
              key={rail.title}
              title={rail.title}
              accent={rail.accent}
              href={rail.href}
            >
              {rail.items.slice(0, 14).map((item) => (
                <RailItem key={item.id}>
                  <MediaCard item={item} />
                </RailItem>
              ))}
            </Rail>
          ))}
        </section>
      </div>
    </>
  );
}
