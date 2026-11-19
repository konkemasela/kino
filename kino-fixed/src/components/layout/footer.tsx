import Link from "next/link";
import { GraduationCap, ShieldAlert } from "lucide-react";

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
    <footer className="border-t border-line pb-20 md:pb-0">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-lg">
            <Link href="/" className="text-sm font-bold tracking-wide text-bone">KINO</Link>
            <p className="mt-2 text-sm leading-6 text-fog">KINO helps you browse titles and keep track of what you watch. Media availability is provided by third parties.</p>
          </div>
          <nav aria-label="Footer navigation" className="flex max-w-md flex-wrap gap-x-5 gap-y-3 text-sm text-fog">
            {LINKS.map((link) => <Link key={link.href} href={link.href} className="transition-colors hover:text-bone">{link.label}</Link>)}
          </nav>
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-4 text-xs leading-5 text-fog sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2"><ShieldAlert size={14} className="mt-0.5 shrink-0" />Catalog information and playback are provided by third parties.</p>
          <p className="flex items-center gap-2"><GraduationCap size={14} />KINO © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
