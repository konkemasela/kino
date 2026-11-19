import Link from "next/link";
import { GraduationCap, ShieldAlert } from "lucide-react";
import { STREAM_SERVERS } from "@/features/watch/servers";

const LINKS = [
  { href: "/movies", label: "Movies" },
  { href: "/series", label: "Series" },
  { href: "/anime", label: "Anime" },
  { href: "/cartoons", label: "Animation" },
  { href: "/library", label: "Saved" },
  { href: "/settings", label: "Settings" },
  { href: "/search", label: "Search" },
  { href: "/legal", label: "Legal" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line pb-24 md:pb-0">
      <div className="mx-auto max-w-[1600px] px-5 py-8 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-lg">
            <Link href="/" className="text-sm font-semibold tracking-wide text-bone">KINO</Link>
            <p className="mt-2 text-xs leading-5 text-fog">
              KINO is a discovery interface. It does not host or store media files. Playback is provided by third-party embed servers.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="flex max-w-md flex-wrap gap-x-5 gap-y-2 text-xs text-fog">
            {LINKS.map((link) => <Link key={link.href} href={link.href} className="transition-colors hover:text-bone">{link.label}</Link>)}
          </nav>
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-line pt-4 text-xs text-fog sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2"><ShieldAlert size={14} className="mt-0.5 shrink-0" /> Metadata from community catalogs; streams are supplied by third-party servers.</p>
          <p className="flex items-center gap-2"><GraduationCap size={14} /> KINO © {new Date().getFullYear()} — educational purposes.</p>
        </div>
        <ul className="sr-only" aria-label="Available stream mirrors">{STREAM_SERVERS.map((server) => <li key={server.id}>{server.name}: {server.tagline}</li>)}</ul>
      </div>
    </footer>
  );
}
