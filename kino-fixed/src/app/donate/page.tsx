import type { Metadata } from "next";
import { Coffee, CupSoda, ExternalLink, HeartHandshake, Popcorn, Rocket } from "lucide-react";

export const metadata: Metadata = { title: "Support KINO" };
const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL ?? "https://buymeacoffee.com/webgenza";
const OPTIONS = [
  { icon: Coffee, label: "Coffee", amount: "$3", detail: "A small way to support ongoing development." },
  { icon: Popcorn, label: "Movie night", amount: "$8", detail: "Help cover hosting and maintenance costs." },
  { icon: Rocket, label: "Supporter", amount: "$20", detail: "Make a larger contribution to the project." },
];

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-[1000px] px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <header className="max-w-3xl"><p className="text-sm font-medium text-fog">Support</p><h1 className="mt-2 text-3xl font-semibold text-bone sm:text-4xl md:text-5xl">Support KINO</h1><p className="mt-3 text-sm leading-6 text-fog">Contributions help with hosting and maintenance. KINO remains free to use, and donations do not unlock features.</p></header>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{OPTIONS.map((item) => <section key={item.label} className="rounded-xl border border-line bg-panel p-5"><span className="flex size-10 items-center justify-center rounded-lg bg-panel2 text-acid"><item.icon size={19} /></span><h2 className="mt-4 text-base font-semibold text-bone">{item.label}</h2><p className="mt-1 text-2xl font-semibold text-acid">{item.amount}</p><p className="mt-2 text-sm leading-6 text-fog">{item.detail}</p></section>)}</div>
      <section className="mt-5 flex flex-col items-start gap-4 rounded-xl border border-line bg-panel p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><HeartHandshake size={20} className="mt-0.5 shrink-0 text-acid" /><p className="max-w-xl text-sm leading-6 text-fog">Donations are optional. All titles and features remain available without payment.</p></div><a href={DONATE_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-acid px-4 text-sm font-semibold text-void"><CupSoda size={16} />Make a contribution<ExternalLink size={14} /></a></section>
      <p className="mt-3 text-xs text-fog">Payment is handled by the external provider. KINO does not receive your payment details.</p>
    </div>
  );
}
