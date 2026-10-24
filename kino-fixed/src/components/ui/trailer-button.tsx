"use client";

import { useEffect, useState } from "react";
import { Clapperboard, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function TrailerButton({ youtubeKey }: { youtubeKey: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 rounded-full border border-bone/25 bg-void/40 px-6 py-3.5 text-[12px] font-bold tracking-[0.18em] text-bone uppercase backdrop-blur-md transition-all hover:border-bone/60 active:scale-95"
      >
        <Clapperboard size={15} />
        Trailer
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-void/92 p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-panel ring-1 ring-line"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeKey}?autoplay=1&rel=0`}
                title="Trailer"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close trailer"
                className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-void/70 text-bone backdrop-blur transition-colors hover:bg-ember"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
