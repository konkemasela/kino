import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clapperboard, Tv } from "lucide-react";
import { getCatalog, getMeta, type MediaType } from "@/features/catalog/api";
import { mediaHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Release Calendar",
  description: "Explore upcoming movie and episode dates available in Kinooz metadata.",
};

type Release = { id: string; title: string; date: string; type: MediaType; href: string; detail: string };

function validFutureDate(value: string, today: string): string | null {
  // Only trust full calendar dates; a bare year is not an exact release date.
  const match = value.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (!match) return null;
  const date = match[1];
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date || date < today) return null;
  return date;
}

export default async function ReleasesPage() {
  const today = new Date().toISOString().slice(0, 10);
  let releases: Release[] = [];
  try {
    const [movies, series] = await Promise.all([getCatalog("movie"), getCatalog("tv")]);
    const candidates = [
      ...movies.slice(0, 12).map((item) => ({ ...item, type: "movie" as const })),
      ...series.slice(0, 12).map((item) => ({ ...item, type: "tv" as const })),
    ];
    const metas = await Promise.all(candidates.map(async (item) => {
      try { return { item, meta: await getMeta(item.type, item.id) }; }
      catch { return null; }
    }));
    for (const result of metas) {
      if (!result) continue;
      const { item, meta } = result;
      const movieDate = validFutureDate(meta.releaseInfo, today);
      if (movieDate) releases.push({ id: `${item.type}-${item.id}`, title: meta.name, date: movieDate, type: item.type, href: mediaHref(item.type, item.id), detail: item.type === "tv" ? "Series premiere" : "Movie release" });
      for (const episode of meta.videos ?? []) {
        const episodeDate = validFutureDate(episode.released, today);
        if (episodeDate) releases.push({ id: `${item.id}-${episode.id}`, title: meta.name, date: episodeDate, type: "tv", href: mediaHref("tv", item.id), detail: `S${episode.season} · E${episode.episode}: ${episode.name}` });
      }
    }
    releases = releases.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title)).filter((release, index, list) => list.findIndex((other) => other.id === release.id && other.date === release.date && other.detail === release.detail) === index).slice(0, 60);
  } catch {
    releases = [];
  }

  const grouped = releases.reduce<Record<string, Release[]>>((acc, release) => {
    const month = release.date.slice(0, 7);
    (acc[month] ??= []).push(release);
    return acc;
  }, {});
  const months = Object.keys(grouped).sort();
  const dateLabel = (value: string) => new Date(`${value}T12:00:00Z`).toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

  return <div className="mx-auto min-h-[65vh] max-w-[1200px] px-5 pb-24 pt-32 md:px-10 md:pt-40">
    <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em] text-acid"><span className="h-px w-10 bg-acid" />Plan your next watch</p>
    <h1 className="mt-4 font-display text-6xl uppercase tracking-[0.03em] md:text-8xl">Release <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">calendar</span></h1>
    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-fog md:text-base">Upcoming dates and episode information available from Kinooz’s community metadata source. Dates are shown only when the source provides a full date; listings may be incomplete or change.</p>
    <div className="mt-10 flex items-center gap-3 rounded-2xl border border-line bg-panel/50 p-4 text-xs leading-relaxed text-fog"><CalendarDays size={19} className="shrink-0 text-acid" /> Dates are metadata-based and are not independently verified. Always confirm release details with the official distributor.</div>
    {months.length ? <div className="mt-12 space-y-12">{months.map((month) => <section key={month}>
      <h2 className="mb-5 font-display text-3xl uppercase tracking-wider">{new Date(`${month}-15T12:00:00Z`).toLocaleDateString("en", { month: "long", year: "numeric", timeZone: "UTC" })}</h2>
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel/30">{grouped[month].map((release) => <Link key={release.id} href={release.href} className="flex items-center gap-4 p-4 transition-colors hover:bg-panel sm:gap-5 sm:p-5">
        <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl border border-line bg-void text-center"><span className="text-[9px] uppercase tracking-widest text-fog">{release.date.slice(5, 7)}</span><span className="font-display text-xl leading-none text-acid">{release.date.slice(8, 10)}</span></div>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-bone">{release.title}</p><p className="mt-1 truncate text-xs text-fog">{release.detail}</p><p className="mt-1 text-[10px] text-fog/70">{dateLabel(release.date)}</p></div>
        {release.type === "tv" ? <Tv size={17} className="shrink-0 text-fog" /> : <Clapperboard size={17} className="shrink-0 text-fog" />}
      </Link>)}</div>
    </section>)}</div> : <div className="mt-12 rounded-2xl border border-dashed border-line px-6 py-16 text-center"><CalendarDays size={32} className="mx-auto text-acid/70" /><h2 className="mt-4 font-display text-3xl uppercase">No confirmed dates found</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-fog">The current catalog did not return future titles with exact release dates. This calendar will populate when the metadata source provides upcoming dates.</p><Link href="/movies" className="mt-6 inline-flex rounded-full bg-acid px-5 py-3 text-xs font-bold uppercase tracking-wider text-void">Explore movies</Link></div>}
  </div>;
}
