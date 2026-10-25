/**
 * Operator details shown in the legal documents.
 * Set these as environment variables (Vercel → Settings → Environment Variables):
 *   NEXT_PUBLIC_OPERATOR_NAME        e.g. "Jane Doe" or "Acme Media Ltd"
 *   NEXT_PUBLIC_LEGAL_EMAIL          e.g. "legal@yourdomain.com"
 *   NEXT_PUBLIC_LEGAL_JURISDICTION   e.g. "England and Wales"
 * Unset values render as obvious [bracketed] placeholders so nothing fake ships silently.
 */
export const SITE = {
  name: "KINO",
  operator:
    process.env.NEXT_PUBLIC_OPERATOR_NAME || "[operator name not configured]",
  email:
    process.env.NEXT_PUBLIC_LEGAL_EMAIL || "[contact email not configured]",
  jurisdiction:
    process.env.NEXT_PUBLIC_LEGAL_JURISDICTION ||
    "the jurisdiction in which the operator is established",
  effectiveDate: "25 October 2026",
  version: "1.0",
} as const;

export const EMAIL_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_LEGAL_EMAIL);
