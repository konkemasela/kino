"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const KEY = "kino:notice-ack";

export default function LegalNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      setShow(window.localStorage.getItem(KEY) !== "1");
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* storage blocked: just hide for this visit */
    }
    setShow(false);
  };

  return (
    <div
      role="region"
      aria-label="Site notice"
      className="fixed inset-x-3 bottom-20 z-40 rounded-2xl border border-line bg-panel/95 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.5)] backdrop-blur md:inset-x-auto md:bottom-5 md:left-24 md:max-w-md"
    >
      <p className="pr-6 text-[13px] leading-relaxed text-bone/85">
        KINO stores your settings, history and watchlist on this device only.
        Third-party players and the captcha may contact their own servers. By
        using the site you agree to our{" "}
        <Link href="/legal/terms" className="text-acid underline underline-offset-2">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="text-acid underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notice"
        className="absolute right-3 top-3 text-fog transition-colors hover:text-bone"
      >
        <X size={16} />
      </button>
      <button
        type="button"
        onClick={dismiss}
        className="mt-3 rounded-full bg-acid px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-void uppercase"
      >
        Got it
      </button>
    </div>
  );
}
