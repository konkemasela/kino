import Link from "next/link";
import { Apple, Globe, Monitor, ShieldCheck, Smartphone, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Browser safety guide" };
const GUIDES = [
  { title: "Desktop", icon: Monitor, recommendation: "Use a reputable browser content blocker.", details: ["Install extensions only from the browser’s official store.", "Keep the blocker’s default filter lists enabled.", "Close unexpected tabs and switch playback sources if needed."] },
  { title: "Android", icon: Smartphone, recommendation: "Choose a browser that supports trusted extensions.", details: ["Install the browser and extension from official app stores.", "Review permissions before enabling an extension.", "Use the browser’s built-in pop-up blocking options."] },
  { title: "iPhone and iPad", icon: Apple, recommendation: "Use Safari content-blocking settings.", details: ["Install a content blocker from the App Store.", "Enable it in Safari’s extension settings.", "Turn on Safari’s pop-up blocking option."] },
];

export default function AdblockGuidePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <header className="max-w-3xl"><p className="text-sm font-medium text-fog">Help</p><h1 className="mt-2 text-3xl font-semibold text-bone sm:text-4xl md:text-5xl">Safer playback</h1><p className="mt-3 flex items-start gap-2 text-sm leading-6 text-fog"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-acid" />Playback sources are operated by third parties. A browser content blocker can reduce pop-ups and unwanted redirects.</p></header>
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-line bg-panel p-4"><TriangleAlert size={18} className="mt-0.5 shrink-0 text-acid" /><p className="text-sm leading-6 text-fog">Do not install software, enable notifications, or share personal information because a playback page asks you to. Close unexpected pages and return to KINO.</p></div>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">{GUIDES.map((guide) => <section key={guide.title} className="rounded-xl border border-line bg-panel p-5"><span className="flex size-10 items-center justify-center rounded-lg bg-panel2 text-acid"><guide.icon size={19} /></span><h2 className="mt-4 text-lg font-semibold text-bone">{guide.title}</h2><p className="mt-2 text-sm font-medium text-bone/85">{guide.recommendation}</p><ol className="mt-4 space-y-3">{guide.details.map((detail, index) => <li key={detail} className="flex gap-3 text-sm leading-6 text-fog"><span className="text-acid">{index + 1}.</span>{detail}</li>)}</ol></section>)}</div>
      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-line bg-panel p-4 sm:flex-row sm:items-center"><Globe size={18} className="shrink-0 text-fog" /><p className="flex-1 text-sm text-fog">For information about privacy tools and file sharing, read our separate guide.</p><Link href="/guides/vpn" className="text-sm font-medium text-acid hover:underline">Privacy guide</Link></div>
    </div>
  );
}
