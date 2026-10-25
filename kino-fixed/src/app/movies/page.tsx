import type { Metadata } from "next";
import DiscoverView from "@/features/catalog/components/discover-view";

export const metadata: Metadata = { title: "Movies" };

export default function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DiscoverView type="movie" searchParams={searchParams} />;
}
