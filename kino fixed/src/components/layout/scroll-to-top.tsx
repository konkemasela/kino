"use client";

import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-5 z-[70] flex size-12 items-center justify-center rounded-full border border-line bg-panel/90 text-bone shadow-lg shadow-void/50 transition-transform hover:scale-105 hover:border-acid hover:text-acid md:bottom-8 md:right-8"
    >
      <span className="text-lg leading-none">↑</span>
    </button>
  );
}
