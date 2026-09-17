import { clsx, type ClassValue } from "clsx";
import type { MediaType } from "@/features/catalog/api";
import { ratingOf } from "@/features/catalog/api";
import type { ServerKind } from "@/features/watch/servers";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function mediaHref(type: ServerKind, id: string) {
  if (type === "anime") return `/anime/${id}`;
  return `/${type}/${id}`;
}

export function watchHref(
  type: ServerKind,
  id: string,
  season?: number,
  episode?: number,
) {
  if (type === "anime") {
    return `/watch/anime/${id}?e=${episode ?? 1}`;
  }
  if (type === "tv") {
    return `/watch/tv/${id}?s=${season ?? 1}&e=${episode ?? 1}`;
  }
  return `/watch/movie/${id}`;
}

export function ratingLabel(value?: string | number | null) {
  return ratingOf(value);
}

export function kindLabel(kind: ServerKind) {
  return kind === "movie" ? "Movie" : kind === "tv" ? "Series" : "Anime";
}

export const DEVICE_COOKIE = "kino_device";
