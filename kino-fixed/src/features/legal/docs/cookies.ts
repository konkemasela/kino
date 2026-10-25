import { SITE } from "@/lib/site-config";
import type { LegalDoc } from "../types";

export const cookies: LegalDoc = {
  slug: "cookies",
  title: "Cookies & Local Storage",
  kicker: "What lives in your browser",
  summary:
    "Which small pieces of data KINO and its third parties store on your device, why, and how to remove them.",
  sections: [
    {
      id: "scope",
      title: "What this notice covers",
      body: [
        "This notice explains our use of cookies and similar technologies, mainly your browser’s local storage, which the Service uses to remember your choices. It supplements the Privacy Policy.",
      ],
    },
    {
      id: "essential",
      title: "Storage we use (essential)",
      body: [
        "These items make the Service work as you expect. They are used only on your device and are not sent to our servers.",
      ],
      list: [
        "Preferences (kino:settings, kino:server:*): theme, reduced motion, compact layout, autoplay, sandbox mode and mirror choices.",
        "Library (kino:history, kino:list): your recently watched titles and watchlist.",
        "Watch room (kino:watch-*, kino:party:*): nickname and local chat state.",
        "Security (kino:watch-captcha): a timestamp showing you recently passed the captcha, valid for 12 hours.",
        "Notice acknowledgement: remembers that you dismissed the site notice.",
      ],
    },
    {
      id: "third-party",
      title: "Cookies set by third parties",
      body: [
        "Some third parties can set their own cookies or storage when their content loads in your browser. We do not control these.",
      ],
      list: [
        "Google reCAPTCHA: sets cookies and uses device and interaction signals to tell humans from bots. It is used for security.",
        "Video mirrors: embedded players may set cookies, use storage or show advertising of their own.",
        "Trailers: trailers are loaded through YouTube’s privacy-enhanced mode, which limits cookies until you press play.",
        "Posters and images: image hosts see your request and may set no cookies, but receive your IP address.",
      ],
    },
    {
      id: "not-used",
      title: "What we do not use",
      body: [
        "We do not currently use advertising cookies, social-media tracking pixels, cross-site tracking or analytics cookies. If we add any, we will update this notice and ask for consent where the law requires it.",
      ],
    },
    {
      id: "duration",
      title: "How long storage lasts",
      body: [
        "Local storage has no automatic expiry: it stays until you delete it or your browser clears it. The captcha marker is treated as expired after 12 hours. Third-party cookies expire according to their own settings.",
      ],
    },
    {
      id: "manage",
      title: "Managing and deleting data",
      body: ["You are in control:"],
      list: [
        "Reset preferences in Settings.",
        "Clear history or the watchlist from My Space.",
        "Delete everything for this site with your browser’s “clear site data” or by browsing in a private window.",
        "Block third-party cookies and trackers with browser settings or a reputable ad blocker (see the ad-blocker guide on the site).",
      ],
      after: [
        "Deleting storage resets your preferences and removes your history and watchlist. It may also require you to pass the captcha again.",
      ],
    },
    {
      id: "consent",
      title: "Consent",
      body: [
        "Storage that is strictly necessary to provide features you request or to keep the Service secure is used without separate consent. Opening a video player means you ask your browser to contact that third party. You can avoid this by not opening players.",
      ],
    },
    {
      id: "updates",
      title: "Updates and contact",
      body: [
        `We may update this notice (effective ${SITE.effectiveDate}). Questions: ${SITE.email}.`,
      ],
    },
  ],
};
