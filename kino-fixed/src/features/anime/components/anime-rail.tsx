import { getTrendingAnime } from "@/features/anime/api";
import Rail, { RailItem } from "@/components/ui/rail";
import MediaCard from "@/features/catalog/components/media-card";

/** Home-page anime rail. Fails silently if the index is unreachable. */
export default async function AnimeRail() {
  let items;
  try {
    items = await getTrendingAnime(14);
  } catch {
    return null;
  }
  if (items.length === 0) return null;

  return (
    <Rail title="Anime deck" accent="trending now" href="/anime">
      {items.map((item) => (
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
  );
}
