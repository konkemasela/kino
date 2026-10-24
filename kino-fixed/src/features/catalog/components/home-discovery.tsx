"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Dices, Eye, EyeOff, Heart, SlidersHorizontal, Sparkles } from "lucide-react";
import type { CatalogItem } from "@/features/catalog/api";
import MediaCard from "@/features/catalog/components/media-card";
import Rail, { RailItem } from "@/components/ui/rail";

const MOODS = [
  { label: "Adrenaline", genre: "Action" },
  { label: "Laugh", genre: "Comedy" },
  { label: "Get spooked", genre: "Horror" },
  { label: "Think", genre: "Mystery" },
  { label: "Feel something", genre: "Drama" },
  { label: "Escape reality", genre: "Fantasy" },
];
const GENRES = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"];
const DECADES = ["2020", "2010", "2000", "1990", "1980", "1970"];
const HIDDEN_KEY = "kino:hidden-titles";
const WATCHED_KEY = "kino:watched-titles";
const REMINDER_KEY = "kino:release-reminders";
const DIGEST_KEY = "kino:weekly-digest";

function readSet(key: string): string[] {
  try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; }
}

export default function HomeDiscovery({ movies, series }: { movies: CatalogItem[]; series: CatalogItem[] }) {
  const [hidden, setHidden] = useState<string[]>([]);
  const [watched, setWatched] = useState<string[]>([]);
  const [random, setRandom] = useState<CatalogItem | null>(null);
  const [mood, setMood] = useState("Action");
  const [decade, setDecade] = useState("2020");
  const [digest, setDigest] = useState(false);
  const [reminders, setReminders] = useState<string[]>([]);
  const [sections, setSections] = useState(["trending", "gems", "recent", "genres", "decades", "countries"]);
  const all = useMemo(() => [...movies, ...series].filter((item, i, arr) => arr.findIndex((x) => x.type === item.type && x.id === item.id) === i), [movies, series]);

  useEffect(() => {
    setHidden(readSet(HIDDEN_KEY)); setWatched(readSet(WATCHED_KEY)); setReminders(readSet(REMINDER_KEY));
    setDigest(localStorage.getItem(DIGEST_KEY) === "true");
    try { const saved = JSON.parse(localStorage.getItem("kino:home-sections") || "null"); if (Array.isArray(saved)) setSections(saved); } catch { /* use defaults */ }
  }, []);

  const visible = (items: CatalogItem[]) => items.filter((item) => !hidden.includes(`${item.type}:${item.id}`));
  const trending = visible(all).slice(0, 12);
  const gems = visible(all).filter((item) => (Number.parseFloat(item.imdbRating || "0") >= 6.5 && Number.parseFloat(item.imdbRating || "0") < 7.8)).slice(-12).reverse();
  const recent = visible(all).slice().sort((a, b) => Number.parseInt(b.releaseInfo.match(/\d{4}/)?.[0] || "0") - Number.parseInt(a.releaseInfo.match(/\d{4}/)?.[0] || "0")).slice(0, 12);
  const moodItems = visible(all).filter((item) => item.genres.some((g) => g.toLowerCase() === mood.toLowerCase())).slice(0, 12);
  const decadeItems = visible(all).filter((item) => (item.releaseInfo.match(/\d{4}/)?.[0] || "").startsWith(decade)).slice(0, 12);
  const recentlyWatched = visible(all).filter((item) => watched.includes(`${item.type}:${item.id}`));
  const watchedGenres = new Set(recentlyWatched.flatMap((item) => item.genres));
  const becauseYouWatched = visible(all).filter((item) => !watched.includes(`${item.type}:${item.id}`) && item.genres.some((genre) => watchedGenres.has(genre))).slice(0, 12);

  function toggleTitle(key: string, list: string[], setList: (next: string[]) => void, storageKey: string) {
    const next = list.includes(key) ? list.filter((v) => v !== key) : [...list, key];
    setList(next); localStorage.setItem(storageKey, JSON.stringify(next));
  }
  function setHomeSections(next: string[]) { setSections(next); localStorage.setItem("kino:home-sections", JSON.stringify(next)); }
  function section(title: string, id: string, accent: string, items: CatalogItem[]) {
    if (!sections.includes(id) || !items.length) return null;
    return <Rail key={id} title={title} accent={accent} href={id === "trending" ? "/movies" : undefined}>
      {items.slice(0, 12).map((item, i) => <RailItem key={`${item.type}:${item.id}`}><div className="relative"><MediaCard item={item} rank={id === "trending" ? i + 1 : undefined} /><div className="mt-2 flex gap-2"><button type="button" onClick={() => toggleTitle(`${item.type}:${item.id}`, hidden, setHidden, HIDDEN_KEY)} className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1.5 text-[10px] text-fog hover:text-bone" title="Hide this title"><EyeOff size={12}/> Hide</button><button type="button" onClick={() => toggleTitle(`${item.type}:${item.id}`, watched, setWatched, WATCHED_KEY)} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[10px] ${watched.includes(`${item.type}:${item.id}`) ? "border-acid/50 text-acid" : "border-line text-fog hover:text-bone"}`} title="Mark watched"><Eye size={12}/> {watched.includes(`${item.type}:${item.id}`) ? "Watched" : "Watched?"}</button><button type="button" onClick={() => toggleTitle(`${item.type}:${item.id}`, reminders, setReminders, REMINDER_KEY)} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[10px] ${reminders.includes(`${item.type}:${item.id}`) ? "border-acid/50 text-acid" : "border-line text-fog hover:text-bone"}`} title="Save a release reminder"><Heart size={12}/> Remind</button></div></div></RailItem>)}
    </Rail>;
  }

  return <div className="space-y-16">
    <section className="mx-auto max-w-[1600px] px-5 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-acid">Find your next watch</p><h2 className="mt-2 font-display text-4xl uppercase md:text-5xl">Pick your <span className="font-editorial italic normal-case text-outline">vibe</span></h2></div>
        <button onClick={() => setRandom(visible(all)[Math.floor(Math.random() * visible(all).length)] ?? null)} className="inline-flex items-center gap-2 rounded-full bg-acid px-5 py-3 text-xs font-bold uppercase tracking-wider text-void"><Dices size={16}/> Random pick</button>
      </div>
      {random && <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-acid/30 bg-panel p-4"><div><p className="text-[10px] uppercase tracking-widest text-acid">Your random pick</p><Link className="mt-1 block text-lg font-semibold hover:text-acid" href={`/${random.type === "tv" ? "tv" : "movie"}/${encodeURIComponent(random.id)}`}>{random.name}</Link><p className="mt-1 text-xs text-fog">{random.releaseInfo || "Year unknown"} · {random.type === "tv" ? "Series" : "Movie"}</p></div><button onClick={() => setRandom(null)} className="rounded-full border border-line px-3 py-2 text-xs text-fog">Dismiss</button></div>}
      <div className="mt-5 flex flex-wrap gap-2">{MOODS.map((item) => <button key={item.genre} onClick={() => setMood(item.genre)} className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${mood === item.genre ? "border-acid bg-acid text-void" : "border-line text-fog hover:text-bone"}`}>{item.label}</button>)}</div>
      {moodItems.length > 0 && <div className="mt-6"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-fog">Mood match · {mood}</p><div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">{moodItems.slice(0, 6).map((item) => <Link key={`${item.type}:${item.id}`} href={`/${item.type === "tv" ? "tv" : "movie"}/${encodeURIComponent(item.id)}`} className="min-w-36 max-w-36 text-sm font-semibold hover:text-acid">{item.poster && <img src={item.poster} alt="" loading="lazy" className="mb-2 aspect-[2/3] w-full rounded-xl object-cover"/>}{item.name}</Link>)}</div></div>}
    </section>

    <section className="mx-auto max-w-[1600px] px-5 md:px-10"><div className="mb-5 flex items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-fog">Make it yours</p><h2 className="mt-1 font-display text-3xl uppercase">Home sections</h2></div><SlidersHorizontal size={19} className="text-acid"/></div><div className="flex flex-wrap gap-2">{[["trending","Trending"],["gems","Hidden gems"],["recent","Recent releases"],["genres","Popular genres"],["decades","Decades"],["countries","Countries"]].map(([id,label])=><button key={id} onClick={() => setHomeSections(sections.includes(id) ? sections.filter((s) => s !== id) : [...sections,id])} className={`rounded-full border px-3 py-2 text-xs ${sections.includes(id) ? "border-acid/60 bg-acid/10 text-acid" : "border-line text-fog"}`}>{sections.includes(id) ? "✓ " : "+ "}{label}</button>)}</div></section>

    {section("Trending this week", "trending", "popular right now", trending)}
    {section("Hidden gems", "gems", "good ratings, less hype", gems)}
    {section("Recent releases", "recent", "newer titles in the catalog", recent)}
    {recentlyWatched.length > 0 && becauseYouWatched.length > 0 && <Rail title="Because you watched…" accent="more from your genres">{becauseYouWatched.map((item) => <RailItem key={`${item.type}:${item.id}`}><MediaCard item={item}/></RailItem>)}</Rail>}

    {sections.includes("genres") && <section className="mx-auto max-w-[1600px] px-5 md:px-10"><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-acid">Explore by category</p><h2 className="mt-2 font-display text-4xl uppercase">Popular genres</h2><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{GENRES.map((genre, i) => <Link key={genre} href={`/movies?genre=${encodeURIComponent(genre)}`} className="group flex min-h-24 items-end justify-between rounded-xl border border-line bg-gradient-to-br from-panel2 to-void p-4 transition-colors hover:border-acid/60"><span className="font-display text-xl uppercase">{genre}</span><span className="text-fog transition-transform group-hover:translate-x-1">↗</span></Link>)}</div></section>}

    {sections.includes("decades") && <section className="mx-auto max-w-[1600px] px-5 md:px-10"><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-acid">Time travel</p><h2 className="mt-2 font-display text-4xl uppercase">Explore a decade</h2><div className="mt-4 flex flex-wrap gap-2">{DECADES.map((d) => <button key={d} onClick={() => setDecade(d)} className={`rounded-full border px-5 py-2.5 text-sm ${decade === d ? "border-acid bg-acid text-void" : "border-line text-fog hover:text-bone"}`}>{d}s</button>)}</div>{decadeItems.length > 0 ? <div className="no-scrollbar mt-5 flex gap-4 overflow-x-auto pb-2">{decadeItems.slice(0, 8).map((item) => <Link key={`${item.type}:${item.id}`} href={`/${item.type === "tv" ? "tv" : "movie"}/${encodeURIComponent(item.id)}`} className="min-w-36 max-w-36 text-sm font-semibold hover:text-acid">{item.poster && <img src={item.poster} alt="" loading="lazy" className="mb-2 aspect-[2/3] w-full rounded-xl object-cover"/>}{item.name}</Link>)}</div> : <p className="mt-5 text-sm text-fog">No titles from this decade are in the current homepage sample.</p>}</section>}

    {sections.includes("countries") && <section className="mx-auto max-w-[1600px] px-5 md:px-10"><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-acid">Beyond Hollywood</p><h2 className="mt-2 font-display text-4xl uppercase">Explore by country</h2><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{Array.from(new Set(all.map((item) => item.country?.trim()).filter((country): country is string => Boolean(country)))).slice(0, 10).map((country) => <div key={country} className="rounded-xl border border-line bg-panel/50 p-4"><p className="font-semibold">{country}</p><p className="mt-1 text-xs text-fog">Titles in current catalog sample</p></div>)}</div>{!all.some((item) => item.country?.trim()) && <p className="mt-4 text-sm text-fog">Country information is not available in this catalog sample yet.</p>}</section>}

    {recentlyWatched.length > 0 && <Rail title="Marked watched" accent="your viewing log">{recentlyWatched.slice(0, 10).map((item) => <RailItem key={`${item.type}:${item.id}`}><MediaCard item={item}/></RailItem>)}</Rail>}
    <section className="mx-auto max-w-[1600px] px-5 md:px-10"><div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-panel/50 p-5"><div><p className="text-sm font-semibold">Weekly discovery digest</p><p className="mt-1 max-w-xl text-xs leading-relaxed text-fog">Opt in to save this preference for future digest support. This toggle does not send emails yet.</p></div><button onClick={() => { const next = !digest; setDigest(next); localStorage.setItem(DIGEST_KEY, String(next)); }} className={`rounded-full border px-4 py-2.5 text-xs font-bold ${digest ? "border-acid bg-acid text-void" : "border-line text-fog"}`}>{digest ? "✓ Opted in" : "Opt in"}</button></div><p className="mt-3 text-xs text-fog">{reminders.length ? `${reminders.length} title reminder${reminders.length === 1 ? "" : "s"} saved on this device.` : "No release reminders saved yet."} Reminders are stored locally; notifications require a future notification service.</p></section>
  </div>;
}
