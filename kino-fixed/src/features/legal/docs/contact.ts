import { SITE } from "@/lib/site-config";
import type { LegalDoc } from "../types";

export const contact: LegalDoc = {
  slug: "contact",
  title: "Contact & Reporting",
  kicker: "Talk to a human",
  summary:
    "Who runs KINO, which subject line to use for each type of message, and how to report security issues.",
  sections: [
    {
      id: "operator",
      title: "Who runs KINO",
      body: [
        `Operator: ${SITE.operator}.`,
        `Email: ${SITE.email}.`,
        "A postal address is available on request for legal notices.",
      ],
    },
    {
      id: "channels",
      title: "Which subject line to use",
      body: [
        "Use one email address and start the subject line with the matching tag, so your message reaches the right place faster:",
      ],
      list: [
        "[General] questions, feedback, broken pages;",
        "[Copyright] takedown notices and counter-notices (see the Copyright & DMCA Policy for what to include);",
        "[Privacy] access, deletion or other data requests;",
        "[Abuse] violations of the Acceptable Use Policy;",
        "[Security] vulnerability reports;",
        "[Accessibility] problems using the site with assistive technology;",
        "[Donations] questions about support payments;",
        "[Press] media enquiries.",
      ],
    },
    {
      id: "security",
      title: "Reporting a security issue",
      body: [
        "Please include a clear description, the steps to reproduce, the affected URL or feature and the potential impact. Do not access data that is not yours, do not disrupt the Service, and give us reasonable time to fix the problem before telling anyone else. We will acknowledge good-faith reports and keep you updated.",
      ],
    },
    {
      id: "response",
      title: "What to expect",
      body: [
        "We read every message but cannot promise a reply to each one. As a guide: copyright notices are reviewed within about 72 hours, privacy requests are answered within the time required by law (typically up to one month), and other messages are handled as time permits.",
      ],
    },
    {
      id: "accessibility",
      title: "Accessibility",
      body: [
        "We want KINO to be usable by everyone and aim to follow good practice, including keyboard navigation and reduced-motion support. Some third-party players are outside our control and may not be accessible. If you hit a barrier, tell us which page and which assistive technology you use, and we will try to help or fix it.",
      ],
    },
    {
      id: "language",
      title: "Language",
      body: [
        "Please write in English where possible. We may not be able to respond in other languages.",
      ],
    },
  ],
};
