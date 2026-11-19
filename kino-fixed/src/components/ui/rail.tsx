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

export default function Rail({ title, href, children, className }: RailProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const scrollBy = (direction: 1 | -1) => {
    const element = scroller.current;
    if (!element) return;
    element.scrollBy({ left: direction * Math.round(element.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className={cn("group/rail relative", className)}>
      <div className="mx-auto mb-4 flex max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <h2 className="text-lg font-semibold tracking-tight text-bone sm:text-xl">{title}</h2>
        <div className="flex shrink-0 items-center gap-3">
          {href && <Link href={href} className="text-sm text-fog transition-colors hover:text-bone">See all</Link>}
          <div className="hidden items-center gap-1 sm:flex">
            <button type="button" onClick={() => scrollBy(-1)} aria-label={`Scroll ${title} left`} className="flex size-8 items-center justify-center rounded-md border border-line text-fog transition-colors hover:border-fog hover:text-bone"><ChevronLeft size={16} /></button>
            <button type="button" onClick={() => scrollBy(1)} aria-label={`Scroll ${title} right`} className="flex size-8 items-center justify-center rounded-md border border-line text-fog transition-colors hover:border-fog hover:text-bone"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
      <div ref={scroller} className="no-scrollbar flex snap-x gap-3 overflow-x-auto scroll-smooth px-4 pb-2 sm:gap-4 sm:px-6 lg:px-10">
        {children}
      </div>
    </section>
  );
}

export function RailItem({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("compact-rail w-[132px] shrink-0 snap-start sm:w-[156px] md:w-[180px]", className)}>{children}</div>;
}
