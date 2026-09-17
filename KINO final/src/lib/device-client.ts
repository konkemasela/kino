"use client";

import { DEVICE_COOKIE } from "@/lib/utils";

/** Client-side: ensure the anonymous device cookie exists (JS-writable). */
export function ensureDeviceIdClient(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${DEVICE_COOKIE}=([^;]*)`),
  );
  if (match?.[1]) return decodeURIComponent(match[1]);
  const id = crypto.randomUUID();
  document.cookie = `${DEVICE_COOKIE}=${encodeURIComponent(
    id,
  )}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  return id;
}
