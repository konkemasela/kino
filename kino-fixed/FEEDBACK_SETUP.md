# Discord feedback setup

1. In Discord, open the channel where Kinooz feedback should arrive.
2. Open **Edit Channel → Integrations → Webhooks → New Webhook** (the exact labels may vary).
3. Copy the webhook URL.
4. Add it to `.env.local` for local development:

   ```env
   DISCORD_FEEDBACK_WEBHOOK_URL=https://discord.com/api/webhooks/ID/TOKEN
   ```

5. Add the same variable to the production deployment's server-side environment settings, then redeploy.
6. Open `/feedback` and send a test suggestion.

Keep the webhook URL secret. Do not prefix it with `NEXT_PUBLIC_`, commit the real URL, or put it in browser code. The API route validates input, limits field lengths, disables mention parsing, and returns an error if the webhook is not configured.

## Feature notes

- Hidden titles, watched marks, release reminder selections, homepage section preferences, and digest opt-in are saved in that browser's local storage.
- Release reminders are saved preferences only; browser notifications or scheduled alerts are not configured.
- Weekly digest opt-in is a preference placeholder; no emails are sent until a digest delivery service is connected.
- Country browsing depends on country metadata being present in the current catalog response.
- Franchise pages search the available metadata catalog; they do not guarantee every sequel or spin-off will be returned.
- The catalog API does not expose a reliable indexed-at timestamp, so the homepage uses recent release years rather than claiming an exact date-added feed.
