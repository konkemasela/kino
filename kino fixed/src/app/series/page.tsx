import type { Metadata } from "next";
import DiscoverView from "@/features/catalog/components/discover-view";

export const metadata: Metadata = { title: "TV Series" };

export default function SeriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DiscoverView type="tv" searchParams={searchParams} />;
}
