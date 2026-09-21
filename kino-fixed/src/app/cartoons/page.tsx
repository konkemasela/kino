import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { getCatalog, type CatalogItem } from "@/features/catalog/api";
import Rail, { RailItem } from "@/components/ui/rail";
import MediaCard from "@/features/catalog/components/media-card";
import MediaGrid from "@/features/catalog/components/media-grid";

export const metadata: Metadata = { title: "Cartoons & Animation" };
export const revalidate = 3600;

const value = <T,>(r: PromiseSettledResult<T[]>): T[] =>
  r.status === "fulfilled" ? r.value : [];

export default async function CartoonsPage() {
  const [moviesRes, seriesRes, familyRes, adventureRes] =
    await Promise.allSettled([
      getCatalog("movie", { genre: "Animation" }),
      getCatalog("tv", { genre: "Animation" }),
      getCatalog("movie", { genre: "Family" }),
      getCatalog("tv", { genre: "Family" }),
    ]);

  const movies = value(moviesRes);
  const series = value(seriesRes);
  const family = value(familyRes);
  const familySeries = value(adventureRes);

  // Everything not already shown in the rails above, deduped for the grid.
  const shown = new Set(
    [...movies.slice(0, 18), ...series.slice(0, 18), ...family.slice(0, 18)].map(
      (m) => m.id,
    ),
  );
  const more = [...movies, ...series, ...family, ...familySeries].filter(
    (m) => !shown.has(m.id) && !!m.poster,
  );
  const empty =
    movies.length === 0 &&
    series.length === 0 &&
    family.length === 0 &&
    more.length === 0;

  const card = (item: CatalogItem) => <MediaCard item={item} />;

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-32 md:px-10 md:pb-10 md:pt-40">
      <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
        <span className="h-px w-10 bg-acid" />
        Catalog — cartoons
      </p>
      <h1 className="mt-4 font-display text-6xl tracking-[0.03em] uppercase md:text-8xl">
        Cartoons{" "}
        <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">
          &amp; animation
        </span>
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-fog">
        Pixar to prime-time, Saturday mornings to studio epics — the full
        animated catalog, streaming on the same gated mirrors.
      </p>

      <div className="mt-16 space-y-20">
        {empty ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line py-20 text-center">
            <WifiOff size={34} className="text-acid/80" />
            <p className="max-w-sm text-sm leading-relaxed text-fog">
              The animation catalog is briefly unavailable. Try again shortly.
            </p>
          </div>
        ) : (
          <>
            {movies.length > 0 && (
              <Rail title="Animated" accent="feature films" href="/movies?genre=Animation">
                {movies.slice(0, 18).map((item) => (
                  <RailItem key={item.id}>{card(item)}</RailItem>
                ))}
              </Rail>
            )}

            {series.length > 0 && (
              <Rail title="Toon" accent="series & specials" href="/series?genre=Animation">
                {series.slice(0, 18).map((item) => (
                  <RailItem key={item.id}>{card(item)}</RailItem>
                ))}
              </Rail>
            )}

            {family.length > 0 && (
              <Rail title="Family" accent="watch with everyone" href="/movies?genre=Family">
                {family.slice(0, 18).map((item) => (
                  <RailItem key={item.id}>{card(item)}</RailItem>
                ))}
              </Rail>
            )}

            {more.length > 0 && (
              <section>
                <h2 className="mb-8 flex items-baseline gap-3 font-display text-3xl tracking-[0.08em] uppercase md:text-4xl">
                  <span className="text-bone">Deep cuts</span>
                  <span className="font-editorial text-xl italic normal-case text-acid md:text-2xl">
                    more animation
                  </span>
                </h2>
                <MediaGrid>
                  {more.map((item) => (
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
