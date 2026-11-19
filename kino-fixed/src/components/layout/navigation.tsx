"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bookmark, Film, House, Menu, Palette, Search, Settings2, Swords, Tv, X } from "lucide-react";
import SearchOverlay from "@/components/layout/search-overlay";
import ThemeToggle from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", icon: House },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/series", label: "Series", icon: Tv },
  { href: "/anime", label: "Anime", icon: Swords },
  { href: "/cartoons", label: "Animation", icon: Palette },
  { href: "/library", label: "Saved", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const openSearch = () => { setMenuOpen(false); setSearchOpen(true); };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] border-b border-line bg-void/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <Link href="/" aria-label="KINO home" className="flex h-11 w-[112px] shrink-0 items-center sm:w-[128px]">
            <Image src="/kino-logo.png" alt="KINO" width={256} height={72} priority sizes="128px" className="block h-auto max-h-9 w-full object-contain object-left" />
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex xl:gap-7">
            {ITEMS.slice(0, 5).map((item) => (
              <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn("whitespace-nowrap text-sm transition-colors hover:text-bone", isActive(pathname, item.href) ? "text-bone" : "text-fog")}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link href="/library" aria-label="Saved titles" className="hidden size-10 items-center justify-center rounded-md text-fog transition-colors hover:bg-panel2 hover:text-bone sm:flex"><Bookmark size={18} /></Link>
            <Link href="/settings" aria-label="Settings" className="hidden size-10 items-center justify-center rounded-md text-fog transition-colors hover:bg-panel2 hover:text-bone sm:flex"><Settings2 size={18} /></Link>
            <button type="button" onClick={openSearch} aria-label="Search" className="flex size-10 items-center justify-center rounded-md text-fog transition-colors hover:bg-panel2 hover:text-bone"><Search size={18} /></button>
            <div className="hidden sm:block"><ThemeToggle withLabel={false} /></div>
            <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="flex size-10 items-center justify-center rounded-md text-fog transition-colors hover:bg-panel2 hover:text-bone lg:hidden">
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-[75] bg-black/60 lg:hidden" />
          <nav aria-label="Mobile navigation" className="fixed inset-x-0 top-[68px] z-[80] max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-b border-line bg-void px-4 py-3 sm:px-6 lg:hidden">
            {ITEMS.map((item) => (
              <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn("flex items-center gap-3 border-b border-line py-3.5 text-sm last:border-0", isActive(pathname, item.href) ? "text-bone" : "text-fog")}>
                <item.icon size={17} />{item.label}
              </Link>
            ))}
            <div className="py-3"><ThemeToggle /></div>
          </nav>
        </>
      )}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
