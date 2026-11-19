import Link from "next/link";
import { Eye, Globe2, KeyRound, Magnet, Scale, ShieldCheck, TriangleAlert, Wifi } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy and file-sharing guide" };
const CONTEXT = [
  { icon: Eye, title: "Peer-to-peer activity", text: "In a public peer-to-peer swarm, other participants may see the network address your client uses." },
  { icon: Wifi, title: "Network privacy", text: "A VPN routes traffic through another provider, but it does not make activity anonymous or remove legal responsibilities." },
  { icon: KeyRound, title: "Choose carefully", text: "Review a provider’s privacy policy, security practices, and independent audits before relying on its service." },
];
const CHECKS = ["Clear privacy policy and independent audits", "A kill switch and leak protection", "Explicit support for peer-to-peer traffic", "Understand the provider’s limits and logging practices"];

export default function VpnGuidePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <header className="max-w-3xl"><p className="text-sm font-medium text-fog">Help</p><h1 className="mt-2 text-3xl font-semibold text-bone sm:text-4xl md:text-5xl">Privacy and file sharing</h1><p className="mt-3 flex items-start gap-2 text-sm leading-6 text-fog"><Magnet size={17} className="mt-0.5 shrink-0 text-acid" />Peer-to-peer sharing differs from streaming. Learn what information may be visible before using a file-sharing network.</p></header>
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-ember/40 bg-ember/10 p-4"><Scale size={18} className="mt-0.5 shrink-0 text-ember" /><p className="text-sm leading-6 text-bone/85">Privacy tools do not grant rights to download copyrighted material. Follow the laws where you live and only access content you are authorized to use.</p></div>
      <section className="mt-8"><h2 className="text-xl font-semibold text-bone">What to know</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{CONTEXT.map((item) => <article key={item.title} className="rounded-xl border border-line bg-panel p-5"><item.icon size={19} className="text-acid" /><h3 className="mt-3 text-base font-semibold text-bone">{item.title}</h3><p className="mt-2 text-sm leading-6 text-fog">{item.text}</p></article>)}</div></section>
      <section className="mt-8 rounded-xl border border-line bg-panel p-5"><h2 className="flex items-center gap-2 text-xl font-semibold text-bone"><ShieldCheck size={19} className="text-acid" />Questions to ask a provider</h2><ul className="mt-4 grid gap-3 text-sm leading-6 text-fog sm:grid-cols-2">{CHECKS.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-acid" />{item}</li>)}</ul></section>
      <section className="mt-5 flex flex-col gap-3 rounded-xl border border-line bg-panel p-4 sm:flex-row sm:items-center"><Globe2 size={18} className="shrink-0 text-fog" /><p className="flex-1 text-sm text-fog">For browser safety and reducing unwanted pop-ups, see the browser safety guide.</p><Link href="/guides/adblock" className="text-sm font-medium text-acid hover:underline">Browser safety</Link></section>
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-fog"><TriangleAlert size={14} className="mt-0.5 shrink-0" />This page is general information, not legal or security advice.</p>
    </div>
  );
}
