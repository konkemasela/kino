import { SITE } from "@/lib/site-config";
import type { LegalDoc } from "../types";

export const disclaimer: LegalDoc = {
  slug: "disclaimer",
  title: "Disclaimer & Content Notice",
  kicker: "The fine print",
  summary:
    "What KINO does and does not do, what can go wrong with third-party players and torrents, and who owns what.",
  sections: [
    {
      id: "nature",
      title: "Nature of the service",
      body: [
        "KINO is a metadata discovery and search interface. It organises publicly available information about films, series and anime (posters, summaries, ratings, episode lists) and links to independent third-party services. It works like an index: it does not control, and accepts no responsibility for, what other parties make available.",
      ],
    },
    {
      id: "no-hosting",
      title: "No hosted content",
      body: [
        "KINO does not host, upload, store, cache, transmit or distribute any video files, and no media passes through its servers. Playback and downloads happen on third-party infrastructure run by unrelated parties, who are solely responsible for what they serve.",
      ],
    },
    {
      id: "third-party-players",
      title: "Third-party players: ads, pop-ups and malware",
      body: [
        "Players are provided by independent operators and are outside our control. They may show intrusive advertising, open pop-ups, attempt redirects, set cookies or, in the worst case, serve malicious software.",
      ],
      list: [
        "Keep the player sandbox switched on unless a mirror will not work without it.",
        "Use a reputable ad blocker and keep your browser and system up to date.",
        "Never install software, extensions or “codec” updates prompted by a player.",
        "Close any window you did not open and do not enter personal or payment details on third-party pages.",
      ],
      after: [
        "Sandboxing and a content security policy reduce risk, but cannot remove it.",
      ],
    },
    {
      id: "copyright-status",
      title: "Licensing status of content",
      body: [
        "We do not review or guarantee the licensing status of third-party content, and the availability of a title through a link or player does not mean it is lawfully available in your country. You are responsible for complying with copyright and licensing law where you live. Where possible, support creators through licensed services.",
      ],
    },
    {
      id: "torrents",
      title: "Torrent advisory",
      body: [
        "Magnet links and .torrent files in the torrent section come from public third-party indexes. BitTorrent is peer-to-peer, so your IP address is visible to other peers and to monitoring services. Depending on your jurisdiction, downloading or sharing copyrighted works without permission may result in civil or criminal liability, warnings from your internet provider, or loss of service.",
        "Files from torrents can contain malware. A VPN can hide your address from peers but is not a legal defence and does not make unlawful activity lawful. Use this feature only for material you own or that is licensed for distribution.",
      ],
    },
    {
      id: "accuracy",
      title: "Accuracy of information",
      body: [
        "Titles, summaries, images, ratings, release dates, cast lists, episode numbering and availability come from community-maintained third-party catalogs. They may be incomplete, outdated, wrong or contain spoilers. Ratings are third-party opinions, not recommendations or endorsements.",
      ],
    },
    {
      id: "health",
      title: "Viewing safety",
      body: [
        "Some titles contain flashing lights, patterns or intense scenes that can affect photosensitive viewers, or content unsuitable for children. Take regular breaks and check a title before watching if you are sensitive to such material.",
      ],
    },
    {
      id: "no-advice",
      title: "No professional advice",
      body: [
        "Information on KINO, including this notice and the guides, is general information only. It is not legal, security or other professional advice.",
      ],
    },
    {
      id: "trademarks",
      title: "Trademarks and attribution",
      body: [
        "All posters, artwork, titles, logos and trademarks belong to their owners. KINO claims no ownership of any referenced work and is not affiliated with, endorsed by or sponsored by any studio, distributor, network, streaming service or metadata provider.",
      ],
    },
    {
      id: "links",
      title: "External links",
      body: [
        "Links to other sites are provided for convenience. We do not control them and are not responsible for their content, accuracy, safety or privacy practices.",
      ],
    },
    {
      id: "warranty",
      title: "No warranty and user responsibility",
      body: [
        "The Service is provided “as is”, without warranties of any kind, to the extent allowed by law. Visitors are responsible for complying with the laws of their own jurisdiction and for their own devices, accounts and data.",
        `By continuing to use ${SITE.name} you acknowledge this notice together with the Terms of Use.`,
      ],
    },
  ],
};
