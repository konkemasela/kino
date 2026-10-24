"use client";

import type { Lang } from "@/features/watch/servers";
import {
  ANIME_SERVERS,
  DEFAULT_ANIME_SERVER_ID,
  DEFAULT_SERVER_ID,
  STREAM_SERVERS,
} from "@/features/watch/servers";

export interface KinoSettings {
  movieServerId: string;
  tvServerId: string;
  animeServerId: string;
  autoplay: boolean;
  animeLang: Lang;
  reducedMotion: boolean;
  compactUi: boolean;
}

const SETTINGS_KEY = "kino:settings";
const CHANGE_EVENT = "kino:settings-changed";

export const DEFAULT_SETTINGS: KinoSettings = {
  movieServerId: DEFAULT_SERVER_ID,
  tvServerId: DEFAULT_SERVER_ID,
  animeServerId: DEFAULT_ANIME_SERVER_ID,
  autoplay: true,
  animeLang: "sub",
  reducedMotion: false,
  compactUi: false,
};

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
}

function isServerId(id: string, kind: "stream" | "anime") {
  const list = kind === "anime" ? ANIME_SERVERS : STREAM_SERVERS;
  return list.some((server) => server.id === id);
}

function sanitize(raw: unknown): KinoSettings {
  const value = raw && typeof raw === "object" ? (raw as Partial<KinoSettings>) : {};
  const movieServerId = isServerId(String(value.movieServerId ?? ""), "stream")
    ? String(value.movieServerId)
    : DEFAULT_SETTINGS.movieServerId;
  const tvServerId = isServerId(String(value.tvServerId ?? ""), "stream")
    ? String(value.tvServerId)
    : movieServerId;
  const animeServerId = isServerId(String(value.animeServerId ?? ""), "anime")
    ? String(value.animeServerId)
    : DEFAULT_SETTINGS.animeServerId;

  return {
    movieServerId,
    tvServerId,
    animeServerId,
    autoplay: value.autoplay !== false,
    animeLang: value.animeLang === "dub" ? "dub" : "sub",
    reducedMotion: value.reducedMotion === true,
    compactUi: value.compactUi === true,
  };
}

function syncPlayerKeys(settings: KinoSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("kino:server:movie", settings.movieServerId);
  window.localStorage.setItem("kino:server:tv", settings.tvServerId);
  window.localStorage.setItem("kino:server:anime", settings.animeServerId);
}

export function getSettings(): KinoSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      const movie = window.localStorage.getItem("kino:server:movie");
      const tv = window.localStorage.getItem("kino:server:tv");
      const anime = window.localStorage.getItem("kino:server:anime");
      const prefersReduced =
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
      return sanitize({
        movieServerId: movie ?? undefined,
        tvServerId: tv ?? undefined,
        animeServerId: anime ?? undefined,
        reducedMotion: prefersReduced,
      });
    }
    return sanitize(JSON.parse(raw));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function setSettings(next: KinoSettings): KinoSettings {
  const clean = sanitize(next);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(clean));
    } catch {
      // storage full or blocked
    }
    syncPlayerKeys(clean);
  }
  notify();
  return clean;
}

export function patchSettings(partial: Partial<KinoSettings>): KinoSettings {
  return setSettings({ ...getSettings(), ...partial });
}

export function resetSettings(): KinoSettings {
  return setSettings(DEFAULT_SETTINGS);
}

export function onSettingsChange(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const handler = () => callback();
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function applyDocumentSettings(settings: KinoSettings = getSettings()) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("reduce-motion", settings.reducedMotion);
  document.documentElement.classList.toggle("compact", settings.compactUi);
}

export function withAutoplay(url: string, autoplay: boolean) {
  if (autoplay) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("autoplay");
    parsed.searchParams.delete("autoPlay");
    parsed.searchParams.set("autoplay", "0");
    return parsed.toString();
  } catch {
    return url
      .replace(/autoplay=1/gi, "autoplay=0")
      .replace(/autoPlay=true/g, "autoPlay=false");
  }
}
