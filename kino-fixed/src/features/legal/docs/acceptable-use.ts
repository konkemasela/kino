import { SITE } from "@/lib/site-config";
import type { LegalDoc } from "../types";

export const acceptableUse: LegalDoc = {
  slug: "acceptable-use",
  title: "Acceptable Use Policy",
  kicker: "Play fair",
  summary:
    "What is and is not allowed when using KINO, including automation limits and how to report problems.",
  sections: [
    {
      id: "purpose",
      title: "Purpose",
      body: [
        "This policy keeps the Service reliable and safe for everyone. It applies to all use of KINO and forms part of the Terms of Use.",
      ],
    },
    {
      id: "prohibited",
      title: "Prohibited activity",
      body: ["You must not use the Service to:"],
      list: [
        "violate any law, or any right of another person (including intellectual property, privacy and publicity rights);",
        "harass, threaten, defame or discriminate against others, or share hateful, violent or sexually exploitative material;",
        "endanger, exploit or sexualise minors in any way;",
        "send spam, scams, malware, phishing or deceptive content, including through nicknames or chat;",
        "impersonate any person or organisation, or misrepresent your connection to KINO;",
        "interfere with the Service or its infrastructure, for example by denial-of-service traffic, exploiting bugs, or attempting to gain unauthorised access;",
        "bypass, disable or tamper with the captcha, rate limits, content security policy, sandboxing or other protections;",
        "harvest data, scrape or mass-download pages, API responses, images or metadata beyond normal browsing;",
        "resell, frame, mirror or republish the Service or its data as your own product.",
      ],
    },
    {
      id: "limits",
      title: "Request limits and automation",
      body: [
        "We apply per-visitor request limits to search, catalog and captcha endpoints. These limits can change at any time. If your use is blocked or slowed, do not try to evade it with rotating addresses or similar tools. Ordinary browsing is never expected to hit these limits.",
        "If you need programmatic access, contact us first to discuss a suitable arrangement. Also respect the terms of the upstream metadata providers.",
      ],
    },
    {
      id: "third-party",
      title: "Third-party services",
      body: [
        "Do not attack, probe or abuse the third-party players, indexes, catalogs and captcha service that KINO connects to. Their rules also apply to you.",
      ],
    },
    {
      id: "security",
      title: "Security research",
      body: [
        "We welcome good-faith reports of vulnerabilities. Please do not access other people’s data, degrade the Service, run denial-of-service tests, or publicly disclose issues before we have had a reasonable time to fix them. Report what you find through the Contact & Reporting page. Good-faith research that follows these rules will not be pursued by us.",
      ],
    },
    {
      id: "enforcement",
      title: "Enforcement",
      body: [
        "We may investigate suspected violations and take action at our discretion, including warning you, throttling or blocking access, removing features or content, and reporting unlawful activity to the authorities. We are not obliged to monitor the Service, and a failure to act on a particular violation is not a waiver.",
      ],
    },
    {
      id: "report",
      title: "Reporting abuse",
      body: [
        `To report a violation, email ${SITE.email} with the subject line “Abuse report”, describing what you saw and where.`,
      ],
    },
  ],
};
