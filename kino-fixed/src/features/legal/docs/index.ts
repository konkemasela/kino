import {
  Copyright,
  Cookie,
  FileWarning,
  HeartHandshake,
  Mail,
  Network,
  Scale,
  ShieldCheck,
  Ban,
  type LucideIcon,
} from "lucide-react";
import type { LegalDoc } from "../types";
import { terms } from "./terms";
import { privacy } from "./privacy";
import { cookies } from "./cookies";
import { dmca } from "./dmca";
import { acceptableUse } from "./acceptable-use";
import { disclaimer } from "./disclaimer";
import { thirdParty } from "./third-party";
import { donations } from "./donations";
import { contact } from "./contact";

export interface LegalEntry extends LegalDoc {
  icon: LucideIcon;
  minutes: number;
}

const words = (doc: LegalDoc) =>
  doc.sections.reduce(
    (total, s) =>
      total +
      [s.title, ...s.body, ...(s.list ?? []), ...(s.after ?? []), s.note ?? ""]
        .join(" ")
        .split(/\s+/).length,
    0,
  );

const entry = (doc: LegalDoc, icon: LucideIcon): LegalEntry => ({
  ...doc,
  icon,
  minutes: Math.max(1, Math.round(words(doc) / 200)),
});

export const LEGAL_DOCS: LegalEntry[] = [
  entry(terms, Scale),
  entry(privacy, ShieldCheck),
  entry(cookies, Cookie),
  entry(dmca, Copyright),
  entry(acceptableUse, Ban),
  entry(disclaimer, FileWarning),
  entry(thirdParty, Network),
  entry(donations, HeartHandshake),
  entry(contact, Mail),
];

export const getLegalDoc = (slug: string) =>
  LEGAL_DOCS.find((d) => d.slug === slug);
