import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DEVICE_COOKIE } from "@/lib/utils";

/**
 * Reads the anonymous device id from cookies. If missing, generates one and
 * attaches it to the provided response (route handlers only).
 */
export async function resolveDeviceId(res?: NextResponse): Promise<string> {
  const store = await cookies();
  const existing = store.get(DEVICE_COOKIE)?.value;
  if (existing) return existing;

  const id = crypto.randomUUID();
  if (res) {
    res.cookies.set(DEVICE_COOKIE, id, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return id;
}
