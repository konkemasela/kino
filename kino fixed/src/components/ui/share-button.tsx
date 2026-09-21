"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Link2,
  Mail,
  MessageCircle,
  Send,
  Share2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  /** Absolute or root-relative path to share. */
  path: string;
  description?: string;
  variant?: "solid" | "outline" | "icon";
  className?: string;
}

export default function ShareButton({
  title,
  path,
  description,
  variant = "outline",
  className,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(path);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUrl(new URL(path, window.location.origin).toString());
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, [path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const blurb = description ?? `Watch ${title} on KINO`;
  const eu = encodeURIComponent(url);
  const et = encodeURIComponent(blurb);

  const targets = [
    {
      key: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${et}&url=${eu}`,
      icon: XLogo,
    },
    {
      key: "wa",
      label: "WhatsApp",
      href: `https://wa.me/?text=${et}%20${eu}`,
      icon: MessageCircle,
    },
    {
      key: "tg",
      label: "Telegram",
      href: `https://t.me/share/url?url=${eu}&text=${et}`,
      icon: Send,
    },
    {
      key: "fb",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${eu}`,
      icon: FacebookLogo,
    },
    {
      key: "rd",
      label: "Reddit",
      href: `https://reddit.com/submit?url=${eu}&title=${et}`,
      icon: RedditLogo,
    },
    {
      key: "mail",
      label: "Email",
      href: `mailto:?subject=${et}&body=${eu}`,
      icon: Mail,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const area = document.createElement("textarea");
      area.value = url;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: blurb, url });
      setOpen(false);
    } catch {
      /* user dismissed */
    }
  };

  const trigger =
    variant === "icon" ? (
      <button
        onClick={() => setOpen(true)}
        aria-label="Share"
        className={cn(
          "flex size-9 items-center justify-center rounded-full border border-line text-fog transition-all hover:border-acid hover:text-acid active:scale-95",
          className,
        )}
      >
        <Share2 size={14} />
      </button>
    ) : variant === "solid" ? (
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-2.5 rounded-full bg-acid px-6 py-3.5 text-[12px] font-bold tracking-[0.18em] text-void uppercase transition-transform hover:scale-[1.04] active:scale-95",
          className,
        )}
      >
        <Share2 size={15} />
        Share
      </button>
    ) : (
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-2.5 rounded-full border border-bone/25 bg-void/40 px-6 py-3.5 text-[12px] font-bold tracking-[0.18em] text-bone uppercase transition-all hover:border-acid hover:text-acid active:scale-95",
          className,
        )}
      >
        <Share2 size={15} />
        Share
      </button>
    );

  return (
    <>
      {trigger}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[110] flex items-end justify-center bg-void/85 p-0 sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-t-3xl border border-line bg-panel p-6 shadow-[0_-10px_60px_rgba(0,0,0,0.6)] sm:rounded-3xl sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.34em] text-acid uppercase">
                    <span className="h-px w-6 bg-acid" />
                    Share
                  </p>
                  <h3 className="mt-2 line-clamp-2 font-display text-3xl leading-tight tracking-[0.04em] text-bone uppercase">
                    {title}
                  </h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close share dialog"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-fog transition-colors hover:bg-void hover:text-bone"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {targets.map((t) => (
                  <a
                    key={t.key}
                    href={t.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col items-center gap-2 rounded-2xl border border-line bg-void/40 py-4 transition-all hover:border-acid/60 hover:bg-acid/5 active:scale-95"
                  >
                    <t.icon
                      size={19}
                      className="text-bone/80 transition-colors group-hover:text-acid"
                    />
                    <span className="text-[9.5px] font-bold tracking-[0.14em] text-fog uppercase transition-colors group-hover:text-bone">
                      {t.label}
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-void/50 p-2 pl-4">
                <Link2 size={15} className="shrink-0 text-fog" />
                <span className="flex-1 truncate text-[12px] text-bone/70">
                  {url}
                </span>
                <button
                  onClick={copy}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[10px] font-bold tracking-[0.16em] uppercase transition-all active:scale-95",
                    copied
                      ? "bg-acid text-void"
                      : "bg-panel2 text-bone hover:bg-acid hover:text-void",
                  )}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {canNativeShare && (
                <button
                  onClick={nativeShare}
                  className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-acid py-3.5 text-[11px] font-bold tracking-[0.2em] text-void uppercase transition-transform active:scale-[0.98]"
                >
                  <Share2 size={14} />
                  More options
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function XLogo({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookLogo({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 3.925 23.094 9.101 24v-8.437H6.627v-3.49h2.474V9.9c0-2.99 1.767-4.642 4.466-4.642 1.293 0 2.646.232 2.646.232v2.928h-1.49c-1.469 0-1.927.922-1.927 1.868v2.242h3.28l-.524 3.49h-2.756V24C20.075 23.094 24 18.1 24 12.073" />
    </svg>
  );
}

function RedditLogo({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0m5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-6.994 4.87-3.865 0-6.994-2.176-6.994-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12.3c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701M9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249m5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249m-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}
