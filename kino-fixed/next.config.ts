import type { NextConfig } from "next";
import { ANIME_SERVERS, STREAM_SERVERS } from "./src/features/watch/servers";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Embed origins are derived from the server list so the CSP `frame-src`
 * can never drift out of sync with the mirrors the player actually uses.
 */
const embedOrigins = [
  ...new Set(
    [
      ...STREAM_SERVERS.map((s) => s.buildUrl("movie", "tt0111161", 278, 1, 1)),
      ...STREAM_SERVERS.map((s) => s.buildUrl("tv", "tt0903747", 1396, 1, 1)),
      ...ANIME_SERVERS.map((s) => s.buildUrl("anime", "52991", null, 1, 1, "sub")),
    ].map((u) => new URL(u).origin),
  ),
];

/**
 * Next.js injects inline bootstrap scripts, so script-src needs
 * 'unsafe-inline' unless a per-request nonce is used (proxy.ts).
 * Everything else is locked down: no plugins, no <base> hijacking, no
 * framing of KINO by other sites, and frames only from known origins.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob: https:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  `frame-src ${[
    ...embedOrigins,
    "https://www.youtube-nocookie.com",
    "https://www.google.com/recaptcha/",
    "https://recaptcha.google.com/recaptcha/",
  ].join(" ")}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ]),
];

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [".monkeycode-ai.live"],
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images.metahub.space" },
      { protocol: "https", hostname: "episodes.metahub.space" },
      { protocol: "https", hostname: "live.metahub.space" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "s4.anilist.co" },
      { protocol: "https", hostname: "archive.org" },
      { protocol: "https", hostname: "cdn.myanimelist.net" },
      { protocol: "https", hostname: "img1.ak.crunchyroll.com" },
    ],
  },
};

export default nextConfig;
