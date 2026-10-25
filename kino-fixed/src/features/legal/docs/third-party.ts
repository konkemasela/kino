import { SITE } from "@/lib/site-config";
import type { LegalDoc } from "../types";

export const thirdParty: LegalDoc = {
  slug: "third-party",
  title: "Third-Party Services & Attribution",
  kicker: "Who else is in the room",
  summary:
    "The kinds of outside services KINO relies on, what each can see, and the credits we owe.",
  sections: [
    {
      id: "overview",
      title: "Overview",
      body: [
        "KINO is built on top of independent services. We describe them here by category because providers can change without notice. The list is informational, and each provider’s own terms and privacy policy govern its service.",
      ],
    },
    {
      id: "metadata",
      title: "Catalog and metadata sources",
      body: [
        "Titles, posters, summaries, ratings and episode lists come from open community catalogs, including the Cinemeta service (a Stremio community project) for movies and series, and the Jikan (MyAnimeList) and AniList databases for anime.",
      ],
      list: [
        "These calls are made from our servers, so providers see our server’s address and the search terms or identifiers we send.",
        "Artwork is shown for identification and belongs to its rights holders.",
        "These sources are community-run and can be incomplete or wrong.",
      ],
    },
    {
      id: "players",
      title: "Video players (mirrors)",
      body: [
        "Playback is delivered by independent embed providers. We show mirrors under codenames, and their operators are unaffiliated with KINO. When a player loads, that provider receives your IP address and browser details directly and may set cookies or show ads. We do not control, endorse or verify them.",
      ],
    },
    {
      id: "torrent-indexes",
      title: "Torrent indexes",
      body: [
        "Torrent listings come from public third-party indexes. Our servers query them with a title identifier. Downloading happens in your own torrent client, outside KINO.",
      ],
    },
    {
      id: "captcha",
      title: "Google reCAPTCHA",
      body: [
        "We use Google reCAPTCHA to deter automated abuse. Its use is subject to Google’s Privacy Policy and Terms of Service. reCAPTCHA collects hardware and software information, such as device and application data, and the results of integrity checks, and sends them to Google for analysis.",
      ],
    },
    {
      id: "trailers",
      title: "Trailers and images",
      body: [
        "Trailers are embedded from YouTube using its privacy-enhanced mode. Posters and thumbnails are loaded from image hosts used by the catalogs. Each receives your request details when its content loads.",
      ],
    },
    {
      id: "hosting",
      title: "Hosting and delivery",
      body: [
        "The Service runs on a third-party hosting and content-delivery platform that processes request data to serve the site, as described in the Privacy Policy.",
      ],
    },
    {
      id: "donations",
      title: "Donation platform",
      body: [
        "Donations are handled by an external platform. Payment and personal details are processed there, not by KINO.",
      ],
    },
    {
      id: "open-source",
      title: "Open-source software and fonts",
      body: [
        "KINO is built with open-source software including Next.js, React, Tailwind CSS, Framer Motion and Lucide icons, each used under its own licence (generally MIT or ISC). Typefaces used include Bebas Neue, Manrope and Instrument Serif, which are distributed under open font licences.",
      ],
    },
    {
      id: "non-affiliation",
      title: "No affiliation",
      body: [
        `${SITE.name} is not affiliated with, endorsed or sponsored by any provider named or described on this page, or by any studio, distributor or streaming service.`,
      ],
    },
    {
      id: "changes",
      title: "Changes",
      body: [
        "We may add, replace or remove providers at any time and will update this page and the Privacy Policy when the data involved materially changes. If we add a source with attribution requirements, we will credit it here and where it is required.",
      ],
    },
  ],
};
