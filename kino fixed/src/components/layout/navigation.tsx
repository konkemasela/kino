"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bookmark,
  Film,
  Globe,
  House,
  HeartHandshake,
  Menu,
  Palette,
  Scale,
  Search,
  ShieldCheck,
  Swords,
  Tv,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", icon: House },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/series", label: "Series", icon: Tv },
  { href: "/anime", label: "Anime", icon: Swords },
  { href: "/cartoons", label: "Cartoons", icon: Palette },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "My Space", icon: Bookmark },
];

/** Compact set for the mobile bottom dock. */
const DOCK_ITEMS = ITEMS.filter((i) =>
  ["/", "/movies", "/anime", "/search", "/library"].includes(i.href),
);

const WEBGEN_URL = "https://webgen-za.vercel.app";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  return (
    <>
      {/* ----------------------- desktop side panel ----------------------- */}
      <aside className="group/side fixed left-0 top-0 z-[60] hidden h-screen w-20 flex-col border-r border-line bg-void/90 backdrop-blur-xl transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-64 md:flex">
        <Link
          href="/"
          aria-label="KINO home"
          className="flex h-20 shrink-0 items-center overflow-hidden border-b border-line px-[26px]"
        >
          <span className="font-display text-[30px] leading-none tracking-[0.1em] text-bone">
            K
          </span>
          <span className="whitespace-nowrap font-display text-[30px] leading-none tracking-[0.1em] text-bone opacity-0 transition-opacity duration-300 group-hover/side:opacity-100">
            INO<span className="text-acid">.</span>
          </span>
          <span className="ml-0.5 mt-3 size-1.5 shrink-0 rounded-full bg-acid transition-opacity duration-200 group-hover/side:opacity-0" />
        </Link>

        <nav className="mt-4 flex flex-1 flex-col gap-1.5 px-3">
          {ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-4 overflow-hidden rounded-xl px-3.5 py-3 transition-colors",
                  active
                    ? "bg-panel text-acid"
                    : "text-fog hover:bg-panel/70 hover:text-bone",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-acid" />
                )}
                <item.icon size={20} className="shrink-0" strokeWidth={2.2} />
                <span className="whitespace-nowrap text-[11px] font-bold tracking-[0.22em] uppercase opacity-0 transition-opacity duration-300 group-hover/side:opacity-100">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-line p-3">
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
          <a
            href={WEBGEN_URL}
            target="_blank"
            rel="noreferrer"
            title="Kino is developed and maintained by Webgen"
            className="flex items-center gap-3.5 overflow-hidden rounded-xl px-3 py-2.5 text-fog transition-colors hover:bg-panel/70 hover:text-acid"
          >
            <Globe size={19} className="shrink-0" />
            <span className="whitespace-nowrap text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 transition-opacity duration-300 group-hover/side:opacity-100">
              Webgen Studio
            </span>
          </a>
        </div>
      </aside>

      {/* ------------------------- mobile top bar ------------------------- */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[70] flex h-16 items-center justify-between px-4 transition-all duration-500 md:hidden",
          scrolled
            ? "border-b border-line bg-void/95"
            : "bg-gradient-to-b from-void/90 to-transparent",
        )}
      >
        <Link href="/" className="flex items-baseline gap-1" aria-label="KINO home">
          <span className="font-display text-[28px] leading-none tracking-[0.12em] text-bone">
            KINO
          </span>
          <span className="size-1.5 rounded-full bg-acid" />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="flex size-10 items-center justify-center rounded-full text-bone transition-colors hover:bg-panel"
          >
            <Search size={19} />
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex size-10 items-center justify-center rounded-full text-bone transition-colors hover:bg-panel"
          >
            <Menu size={20} />
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
              className="fixed inset-0 z-[80] bg-void/70 backdrop-blur-sm md:hidden"
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
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors",
                          active ? "bg-void text-acid" : "text-bone/85 hover:bg-void/70",
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
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-line p-5">
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
                <p className="text-[10px] font-bold tracking-[0.34em] text-acid uppercase">
                  Credit
                </p>
                <blockquote className="mt-3 border-l-2 border-acid pl-3 font-editorial text-sm italic leading-relaxed text-fog">
                  “Kino is developed and maintained by Webgen — visit{" "}
                  <a
                    href={WEBGEN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-acid underline decoration-acid/40 underline-offset-2 hover:decoration-acid"
                  >
                    webgen-za.vercel.app
                  </a>{" "}
                  for more info.”
                </blockquote>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --------------------------- bottom dock -------------------------- */}
      <nav className="fixed inset-x-3 bottom-3 z-[70] md:hidden">
        <div className="flex items-center justify-around rounded-2xl border border-line bg-panel/95 px-1 py-2 shadow-[0_14px_44px_rgba(0,0,0,0.6)]">
          {DOCK_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 transition-colors",
                  active ? "text-acid" : "text-fog hover:text-bone",
                )}
              >
                <item.icon size={19} strokeWidth={active ? 2.4 : 2} />
                <span className="text-[8.5px] font-bold tracking-[0.14em] uppercase">
                  {item.label === "My Space" ? "Saved" : item.label}
                </span>
                {active && (
                  <span className="absolute -top-[5px] size-1 rounded-full bg-acid shadow-[0_0_10px_rgba(215,246,55,0.9)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
