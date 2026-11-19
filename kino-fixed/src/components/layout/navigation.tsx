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

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] border-b border-line bg-void/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-5 md:px-10">
          <Link href="/" aria-label="KINO home" className="shrink-0">
            <Image src="/kino-logo.png" alt="KINO" width={96} height={30} priority className="h-auto w-20 object-contain" />
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
            {ITEMS.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("text-sm transition-colors hover:text-bone", isActive(pathname, item.href) ? "text-bone" : "text-fog")}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/library" aria-label="Saved titles" className="hidden size-9 items-center justify-center rounded-md text-fog transition-colors hover:bg-panel2 hover:text-bone md:flex">
              <Bookmark size={18} />
            </Link>
            <Link href="/settings" aria-label="Settings" className="hidden size-9 items-center justify-center rounded-md text-fog transition-colors hover:bg-panel2 hover:text-bone md:flex">
              <Settings2 size={18} />
            </Link>
            <button type="button" onClick={openSearch} aria-label="Search" className="flex size-9 items-center justify-center rounded-md text-fog transition-colors hover:bg-panel2 hover:text-bone">
              <Search size={18} />
            </button>
            <div className="hidden md:block"><ThemeToggle withLabel={false} /></div>
            <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="flex size-9 items-center justify-center rounded-md text-fog transition-colors hover:bg-panel2 hover:text-bone md:hidden">
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-[75] bg-black/60 md:hidden" />
          <nav aria-label="Mobile navigation" className="fixed inset-x-0 top-16 z-[80] max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-void px-5 py-3 md:hidden">
            {ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 border-b border-line py-3.5 text-sm last:border-0", isActive(pathname, item.href) ? "text-bone" : "text-fog")}>
                <item.icon size={17} />
                {item.label}
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
