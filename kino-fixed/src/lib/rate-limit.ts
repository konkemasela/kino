import { NextRequest, NextResponse } from "next/server";

/**
 * Small in-memory fixed-window limiter. State is per server instance, so on
 * serverless / multi-instance deploys use a shared store (e.g. Upstash) instead.
 * Forwarded headers are only trustworthy behind your own reverse proxy.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

export function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

/** Returns a 429 response when the caller is over the limit, otherwise null. */
export function rateLimit(
  req: NextRequest,
  name: string,
  limit: number,
  emptyBody: Record<string, unknown> = {},
  windowMs = 60_000,
): NextResponse | null {
  const now = Date.now();

  if (buckets.size > MAX_BUCKETS) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
    if (buckets.size > MAX_BUCKETS) buckets.clear();
  }

  const key = `${name}:${clientIp(req)}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  bucket.count += 1;
  if (bucket.count <= limit) return null;

  return NextResponse.json(
    { ...emptyBody, error: "Too many requests" },
    {
      status: 429,
      headers: { "Retry-After": String(Math.ceil((bucket.resetAt - now) / 1000)) },
    },
  );
}
