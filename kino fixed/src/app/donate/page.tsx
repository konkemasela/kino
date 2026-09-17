import type { Metadata } from "next";
import {
  Ban,
  Coffee,
  CupSoda,
  ExternalLink,
  HeartHandshake,
  Popcorn,
  Rocket,
} from "lucide-react";

export const metadata: Metadata = { title: "Donate — keep KINO free" };

const DONATE_URL =
  process.env.NEXT_PUBLIC_DONATE_URL ?? "https://buymeacoffee.com/webgenza";

const TIERS = [
  {
    icon: Coffee,
    name: "A coffee",
    amount: "$3",
    body: "Covers a day of metadata requests for the whole site.",
  },
  {
    icon: Popcorn,
    name: "A movie night",
    amount: "$8",
    body: "Keeps the servers humming for a week of prime-time traffic.",
  },
  {
    icon: Rocket,
    name: "Server hero",
    amount: "$20",
    body: "Funds a full month of hosting single-handedly. Legend status.",
  },
];

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-28 pt-32 md:px-10 md:pb-16 md:pt-40">
      <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
        <span className="h-px w-10 bg-acid" />
        Support
      </p>
      <h1 className="mt-4 font-display text-6xl tracking-[0.03em] uppercase md:text-8xl">
        Keep KINO{" "}
        <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">
          free
        </span>
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-fog">
        No accounts, no subscriptions, no locked features — everything on this
        site is free forever. Hosting, bandwidth and metadata still cost real
        money, so if KINO saved you a good evening, you can tip the developer a
        coffee below.
      </p>

      <div className="mt-10 flex items-start gap-3 rounded-2xl border border-acid/30 bg-acid/5 p-5">
        <Ban size={18} className="mt-0.5 shrink-0 text-acid" />
        <p className="text-[13px] leading-relaxed text-bone/85">
          <span className="font-semibold text-acid">Free means free:</span>{" "}
          nothing on this site is, or ever will be, behind a payment. Donations
          change nothing about what you can watch — they just put fuel in the
          tank.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="group rounded-2xl border border-line bg-panel/50 p-6 transition-colors hover:border-acid/50 md:p-8"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-acid/10 text-acid transition-colors group-hover:bg-acid group-hover:text-void">
              <tier.icon size={22} />
            </span>
            <h2 className="mt-5 font-display text-2xl tracking-[0.06em] text-bone uppercase">
              {tier.name}
            </h2>
            <p className="font-display text-4xl tracking-[0.02em] text-acid">
              {tier.amount}
            </p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-fog">
              {tier.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-line bg-panel/40 p-8 text-center">
        <HeartHandshake size={30} className="text-acid" />
        <p className="max-w-md font-editorial text-xl italic leading-snug text-bone/90 md:text-2xl">
          Every rand, dollar and rupee goes straight into keeping the lights on.
        </p>
        <a
          href={DONATE_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex items-center gap-2.5 rounded-full bg-acid px-8 py-4 text-[12px] font-bold tracking-[0.2em] text-void uppercase shadow-[0_0_40px_rgba(215,246,55,0.3)] transition-transform hover:scale-105 active:scale-95"
        >
          <CupSoda size={16} />
          Buy Webgen a coffee
          <ExternalLink size={13} />
        </a>
        <p className="text-[11px] text-fog">
          Secure checkout handled externally — KINO never sees your card.
        </p>
      </div>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-fog">
        KINO is developed and maintained by Webgen — visit{" "}
        <a
          href="https://webgen-za.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="text-acid underline underline-offset-2"
        >
          webgen-za.vercel.app
        </a>{" "}
        for more info.
      </p>
    </div>
  );
}
