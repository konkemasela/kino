import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FRANCHISES } from "@/features/catalog/franchises";
import { searchCinemeta } from "@/features/catalog/api";
import MediaGrid from "@/features/catalog/components/media-grid";
import MediaCard from "@/features/catalog/components/media-card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const franchise = FRANCHISES.find((item) => item.slug === slug);
  return { title: franchise ? `${franchise.name} collection` : "Franchise" };
}

export default async function FranchisePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const franchise = FRANCHISES.find((item) => item.slug === slug);
  if (!franchise) notFound();
  const results = await searchCinemeta(franchise.query).catch(() => []);
  const matching = results.filter((item) => item.name.toLowerCase().includes(franchise.query.toLowerCase().split(" ")[0])).slice(0, 30);
  return <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-32 md:px-10 md:pt-40"><Link href="/franchises" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fog hover:text-acid"><ArrowLeft size={14}/> All franchises</Link><p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-acid">Connected stories</p><h1 className="mt-3 font-display text-6xl uppercase md:text-8xl">{franchise.name}</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-fog">{franchise.description}</p><div className="mt-10">{matching.length ? <MediaGrid>{matching.map((item) => <MediaCard key={`${item.type}:${item.id}`} item={item}/>)}</MediaGrid> : <p className="rounded-2xl border border-dashed border-line py-16 text-center text-sm text-fog">No matching titles were returned by the catalog right now.</p>}</div></div>;
}
