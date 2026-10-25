import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, "captcha", 10, { success: false });
  if (limited) return limited;

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { success: false, error: "Captcha is not configured" },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => null)) as { token?: unknown } | null;
  const token = typeof body?.token === "string" ? body.token : "";
  if (!token || token.length > 4096) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({ secret, response: token });
    const ip = clientIp(req);
    if (ip !== "unknown") params.set("remoteip", ip);

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean };
    return NextResponse.json({ success: data.success === true });
  } catch {
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
