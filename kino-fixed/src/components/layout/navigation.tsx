"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bookmark,
  Film,
  House,
  HeartHandshake,
  Menu,
  Palette,
  Scale,
  Search,
  Settings2,
  ShieldCheck,
  Swords,
  Tv,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SearchOverlay from "@/components/layout/search-overlay";
import ThemeToggle from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", icon: House },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/series", label: "Series", icon: Tv },
  { href: "/anime", label: "Anime", icon: Swords },
  { href: "/cartoons", label: "Cartoons", icon: Palette },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "My Space", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

/** Compact set for the mobile bottom dock. */
const DOCK_ITEMS = ITEMS.filter((i) =>
  ["/", "/movies", "/anime", "/search", "/library"].includes(i.href),
);

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = () => {
    setOpen(false);
    setSearchOpen(true);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {/* ----------------------- desktop side panel ----------------------- */}
      <aside className="group/side fixed left-0 top-0 z-[60] hidden h-screen w-20 flex-col border-r border-line bg-void/90 backdrop-blur-xl transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-64 md:flex">
        <Link
          href="/"
          aria-label="KINO home"
          className="flex h-20 shrink-0 items-center border-b border-line px-[18px]"
        >
          <div className="group relative flex h-12 w-28 items-center justify-center overflow-hidden rounded-2xl border border-line/80 bg-panel/80 px-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] ring-1 ring-inset ring-white/5 transition-all duration-300 hover:border-white/25">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.04),transparent_55%)]" />
            <Image
              src="/kino-logo.png"
              alt="KINO logo"
              width={112}
              height={32}
              className="relative h-auto w-full max-w-[94px] object-contain transition-transform duration-300 group-hover:scale-[1.04]"
              priority
            />
          </div>
        </Link>

        <nav className="mt-4 flex flex-1 flex-col gap-1.5 px-3">
          {ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const inner = (
              <>
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-acid" />
                )}
                <item.icon size={20} className="shrink-0" strokeWidth={2.2} />
                <span className="whitespace-nowrap text-[11px] font-bold tracking-[0.22em] uppercase opacity-0 transition-opacity duration-300 group-hover/side:opacity-100">
                  {item.label}
                </span>
              </>
            );
            const classes = cn(
              "relative flex items-center gap-4 overflow-hidden rounded-xl px-3.5 py-3 text-left transition-colors",
              active
                ? "bg-panel text-acid"
                : "text-fog hover:bg-panel/70 hover:text-bone",
            );
            if (item.href === "/search") {
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={openSearch}
                  title="Search (Ctrl K)"
                  className={classes}
                >
                  {inner}
                </button>
              );
            }
            return (
              <Link key={item.href} href={item.href} className={classes}>
                {inner}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-line p-3">
          <ThemeToggle withLabel={false} className="mb-1 border-0 bg-transparent" />
          {[
            { href: "/donate", label: "Donate", icon: HeartHandshake },
            { href: "/guides/adblock", label: "Guides", icon: ShieldCheck },
            { href: "/legal", label: "Legal", icon: Scale },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "mb-1 flex items-center gap-3.5 overflow-hidden rounded-xl px-3 py-2.5 transition-colors",
                isActive(pathname, item.href)
                  ? "bg-panel text-acid"
                  : "text-fog hover:bg-panel/70 hover:text-bone",
              )}
            >
              <item.icon size={19} className="shrink-0" />
              <span className="whitespace-nowrap text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 transition-opacity duration-300 group-hover/side:opacity-100">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </aside>

      {/* ------------------------- mobile top bar ------------------------- */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[70] flex h-16 items-center justify-between gap-2 px-3.5 transition-all duration-500 md:hidden",
          scrolled
            ? "border-b border-line bg-void/85 backdrop-blur-xl"
            : "bg-gradient-to-b from-void/90 to-transparent",
        )}
      >
        <Link href="/" className="flex items-center" aria-label="KINO home">
          <div className="flex items-center justify-center rounded-full border border-line/80 bg-panel/85 px-3 py-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-sm">
            <Image
              src="/kino-logo.png"
              alt="KINO logo"
              width={108}
              height={28}
              className="h-auto w-auto max-w-[92px] object-contain"
              priority
            />
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className="flex size-10 items-center justify-center rounded-full border border-line/70 bg-panel/60 text-bone transition-colors hover:border-bone/30 active:scale-95"
          >
            <Search size={18} />
          </button>
          <ThemeToggle withLabel={false} className="bg-panel/60" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex size-10 items-center justify-center rounded-full border border-line/70 bg-panel/60 text-bone transition-colors hover:border-bone/30 active:scale-95"
          >
            <Menu size={19} />
          </button>
        </div>
      </header>

      {/* --------------------------- side drawer -------------------------- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 z-[90] flex h-full w-[82%] max-w-[330px] flex-col border-r border-line bg-panel md:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-line px-5">
                <span className="font-display text-[26px] tracking-[0.12em] text-bone">
                  KINO<span className="text-acid">.</span>
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex size-10 items-center justify-center rounded-full text-fog transition-colors hover:bg-void hover:text-bone"
                >
                  <X size={19} />
                </button>
              </div>

              <button
                type="button"
                onClick={openSearch}
                className="mx-4 mt-4 flex items-center gap-3 rounded-xl border border-line bg-void/50 px-4 py-3 text-left text-sm text-fog transition-colors hover:border-bone/30 hover:text-bone"
              >
                <Search size={17} />
                Search movies, series...
              </button>

              <nav className="flex flex-col gap-1 p-4">
                {ITEMS.map((item, i) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.35 }}
                    >
                      {item.href === "/search" ? (
                        <button
                          type="button"
                          onClick={openSearch}
                          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-bone/85 transition-colors hover:bg-void/70"
                        >
                          <span className="font-editorial text-xs italic text-acid/60">
                            0{i + 1}
                          </span>
                          <item.icon size={19} className="shrink-0" />
                          <span className="font-display text-2xl tracking-[0.1em] uppercase">
                            {item.label}
                          </span>
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-4 rounded-xl px-4 py-3 text-bone/85 transition-colors hover:bg-void/70",
                            active && "bg-void text-acid",
                          )}
                        >
                          <span className="font-editorial text-xs italic text-acid/60">
                            0{i + 1}
                          </span>
                          <item.icon size={19} className="shrink-0" />
                          <span className="font-display text-2xl tracking-[0.1em] uppercase">
                            {item.label}
                          </span>
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-line p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold tracking-[0.28em] text-fog uppercase">
                    Appearance
                  </span>
                  <ThemeToggle />
                </div>
                <div className="mb-5 grid grid-cols-2 gap-2">
                  {[
                    { href: "/donate", label: "Donate", icon: HeartHandshake },
                    { href: "/guides/adblock", label: "Ad blocker", icon: ShieldCheck },
                    { href: "/guides/vpn", label: "VPN guide", icon: ShieldCheck },
                    { href: "/legal", label: "Legal", icon: Scale },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-[10px] font-bold tracking-[0.14em] text-fog uppercase transition-colors hover:border-acid hover:text-acid"
                    >
                      <item.icon size={14} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --------------------------- bottom dock -------------------------- */}
      <nav className="fixed inset-x-3 bottom-0 z-[70] pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        <div className="flex items-center justify-around rounded-2xl border border-line bg-panel/95 px-1 py-2 shadow-[0_14px_44px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {DOCK_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const inner = (
              <>
                <item.icon size={19} strokeWidth={active ? 2.4 : 2} />
                <span className="text-[8.5px] font-bold tracking-[0.14em] uppercase">
                  {item.label === "My Space" ? "Saved" : item.label}
                </span>
              </>
            );
            const classes = cn(
              "flex flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 transition-colors",
              active ? "bg-panel2 text-acid" : "text-fog hover:text-bone",
            );
            if (item.href === "/search") {
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={openSearch}
                  aria-label={item.label}
                  className={classes}
                >
                  {inner}
                </button>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={classes}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </nav>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
