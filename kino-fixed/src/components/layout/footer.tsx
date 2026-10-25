import Link from "next/link";
import { GraduationCap, ShieldAlert } from "lucide-react";
import { STREAM_SERVERS } from "@/features/watch/servers";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-panel/40 pb-24 md:pb-0">
      <div className="mx-auto max-w-[1600px] px-5 pt-16 md:px-10">
        <div className="grid gap-12 pb-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="max-w-md font-editorial text-2xl italic leading-snug text-fog">
              Every film you love,{" "}
              <span className="text-bone">one screen</span>, zero friction.
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-fog/80">
              KINO is a discovery interface. It does not host, upload or store
              any media files — playback is provided entirely by non-affiliated
              third-party embed servers.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[0.28em] text-fog uppercase">
              Explore
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/movies", label: "Movies" },
                { href: "/series", label: "TV Series" },
                { href: "/anime", label: "Anime" },
                { href: "/cartoons", label: "Cartoons" },
                { href: "/library", label: "My Space" },
                { href: "/settings", label: "Settings" },
                { href: "/search", label: "Search" },
                { href: "/donate", label: "Donate" },
                { href: "/guides/adblock", label: "Ad blocker guide" },
                { href: "/guides/vpn", label: "VPN for torrenting" },
                { href: "/legal", label: "Legal & DMCA" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-bone/80 transition-colors hover:text-acid"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[0.28em] text-fog uppercase">
              Gated Mirrors
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {STREAM_SERVERS.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-acid/70" />
                  <span className="text-bone/80">Mirror {s.name}</span>
                  <span className="text-xs text-fog/70">{s.tagline}</span>
                </li>
              ))}
              <li className="text-xs text-fog/70">
                Upstream identities are intentionally hidden. Switch mirrors
                anytime inside the player.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 text-xs text-fog/70 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-acid/80" />
            Metadata by the open Cinemeta community catalogs. No TMDB APIs, no
            keys — streams via third-party embed servers.
          </p>
          <p className="flex items-center gap-2">
            <GraduationCap size={14} />
            KINO © {new Date().getFullYear()} — built for educational purposes.
          </p>
        </div>
      </div>

      <div className="overflow-hidden pb-2" aria-hidden>
        <p className="select-none text-center font-display text-[26vw] leading-[0.8] tracking-[0.06em] text-bone/[0.045]">
          KINO
        </p>
      </div>
    </footer>
  );
}
