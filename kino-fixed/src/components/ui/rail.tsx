"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  href,
  children,
  className,
}: RailProps) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const element = scroller.current;
    if (!element) return;
    element.scrollBy({
      left: direction * Math.round(element.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  return (
    <section className={cn("group/rail relative", className)}>
      <div className="mx-auto mb-4 flex max-w-[1600px] items-center justify-between px-5 md:px-10">
        <h2 className="text-xl font-semibold tracking-tight text-bone md:text-2xl">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {href && (
            <Link
              href={href}
              className="text-sm text-fog transition-colors hover:text-bone"
            >
              See all
            </Link>
          )}
          <div className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label={`Scroll ${title} left`}
              className="flex size-8 items-center justify-center rounded-full border border-line text-fog transition-colors hover:border-fog hover:text-bone"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label={`Scroll ${title} right`}
              className="flex size-8 items-center justify-center rounded-full border border-line text-fog transition-colors hover:border-fog hover:text-bone"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar flex snap-x gap-3 overflow-x-auto scroll-smooth px-5 pb-2 md:gap-4 md:px-10"
      >
        {children}
      </div>
    </section>
  );
}

export function RailItem({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "compact-rail w-[140px] shrink-0 snap-start sm:w-[160px] md:w-[185px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
