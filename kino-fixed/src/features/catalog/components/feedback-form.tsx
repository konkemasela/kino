"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { MessageSquare, Send } from "lucide-react";

export default function FeedbackForm() {
  const [type, setType] = useState("Suggestion");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true); setStatus("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, message, website, page: window.location.pathname }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Feedback could not be sent.");
      setTitle(""); setMessage(""); setStatus("Thanks! Your feedback was sent.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Feedback could not be sent.");
    } finally { setSending(false); }
  }

  return <div className="mx-auto max-w-3xl px-5 pb-24 pt-32 md:px-10 md:pt-40">
    <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em] text-acid"><span className="h-px w-10 bg-acid"/>Help shape Kinooz</p>
    <h1 className="mt-4 font-display text-6xl uppercase tracking-[0.03em] md:text-8xl">Send <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">feedback</span></h1>
    <p className="mt-5 max-w-xl text-sm leading-relaxed text-fog">Report a bug, suggest a feature, or tell us what could be better. Messages go to the Kinooz Discord feedback channel.</p>
    <form onSubmit={submit} className="mt-10 space-y-5 rounded-2xl border border-line bg-panel/50 p-5 sm:p-7">
      <label className="block text-xs font-semibold text-fog">Feedback type<select value={type} onChange={(e) => setType(e.target.value)} className="mt-2 block w-full rounded-xl border border-line bg-void px-4 py-3 text-sm text-bone outline-none focus:border-acid"><option>Suggestion</option><option>Bug report</option><option>Design feedback</option><option>Content issue</option><option>Other</option></select></label>
      <label className="block text-xs font-semibold text-fog">Short title (optional)<input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="e.g. Add more filters" className="mt-2 block w-full rounded-xl border border-line bg-void px-4 py-3 text-sm text-bone outline-none placeholder:text-fog/50 focus:border-acid"/></label>
      <label className="block text-xs font-semibold text-fog">Details<textarea required minLength={8} maxLength={1800} value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="What happened, or what would you like to see?" className="mt-2 block w-full resize-y rounded-xl border border-line bg-void px-4 py-3 text-sm leading-relaxed text-bone outline-none placeholder:text-fog/50 focus:border-acid"/><span className="mt-1 block text-right font-normal">{message.length}/1800</span></label>
      <div aria-hidden="true" className="hidden"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)}/></label></div>
      <button disabled={sending} className="inline-flex items-center gap-2 rounded-full bg-acid px-6 py-3 text-xs font-bold uppercase tracking-wider text-void disabled:opacity-50"><Send size={14}/>{sending ? "Sending…" : "Send feedback"}</button>
      {status && <p role="status" className="text-sm text-fog">{status}</p>}
    </form>
    <p className="mt-4 text-xs text-fog">Please don't include passwords, private information, or sensitive personal details.</p>
  </div>;
}
