import Link from "next/link";
import { ArrowUpRight, Scale } from "lucide-react";
import type { Metadata } from "next";
import { LEGAL_DOCS } from "@/features/legal/docs";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = { title: "Legal and privacy", description: "KINO terms, privacy information, cookies, copyright and contact details." };
const SUMMARY = [
  "KINO provides a catalog and browsing interface; it does not host video files.",
  "Catalogs, players and other services are operated by independent third parties.",
  "You are responsible for following the laws that apply where you live.",
  "Your saved titles and watch history are kept in this browser.",
  "Rights holders can contact us through the reporting details in the documents.",
  "The service is provided as available; read the full documents for details.",
];

export default function LegalHubPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <header className="max-w-3xl"><p className="text-sm font-medium text-fog">Information</p><h1 className="mt-2 text-3xl font-semibold text-bone sm:text-4xl md:text-5xl">Legal and privacy</h1><p className="mt-3 flex items-start gap-2 text-sm leading-6 text-fog"><Scale size={17} className="mt-0.5 shrink-0 text-acid" />How KINO works and how your information is handled. Effective {SITE.effectiveDate} · version {SITE.version}.</p></header>
      <section className="mt-8 rounded-xl border border-line bg-panel p-5 sm:p-6"><h2 className="text-lg font-semibold text-bone">At a glance</h2><ul className="mt-4 grid gap-3 text-sm leading-6 text-fog sm:grid-cols-2">{SUMMARY.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-acid" />{item}</li>)}</ul><p className="mt-4 text-xs leading-5 text-fog">This is a short summary. The full documents below contain the applicable terms.</p></section>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{LEGAL_DOCS.map((doc) => <Link key={doc.slug} href={`/legal/${doc.slug}`} className="group rounded-xl border border-line bg-panel p-5 transition-colors hover:border-acid/50"><div className="flex items-center justify-between"><span className="flex size-10 items-center justify-center rounded-lg bg-panel2 text-acid"><doc.icon size={18} /></span><ArrowUpRight size={17} className="text-fog transition-colors group-hover:text-acid" /></div><h2 className="mt-4 text-lg font-semibold text-bone">{doc.title}</h2><p className="mt-2 text-sm leading-6 text-fog">{doc.summary}</p><p className="mt-3 text-xs text-fog">{doc.minutes} min read</p></Link>)}</div>
    </div>
  );
}
