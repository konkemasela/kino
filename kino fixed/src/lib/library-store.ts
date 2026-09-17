"use client";

/**
 * Device-local persistence for KINO — Postgres-free, secret-free.
 * Watch history and the watchlist live entirely in the visitor's browser.
 */

import type { MediaType } from "@/features/catalog/api";

export interface LibraryEntry {
  mediaType: MediaType | "anime" | string;
  imdbId: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  season: number | null;
  episode: number | null;
  updatedAt: string;
}

export interface ListEntry {
  mediaType: string;
  imdbId: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  createdAt: string;
}

const HISTORY_KEY = "kino:history";
const LIST_KEY = "kino:list";
const HISTORY_CAP = 24;
const LIST_CAP = 500;

const CHANGE_EVENT = "kino:library-changed";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
}

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked — safest to just skip
  }
  notify();
}

/* -------------------------------------------------------------- history -- */

export function getHistory(): LibraryEntry[] {
  return read<LibraryEntry>(HISTORY_KEY)
    .filter((e) => e && e.imdbId && e.mediaType)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, HISTORY_CAP);
}

export function recordWatch(
  entry: Omit<LibraryEntry, "updatedAt">,
): LibraryEntry[] {
  const rest = read<LibraryEntry>(HISTORY_KEY).filter(
    (e) => !(e.mediaType === entry.mediaType && e.imdbId === entry.imdbId),
  );
  const next = [
    { ...entry, updatedAt: new Date().toISOString() },
    ...rest,
  ].slice(0, HISTORY_CAP);
  write(HISTORY_KEY, next);
  return next;
}

export function removeHistory(mediaType: string, imdbId: string): LibraryEntry[] {
  const next = read<LibraryEntry>(HISTORY_KEY).filter(
    (e) => !(e.mediaType === mediaType && e.imdbId === imdbId),
  );
  write(HISTORY_KEY, next);
  return next;
}

/* ------------------------------------------------------------- watchlist -- */

export function getList(): ListEntry[] {
  return read<ListEntry>(LIST_KEY).filter((e) => e && e.imdbId && e.mediaType);
}

export function isInList(mediaType: string, imdbId: string): boolean {
  return getList().some(
    (e) => e.mediaType === mediaType && e.imdbId === imdbId,
  );
}

export function addToList(entry: Omit<ListEntry, "createdAt">): ListEntry[] {
  if (isInList(entry.mediaType, entry.imdbId)) return getList();
  const next = [
    { ...entry, createdAt: new Date().toISOString() },
    ...getList(),
  ].slice(0, LIST_CAP);
  write(LIST_KEY, next);
  return next;
}

export function removeFromList(mediaType: string, imdbId: string): ListEntry[] {
  const next = getList().filter(
    (e) => !(e.mediaType === mediaType && e.imdbId === imdbId),
  );
  write(LIST_KEY, next);
  return next;
}

/** Returns the new state of membership. */
export function toggleList(entry: Omit<ListEntry, "createdAt">): boolean {
  if (isInList(entry.mediaType, entry.imdbId)) {
    removeFromList(entry.mediaType, entry.imdbId);
    return false;
  }
  addToList(entry);
  return true;
}

/* ------------------------------------------------------------ subscription */

export function onLibraryChange(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const handler = () => callback();
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}
