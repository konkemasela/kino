import { SITE } from "@/lib/site-config";
import type { LegalDoc } from "../types";

export const privacy: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  kicker: "What we know about you",
  summary:
    "No accounts, no ads, no analytics. This explains the little data that is involved, and who else sees it when you press play.",
  sections: [
    {
      id: "summary",
      title: "Plain-language summary",
      body: ["The short version of how KINO handles your data:"],
      list: [
        "There are no accounts. We do not ask for your name, email or password.",
        "Your history, watchlist and settings live in your own browser, not on our servers.",
        "We do not run advertising or analytics trackers, and we do not sell personal data.",
        "Our hosting provider necessarily processes your IP address and request details to deliver the site.",
        "When you open a video player or complete the captcha, that third party receives data directly from your browser. That is outside our control and is explained below.",
      ],
    },
    {
      id: "controller",
      title: "Who is responsible",
      body: [
        `The operator of ${SITE.name} (${SITE.operator}) is the controller of personal data handled by the Service itself. Contact: ${SITE.email}.`,
        "Third parties that your browser connects to (video mirrors, Google reCAPTCHA, image and trailer hosts, donation platforms) act as independent controllers of the data they receive.",
      ],
    },
    {
      id: "collect",
      title: "What data is involved",
      body: ["We group the data into five categories."],
      list: [
        "Stored on your device: preferences, watch history, watchlist, chosen mirrors, a watch-room nickname, local chat messages and a captcha pass marker (full list in the next section).",
        "Request data processed by our hosting: IP address, browser and device type, pages requested, referrer and timestamps. This is standard for any website and is used to deliver, secure and debug the Service.",
        "Search and lookup data: the text you search for, and title identifiers you open, are sent to our servers and forwarded to metadata providers (and, for torrent lookups, to the torrent index) to fetch results.",
        "Captcha data: when you complete Google reCAPTCHA, Google receives information such as your IP address, browser details, cookies and interaction signals, as described in Google’s own policies.",
        "Data your browser sends to third parties: when a player, poster image, trailer or script loads from another provider, that provider receives your IP address and request details directly.",
      ],
    },
    {
      id: "not-collected",
      title: "What we do not collect",
      body: [
        "We do not collect payment details (donations are handled by a third-party platform), government IDs, precise location, contacts, microphone or camera data. We do not currently use advertising cookies, cross-site tracking or analytics. If that ever changes, we will update this policy and the Cookies notice first.",
      ],
    },
    {
      id: "local-storage",
      title: "Data stored in your browser",
      body: [
        "The Service uses your browser’s local storage for the following. None of it is sent to us.",
      ],
      list: [
        "kino:settings: theme, motion, layout, autoplay, sandbox and mirror preferences.",
        "kino:server:movie, :tv, :anime: your last chosen mirrors.",
        "kino:history: recently watched titles and episode (capped at 24 entries).",
        "kino:list: your watchlist (capped at 500 entries).",
        "kino:watch-nickname:*, kino:watch-chat:*, kino:party:*: nickname and local chat or party state.",
        "kino:watch-captcha: the time you last passed the captcha (valid for 12 hours).",
        "Notice acknowledgement: whether you dismissed the site notice.",
      ],
      after: [
        "Your viewing history can reveal sensitive information about you. Because it stays on your device, anyone with access to that browser can see it. Use private browsing or the delete options in Settings and My Space on shared devices.",
      ],
    },
    {
      id: "use",
      title: "How we use data",
      body: ["We use data only to:"],
      list: [
        "deliver pages, search results and catalog information;",
        "remember your preferences and library on your device;",
        "protect the Service against abuse, fraud and attacks (captcha, rate limiting, security logs);",
        "diagnose faults and keep the Service running;",
        "respond to messages, takedown notices and privacy requests;",
        "comply with law and defend legal claims.",
      ],
    },
    {
      id: "legal-bases",
      title: "Legal bases (EEA, UK and similar laws)",
      body: [
        "Where laws such as the GDPR or UK GDPR apply, we rely on: legitimate interests (running, securing and improving the Service, with minimal data); your consent where we ask for it or where you choose to load a third-party player or complete the captcha; compliance with legal obligations; and, where relevant, performance of the agreement formed by the Terms.",
      ],
    },
    {
      id: "sharing",
      title: "Who receives data",
      body: [
        "We do not sell personal data. Data reaches the following kinds of recipients.",
      ],
      list: [
        "Hosting and infrastructure provider: processes request data on our behalf to serve the site.",
        "Metadata providers (for example community catalog and anime database services): receive the search terms or identifiers we look up, from our servers.",
        "Torrent index operators: receive a title identifier when you open the torrent section, from our servers.",
        "Google (reCAPTCHA): receives captcha data directly from your browser.",
        "Video mirror operators: receive your IP address and request details directly from your browser when a player loads.",
        "Image and trailer hosts: receive request details when posters, thumbnails or trailers load.",
        "Donation platform: processes any donation you make, under its own terms.",
        "Authorities and advisers: where legally required, or to protect rights and safety.",
      ],
    },
    {
      id: "embeds",
      title: "Third-party players and your IP address",
      body: [
        "Video players are loaded from independent providers inside your browser. Those providers see your IP address and device details, can set their own cookies, may run advertising and may use tracking. We cannot see or control what they do. By default we ask your browser not to send our page address as a referrer to them, and we run players in a restricted sandbox when you leave that setting on, but this reduces rather than removes exposure.",
        "If this concerns you, consider a reputable ad blocker, a VPN, and keeping the player sandbox switched on. See the guides on the site.",
      ],
    },
    {
      id: "torrents",
      title: "Torrent features",
      body: [
        "The torrent section shows magnet links and .torrent files from public indexes. BitTorrent is peer-to-peer: when you download or share through it, your IP address is visible to other peers and often to monitoring services. Depending on where you live, downloading or sharing copyrighted works without permission can lead to legal consequences. We do not see or log what you download with your own client.",
      ],
    },
    {
      id: "transfers",
      title: "International transfers",
      body: [
        "Our hosting and the third parties above may process data in countries other than yours, including the United States. Where required, transfers rely on mechanisms such as adequacy decisions or standard contractual clauses chosen by those providers.",
      ],
    },
    {
      id: "retention",
      title: "How long data is kept",
      body: [
        "We do not keep our own database of visitors. Hosting and security logs are kept by the hosting provider for the period set in its policies. Short-lived request counters used for rate limiting live in server memory and expire within minutes. Data in your browser stays until you delete it. Messages sent to us are kept as long as needed to respond and for record-keeping, then deleted.",
      ],
    },
    {
      id: "security",
      title: "Security",
      body: [
        "We use measures such as HTTPS, security headers, a restrictive content security policy, request validation, rate limiting and sandboxed players. No system is perfectly secure, and we cannot guarantee the security of third-party services. See the Contact page to report a vulnerability.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      body: [
        "Depending on where you live (for example under the GDPR, UK GDPR, CCPA/CPRA, POPIA, LGPD and similar laws), you may have the right to access, correct, delete or restrict your personal data, to object to processing, to data portability, to withdraw consent, and to complain to a regulator. You will not be treated worse for exercising these rights.",
        `Because we hold almost no identifiable data about you and have no accounts, most of your data is on your own device, where you can delete it yourself (Settings → reset, My Space → clear, or your browser’s “clear site data”). For anything else, write to ${SITE.email}. We may need to verify who you are, and we will respond within the time required by law.`,
        "We do not “sell” or “share” personal data for cross-context behavioural advertising as those terms are used in US state privacy laws.",
      ],
    },
    {
      id: "children",
      title: "Children",
      body: [
        "The Service is not directed at children under 13, and we do not knowingly collect their personal data. If you believe a child has given us personal information, contact us and we will delete it. Parents should supervise minors, since third-party players may show unsuitable material.",
      ],
    },
    {
      id: "signals",
      title: "Do Not Track and Global Privacy Control",
      body: [
        "We do not track you across sites, so there is nothing to opt out of on our side. We treat browser privacy signals such as Global Privacy Control as a valid request not to sell or share personal data, which we do not do anyway. Third parties that load in the player may handle these signals differently.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: [
        `We may update this policy as the Service changes. The effective date (${SITE.effectiveDate}, version ${SITE.version}) shows the latest revision.`,
      ],
    },
    {
      id: "contact",
      title: "Contact and complaints",
      body: [
        `Privacy questions and requests: ${SITE.email}. If you are unhappy with our response, you can complain to your local data protection authority.`,
      ],
    },
  ],
};
