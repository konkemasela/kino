import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
