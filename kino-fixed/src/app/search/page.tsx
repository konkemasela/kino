import { Suspense } from "react";
import type { Metadata } from "next";
import SearchView from "@/features/catalog/components/search-view";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1600px] px-5 pt-40 md:px-10">
          <div className="h-16 w-2/3 animate-pulse rounded-xl bg-panel" />
        </div>
      }
    >
      <SearchView />
    </Suspense>
  );
}
