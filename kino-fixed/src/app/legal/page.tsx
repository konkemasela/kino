import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Scale } from "lucide-react";
import { LEGAL_DOCS } from "@/features/legal/docs";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Legal, Terms & Privacy",
  description:
    "Terms of Use, Privacy Policy, Cookies, Copyright & DMCA, Acceptable Use and more for KINO.",
};

const SHORT_VERSION = [
  "KINO is an index and interface. It does not host or serve any video files.",
  "Players, torrent indexes and catalogs belong to independent third parties, which we do not control or verify.",
  "You are responsible for following the laws where you live, including copyright law.",
  "No accounts, no ads and no analytics. Your history and watchlist stay in your browser.",
  "Rights holders can send takedown notices. We review credible ones and act on valid ones.",
  "Everything is provided as is, and we limit our liability as far as the law allows.",
];

export default function LegalHubPage() {
  return (
    <div className="mx-auto max-w-[1300px] px-5 pb-28 pt-32 md:px-10 md:pb-16 md:pt-40">
      <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
        <span className="h-px w-10 bg-acid" />
        The fine print
      </p>
      <h1 className="mt-4 font-display text-6xl tracking-[0.03em] uppercase md:text-8xl">
        Legal{" "}
        <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">
          &amp; terms
        </span>
      </h1>
      <p className="mt-5 flex max-w-2xl items-start gap-3 text-sm leading-relaxed text-fog">
        <Scale size={18} className="mt-0.5 shrink-0 text-acid" />
        Everything about how KINO works, what we promise, what we don’t, and how
        to reach us. Effective {SITE.effectiveDate} · version {SITE.version}.
      </p>

      <section className="mt-12 rounded-2xl border border-acid/25 bg-acid/5 p-6 md:p-8">
        <h2 className="font-display text-3xl tracking-[0.06em] uppercase">
          The short version
        </h2>
        <ul className="mt-4 grid gap-x-10 gap-y-3 text-[14px] leading-relaxed text-bone/85 md:grid-cols-2">
          {SHORT_VERSION.map((line) => (
            <li key={line} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-acid" />
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-fog">
          This summary is for convenience only. The full documents below are the
          ones that apply.
        </p>
      </section>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LEGAL_DOCS.map((doc, i) => (
          <Link
            key={doc.slug}
            href={`/legal/${doc.slug}`}
            className="group flex flex-col rounded-2xl border border-line bg-panel/50 p-6 transition-colors hover:border-acid/40 md:p-7"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-xl bg-acid/10 text-acid transition-colors group-hover:bg-acid group-hover:text-void">
                <doc.icon size={19} />
              </span>
              <ArrowUpRight
                size={18}
                className="text-fog transition-colors group-hover:text-acid"
              />
            </div>
            <span className="mt-5 font-editorial text-xs italic text-acid/70">
              §{String(i + 1).padStart(2, "0")} · {doc.minutes} min read
            </span>
            <h2 className="font-display text-3xl tracking-[0.06em] text-bone uppercase">
              {doc.title}
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-bone/65">
              {doc.summary}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex justify-center rounded-2xl border border-line bg-panel/50 p-6 md:p-8">
        <Link
          href="/"
          className="inline-block rounded-full bg-acid px-6 py-2.5 text-[11px] font-bold tracking-[0.2em] text-void uppercase transition-transform hover:scale-105"
        >
          Back to KINO
        </Link>
      </div>
    </div>
  );
}
