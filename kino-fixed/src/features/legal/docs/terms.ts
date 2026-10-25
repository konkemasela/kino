import { SITE } from "@/lib/site-config";
import type { LegalDoc } from "../types";

export const terms: LegalDoc = {
  slug: "terms",
  title: "Terms of Use",
  kicker: "The rules of the room",
  summary:
    "The agreement between you and KINO: what the service is, what you may do with it, and where our responsibility ends.",
  sections: [
    {
      id: "agreement",
      title: "Agreement and acceptance",
      body: [
        `These Terms of Use (the “Terms”) form a binding agreement between you and the operator of ${SITE.name} (“we”, “us”, “our”). By opening, browsing or using ${SITE.name} (the “Service”), you confirm that you have read and accepted these Terms, together with the documents they refer to: the Privacy Policy, the Cookies & Local Storage notice, the Acceptable Use Policy, the Copyright & DMCA Policy and the Disclaimer.`,
        "If you do not agree, do not use the Service. Continuing to use it after we publish an update means you accept the updated Terms.",
      ],
    },
    {
      id: "what-kino-is",
      title: "What KINO is",
      body: [
        "KINO is a discovery and search interface. It displays publicly available information about films, series and anime (titles, posters, summaries, ratings, episode lists) obtained from third-party catalogs, and it links to or embeds independent third-party services such as video players and torrent indexes.",
        "KINO does not host, upload, store, cache, transmit or distribute video files. No media passes through our servers. Playback and downloads take place on infrastructure operated by unrelated third parties.",
      ],
      note: "Short version: we are a directory and interface, not a host. What you open from a third party is governed by that party.",
    },
    {
      id: "eligibility",
      title: "Eligibility and age",
      body: [
        "You must be at least 13 years old, or the minimum age at which you can consent to online services in your country if that is higher. If you are under 18 (or the age of majority where you live), you may use the Service only with the permission and supervision of a parent or guardian who accepts these Terms on your behalf.",
        "KINO can lead to material that is intended for adults and that we do not review or rate. We do not provide parental controls. Parents and guardians are responsible for supervising what minors watch.",
      ],
    },
    {
      id: "changes",
      title: "Changes to the Service and these Terms",
      body: [
        "We may add, change, suspend or remove any part of the Service at any time, including features, catalogs, mirrors and pages, with or without notice.",
        `We may update these Terms from time to time. The “effective date” at the top of each document shows when it last changed (currently ${SITE.effectiveDate}, version ${SITE.version}). For material changes we will make a reasonable effort to highlight the update on the site. Your continued use after an update means you accept it.`,
      ],
    },
    {
      id: "licence",
      title: "Your licence to use KINO",
      body: [
        "Subject to these Terms, we give you a limited, personal, non-exclusive, non-transferable, revocable licence to access and use the Service for your own non-commercial purposes.",
        "This licence does not include any right to copy, modify, resell, sublicense or commercially exploit the Service, its code, design or branding, except where the law or an open-source licence that applies to a particular component expressly allows it.",
      ],
    },
    {
      id: "conduct",
      title: "What you must not do",
      body: [
        "You agree to use the Service lawfully and in line with the Acceptable Use Policy. In particular, you must not:",
      ],
      list: [
        "break any law or regulation that applies to you, or help anyone else to do so;",
        "scrape, crawl or bulk-download the Service or its API routes, or bypass rate limits, the captcha, or other protective measures;",
        "interfere with, overload, probe or attack the Service, its hosting or the third-party services it connects to;",
        "frame, mirror, rebrand or republish the Service as your own, or imply that we endorse you;",
        "upload, post or transmit unlawful, abusive, hateful or harmful material through any chat, nickname or similar feature;",
        "use the Service to harass, stalk, defraud or harm others, or to expose minors to harmful material.",
      ],
    },
    {
      id: "third-party",
      title: "Third-party services and content",
      body: [
        "Video players (“mirrors”), torrent indexes, metadata providers, image hosts, trailer hosts and the captcha provider are operated by independent third parties. We do not own, control, operate or vouch for them, and their identities, behaviour and availability can change without notice.",
        "When your browser loads a third-party player, image or script, that third party can see technical information such as your IP address and browser details, and may set its own cookies, show advertising, open pop-ups or attempt to redirect you. Their own terms and privacy practices apply, and we are not responsible for them. See the Third-Party Services notice for the categories involved.",
      ],
      list: [
        "We do not verify the licensing status of material offered by third parties.",
        "We do not guarantee that any third-party source is safe, accurate, legal where you live, or available.",
        "A link, embed or listing on KINO is not an endorsement.",
      ],
    },
    {
      id: "your-responsibility",
      title: "Your responsibility for lawful use",
      body: [
        "You alone are responsible for how you use the Service and for what you choose to open, play or download through third-party sources. Copyright and licensing rules differ between countries, and some content reachable through third-party services may be unlicensed in your country.",
        "Before you watch or download anything, make sure doing so is lawful where you are and consistent with any licence or subscription you hold. Where you want a clearly licensed option, use the catalog information to find the title on a legitimate service.",
      ],
      note: "Nothing on KINO is legal advice, and a disclaimer on a website does not make an activity lawful.",
    },
    {
      id: "mature-content",
      title: "Mature material, spoilers and safety warnings",
      body: [
        "Titles in the catalog may contain violence, strong language, sexual content, flashing lights or other material that is unsuitable for some viewers, and episode summaries may contain spoilers. We do not curate or age-rate third-party playback.",
        "If you are photosensitive or otherwise sensitive to particular content, check a title's information before you watch.",
      ],
    },
    {
      id: "local-data",
      title: "Your library, history and settings",
      body: [
        "Your watch history, watchlist (“My Space”), server choice and preferences are stored in your own browser using local storage. We do not have accounts and do not keep a server-side copy.",
        "This means we cannot recover that data if you clear your browser, change device or use private browsing. You are responsible for it. See the Privacy Policy and the Cookies & Local Storage notice for details.",
      ],
    },
    {
      id: "watch-rooms",
      title: "Watch rooms, nicknames and chat",
      body: [
        "Watch-room chat and “party” features are provided as a convenience. In their current form they synchronise only between tabs in the same browser on your device. If that changes, we will update these Terms and the Privacy Policy before any messages leave your device.",
        "Any nickname or message you enter must comply with the Acceptable Use Policy. We may limit, filter or remove these features at any time.",
      ],
    },
    {
      id: "automation",
      title: "Captcha, rate limits and automated access",
      body: [
        "We use a Google reCAPTCHA check and request limits to protect the Service from abuse. By completing the captcha you acknowledge that Google processes the data described in the Privacy Policy.",
        "Automated access, scraping or traffic that appears abusive may be throttled or blocked without notice.",
      ],
    },
    {
      id: "availability",
      title: "Availability and mirrors",
      body: [
        "The Service is provided on an “as available” basis. Third-party mirrors, catalogs and indexes may be slow, change, break or disappear, and automatic fallback between mirrors is a convenience, not a guarantee. We offer no uptime commitment or service level.",
        "We may perform maintenance, apply security measures, or suspend any part of the Service at any time.",
      ],
    },
    {
      id: "ip",
      title: "Intellectual property",
      body: [
        `The ${SITE.name} name, logo, layout, original text and code are owned by the operator or its licensors and are protected by law, except for open-source components used under their own licences.`,
        "Posters, artwork, titles, trademarks, synopses and other catalog material belong to their respective owners and are shown for identification and informational purposes. We claim no ownership over them and are not affiliated with, endorsed by or sponsored by any studio, distributor, network or metadata provider.",
      ],
    },
    {
      id: "feedback",
      title: "Feedback",
      body: [
        "If you send us suggestions or feedback, you agree that we may use them without restriction or payment, and without any duty to credit you. Please do not send confidential information.",
      ],
    },
    {
      id: "copyright",
      title: "Copyright complaints",
      body: [
        "We respond to credible copyright notices. If you believe something listed, linked or embedded on KINO infringes your rights, follow the process in the Copyright & DMCA Policy.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      body: [
        "How data is handled when you use the Service is described in the Privacy Policy and the Cookies & Local Storage notice, which form part of these Terms.",
      ],
    },
    {
      id: "donations",
      title: "Donations",
      body: [
        "Any donation is voluntary, goes through a third-party platform, and does not buy a product, a service or any special access. See the Donations & Support terms.",
      ],
    },
    {
      id: "disclaimer",
      title: "Disclaimer of warranties",
      body: [
        "To the fullest extent permitted by law, the Service and everything reachable through it are provided “as is” and “as available”, without warranties of any kind, whether express, implied or statutory. This includes any warranty of merchantability, fitness for a particular purpose, accuracy, non-infringement, security, uninterrupted or error-free operation, and the absence of viruses or other harmful components.",
        "We make no promise about the legality, quality, accuracy or safety of any third-party content, player, download or website.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      body: [
        "To the fullest extent permitted by law, neither we nor anyone who contributes to the Service will be liable for any indirect, incidental, special, consequential, exemplary or punitive damages, or for loss of data, profits, goodwill or devices, arising out of or in connection with your use of, or inability to use, the Service or any third-party service reached through it.",
        "To the extent liability cannot be excluded, our total liability for all claims relating to the Service is limited to the greater of the amount you paid us for the Service (which is normally zero) and USD 50.",
        "Nothing in these Terms excludes or limits liability that cannot lawfully be excluded or limited, such as liability for fraud, or for death or personal injury caused by negligence, or your statutory consumer rights where they apply.",
      ],
    },
    {
      id: "indemnity",
      title: "Indemnification",
      body: [
        "To the extent permitted by law, you agree to defend, indemnify and hold harmless the operator and its contributors from claims, losses, liabilities and expenses (including reasonable legal fees) arising from your breach of these Terms, your unlawful use of the Service, or your use of third-party content or downloads.",
      ],
    },
    {
      id: "termination",
      title: "Suspension and termination",
      body: [
        "We may restrict, suspend or end your access at any time, with or without notice, for example if we reasonably believe you have breached these Terms, are abusing the Service, or are creating risk or legal exposure for us or others. You may stop using the Service at any time.",
        "Sections that by their nature should survive termination (including intellectual property, disclaimers, limitation of liability, indemnification and governing law) will survive.",
      ],
    },
    {
      id: "law",
      title: "Governing law and disputes",
      body: [
        `These Terms are governed by the laws of ${SITE.jurisdiction}, without regard to conflict-of-law rules, and subject to any mandatory consumer protections of the country where you live.`,
        "Before starting a formal claim, please contact us and give us a reasonable chance (at least 30 days) to resolve the issue informally. If it cannot be resolved, disputes will be brought in the competent courts of that jurisdiction, unless mandatory law gives you the right to bring proceedings elsewhere.",
      ],
    },
    {
      id: "sanctions",
      title: "Export controls and sanctions",
      body: [
        "You may not use the Service if you are subject to applicable sanctions or if doing so would violate export-control or sanctions laws that apply to you.",
      ],
    },
    {
      id: "electronic",
      title: "Electronic communications",
      body: [
        "You agree that we may communicate with you by posting notices on the site or, where you contact us first, by replying to the address you used. These electronic communications satisfy any legal requirement that communications be in writing.",
      ],
    },
    {
      id: "general",
      title: "General terms",
      body: [
        "Entire agreement: these Terms and the documents they refer to are the whole agreement between you and us about the Service.",
        "Severability: if a provision is found unenforceable, the rest remains in effect and the provision will be enforced to the maximum extent allowed.",
        "No waiver: our not enforcing a right is not a waiver of it.",
        "Assignment: you may not transfer your rights under these Terms. We may assign ours, for example in connection with a transfer of the Service.",
        "Force majeure: we are not liable for failure or delay caused by events outside our reasonable control, including outages of hosting, network or third-party providers.",
        "Language: if these Terms are translated, the English version prevails where the law allows. Headings are for convenience only.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: [
        `Questions about these Terms: ${SITE.email}. See the Contact & Reporting page for the right channel for each type of request.`,
      ],
    },
  ],
};
