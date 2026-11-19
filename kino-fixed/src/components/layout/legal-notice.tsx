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
    try { window.localStorage.setItem(KEY, "1"); } catch { /* storage unavailable */ }
    setShow(false);
  };

  return (
    <aside role="region" aria-label="Site notice" className="fixed inset-x-3 bottom-20 z-40 rounded-lg border border-line bg-panel p-4 shadow-xl md:inset-x-auto md:bottom-5 md:left-24 md:max-w-md">
      <button type="button" onClick={dismiss} aria-label="Dismiss notice" className="absolute right-3 top-3 text-fog hover:text-bone"><X size={16} /></button>
      <p className="pr-6 text-sm leading-6 text-bone/85">
        KINO stores settings, history and your watchlist on this device. Third-party players may contact their own servers. By using the site, you agree to our{" "}
        <Link href="/legal/terms" className="underline underline-offset-2">Terms</Link> and{" "}
        <Link href="/legal/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
      </p>
      <button type="button" onClick={dismiss} className="mt-3 rounded-md bg-white px-4 py-2 text-sm font-medium text-black">Got it</button>
    </aside>
  );
}
