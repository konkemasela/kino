import { NextRequest, NextResponse } from "next/server";

const MAX_MESSAGE = 1800;
const MAX_TITLE = 120;
const MAX_TYPE = 40;

export async function POST(request: NextRequest) {
  const webhook = process.env.DISCORD_FEEDBACK_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      { error: "Feedback is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const title = typeof data.title === "string" ? data.title.trim().slice(0, MAX_TITLE) : "";
  const message = typeof data.message === "string" ? data.message.trim().slice(0, MAX_MESSAGE) : "";
  const type = typeof data.type === "string" ? data.type.trim().slice(0, MAX_TYPE) : "Suggestion";
  const page = typeof data.page === "string" ? data.page.slice(0, 180) : "Unknown";
  const trap = typeof data.website === "string" ? data.website : "";

  // Honeypot: quietly accept bot submissions without forwarding them.
  if (trap) return NextResponse.json({ ok: true });
  if (message.length < 8) {
    return NextResponse.json({ error: "Please add a little more detail (at least 8 characters)." }, { status: 400 });
  }

  try {
    const discordResponse = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        allowed_mentions: { parse: [] },
        embeds: [{
          title: `Kinooz feedback: ${title || type}`,
          description: message,
          color: 12123902,
          fields: [
            { name: "Type", value: type || "Suggestion", inline: true },
            { name: "Page", value: page || "Unknown", inline: true },
          ],
          footer: { text: "Kinooz feedback inbox" },
          timestamp: new Date().toISOString(),
        }],
      }),
      cache: "no-store",
    });
    if (!discordResponse.ok) {
      return NextResponse.json({ error: "Discord could not accept the feedback. Please try again later." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not send feedback right now." }, { status: 502 });
  }
}
