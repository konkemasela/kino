import Link from "next/link";
import type { Metadata } from "next";
import {
  Ban,
  FileWarning,
  Landmark,
  Magnet,
  Scale,
  ShieldQuestion,
  Stamp,
} from "lucide-react";

export const metadata: Metadata = { title: "Legal & Disclaimer" };

const SECTIONS = [
  {
    icon: Landmark,
    num: "01",
    title: "Nature of the service",
    body: "KINO is a metadata discovery and search interface. It organizes publicly available information about films, series and anime (posters, summaries, ratings, episode lists) and links to independent third-party services. KINO operates strictly as an index — similar to a search engine — and exercises no control over, and accepts no responsibility for, the content made available by external parties.",
  },
  {
    icon: Ban,
    num: "02",
    title: "No hosted content",
    body: "KINO does not host, upload, store, cache, transmit or distribute any video files. No media ever passes through KINO's servers. Playback and downloads take place entirely on third-party infrastructure operated by unrelated parties; those parties are solely responsible for the availability and legality of the material they serve.",
  },
  {
    icon: ShieldQuestion,
    num: "03",
    title: "DMCA & takedown",
    body: "Because KINO holds no files, there is nothing to remove on our side. Rights holders should direct takedown requests to the operator of the server that actually hosts the material. If you believe a link or metadata entry on KINO infringes your rights, contact us with the URL in question and proof of ownership — validated requests are removed from the index within 72 hours.",
  },
  {
    icon: Magnet,
    num: "04",
    title: "Torrent advisory",
    body: "Magnet links and .torrent files surfaced in the Torrent Vault are fetched from a public third-party index. BitTorrent is peer-to-peer: your IP address is visible to other peers in the swarm. Depending on your jurisdiction, downloading or sharing copyrighted works may constitute a civil or criminal offence. Use this feature only for content you own or that is licensed for distribution. KINO does not encourage piracy and accepts no liability for how visitors use magnet links.",
  },
  {
    icon: Stamp,
    num: "05",
    title: "Trademarks & attribution",
    body: "All posters, artwork, titles and trademarks belong to their respective owners. Metadata is provided by open community services (Cinemeta, Jikan/MyAnimeList). KINO claims no ownership of any referenced work and is not affiliated with, endorsed by, or sponsored by any studio, distributor or metadata provider.",
  },
  {
    icon: FileWarning,
    num: "06",
    title: "No warranty & user responsibility",
    body: "The service is provided “as is”, without warranties of any kind. Visitors are responsible for complying with the laws of their own jurisdiction. By continuing to use KINO you acknowledge and accept these terms in full.",
  },
];

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-28 pt-32 md:px-10 md:pb-16 md:pt-40">
      <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
        <span className="h-px w-10 bg-acid" />
        The fine print
      </p>
      <h1 className="mt-4 font-display text-6xl tracking-[0.03em] uppercase md:text-8xl">
        Legal{" "}
        <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">
          &amp; disclaimer
        </span>
      </h1>
      <p className="mt-5 flex max-w-xl items-start gap-3 text-sm leading-relaxed text-fog">
        <Scale size={18} className="mt-0.5 shrink-0 text-acid" />
        Short version: KINO is an index, not a host. We store no files, serve
        no streams, and link out to independent third parties.
      </p>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {SECTIONS.map((section) => (
          <article
            key={section.num}
            className="group rounded-2xl border border-line bg-panel/50 p-6 transition-colors hover:border-acid/40 md:p-8"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-11 items-center justify-center rounded-xl bg-acid/10 text-acid transition-colors group-hover:bg-acid group-hover:text-void">
                <section.icon size={19} />
              </span>
              <div>
                <span className="font-editorial text-xs italic text-acid/70">
                  §{section.num}
                </span>
                <h2 className="font-display text-2xl tracking-[0.08em] text-bone uppercase">
                  {section.title}
                </h2>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-bone/65">
              {section.body}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-acid/25 bg-acid/5 p-6 md:p-8">
        <p className="font-editorial text-lg italic leading-relaxed text-bone/85 md:text-xl">
          Kino is developed and maintained by Webgen — visit{" "}
          <a
            href="https://webgen-za.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="text-acid underline decoration-acid/40 underline-offset-4 hover:decoration-acid"
          >
            webgen-za.vercel.app
          </a>{" "}
          for more info.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-full bg-acid px-6 py-2.5 text-[11px] font-bold tracking-[0.2em] text-void uppercase transition-transform hover:scale-105"
        >
          Back to KINO
        </Link>
      </div>
    </div>
  );
}
