import { WifiOff } from "lucide-react";
import Hero, { type HeroItem } from "@/features/catalog/components/hero";
import Marquee from "@/components/ui/marquee";
import Rail, { RailItem } from "@/components/ui/rail";
import MediaCard from "@/features/catalog/components/media-card";
import ContinueWatching from "@/features/library/components/continue-watching";
import {
  getCatalog,
  getMeta,
  yearOfItem,
  type FullMeta,
} from "@/features/catalog/api";
import AnimeRail from "@/features/anime/components/anime-rail";

export default async function HomePage() {
  let rails;
  try {
    rails = await Promise.all([
      getCatalog("movie"),
      getCatalog("tv"),
      getCatalog("movie", { genre: "Action" }),
      getCatalog("tv", { genre: "Comedy" }),
      getCatalog("movie", { genre: "Horror" }),
      getCatalog("movie", { genre: "Animation" }),
    ]);
  } catch {
    rails = null;
  }

  if (!rails || rails[0].length === 0) {
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

  const [
    topMovies,
    topSeries,
    actionMovies,
    comedySeries,
    horrorMovies,
    animatedMovies,
  ] = rails;

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

  return (
    <>
      <Hero items={heroItems} />

      <Marquee
        items={[
          "Now streaming",
          "Curated premieres",
          "Multi-server playback",
          "Binge responsibly",
          "Zero sign-up",
          "Open metadata",
        ]}
      />

      <div className="space-y-20 py-20 md:space-y-24">
        <ContinueWatching />

        <Rail title="Top movies" accent="top ten right now" href="/movies">
          {topMovies.slice(0, 10).map((item, i) => (
            <RailItem key={item.id}>
              <MediaCard item={item} rank={i + 1} />
            </RailItem>
          ))}
        </Rail>

        <Rail title="Top series" accent="trending television" href="/series">
          {topSeries.slice(0, 14).map((item) => (
            <RailItem key={item.id}>
              <MediaCard item={item} />
            </RailItem>
          ))}
        </Rail>

        <Rail title="Adrenaline" accent="action cinema" href="/movies?genre=Action">
          {actionMovies.slice(0, 14).map((item) => (
            <RailItem key={item.id}>
              <MediaCard item={item} />
            </RailItem>
          ))}
        </Rail>

        <Rail title="Laugh track" accent="comedy series" href="/series?genre=Comedy">
          {comedySeries.slice(0, 14).map((item) => (
            <RailItem key={item.id}>
              <MediaCard item={item} />
            </RailItem>
          ))}
        </Rail>

        <Rail title="After dark" accent="horror picks" href="/movies?genre=Horror">
          {horrorMovies.slice(0, 14).map((item) => (
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
      </div>
    </>
  );
}
