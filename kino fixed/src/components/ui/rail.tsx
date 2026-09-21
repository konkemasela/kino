"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RailProps {
  title: string;
  accent?: string;
  href?: string;
  children: ReactNode;
  className?: string;
}

export default function Rail({
  title,
  accent,
  href,
  children,
  className,
}: RailProps) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.round(el.clientWidth * 0.85),
      behavior: "smooth",
    });
  };

  return (
    <section className={cn("group/rail relative", className)}>
      <div className="mx-auto mb-5 flex max-w-[1600px] items-end justify-between px-5 md:px-10">
        <h2 className="flex items-baseline gap-3 font-display text-3xl tracking-[0.08em] uppercase md:text-4xl">
          <span className="text-bone">{title}</span>
          {accent && (
            <span className="font-editorial text-xl italic normal-case text-acid md:text-2xl">
              {accent}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {href && (
            <Link
              href={href}
              className="mr-1 hidden items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] text-fog uppercase transition-colors hover:text-acid md:flex"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          )}
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="flex size-9 items-center justify-center rounded-full border border-line text-fog transition-all hover:border-acid hover:text-acid md:opacity-0 md:transition-opacity md:duration-300 md:group-hover/rail:opacity-100"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="flex size-9 items-center justify-center rounded-full border border-line text-fog transition-all hover:border-acid hover:text-acid md:opacity-0 md:transition-opacity md:duration-300 md:group-hover/rail:opacity-100"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar mask-fade-x flex snap-x gap-4 overflow-x-auto scroll-smooth px-5 pb-2 md:px-10"
      >
        {children}
      </div>
    </section>
  );
}

export function RailItem({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("w-[140px] shrink-0 snap-start sm:w-[160px] md:w-[185px]", className)}>
      {children}
    </div>
  );
}
