import { SITE } from "@/lib/site-config";
import type { LegalDoc } from "../types";

export const dmca: LegalDoc = {
  slug: "dmca",
  title: "Copyright & DMCA Policy",
  kicker: "Rights holders, start here",
  summary:
    "How to report content you believe infringes your rights, what we can remove, and how counter-notices work.",
  sections: [
    {
      id: "position",
      title: "Our approach",
      body: [
        "We respect intellectual property and expect others to do the same. KINO does not host video files, but we do display catalog information and link to or embed third-party services. If you believe an entry, link, embed or source on KINO infringes your copyright, you can ask us to review and remove it using this policy.",
        "This policy describes how we handle notices. It is not a representation that KINO qualifies for any statutory safe harbour, and it does not change anyone’s legal rights or duties.",
      ],
    },
    {
      id: "scope",
      title: "What we can and cannot remove",
      body: ["Because the files are on other people’s servers, our ability is specific:"],
      list: [
        "We can remove or disable an entry, link, embed, mirror or listing from KINO.",
        "We cannot delete a file from a third party’s server. For that, contact the operator of the server that hosts it, or its hosting provider.",
        "We can help by pointing you to the relevant third party if you tell us the URL where the content plays.",
      ],
    },
    {
      id: "notice",
      title: "How to send a takedown notice",
      body: [
        "Send a written notice to the address in the next section. To be actionable (and to meet the requirements of 17 U.S.C. § 512(c)(3) where it applies) it should include:",
      ],
      list: [
        "your name, address, telephone number and email, and a physical or electronic signature of the rights holder or authorised agent;",
        "a description of the copyrighted work you claim is infringed (a link to the official page is helpful);",
        "the exact URL(s) on KINO where the material or link appears, so we can find it. A screenshot helps;",
        "a statement that you have a good-faith belief that the use is not authorised by the copyright owner, its agent or the law;",
        "a statement, under penalty of perjury, that the information in the notice is accurate and that you are the owner or authorised to act for the owner.",
      ],
      after: [
        "Incomplete notices may be delayed or rejected. We may ask you for more detail.",
      ],
    },
    {
      id: "where",
      title: "Where to send notices",
      body: [
        `Email: ${SITE.email} with the subject line “Copyright notice”.`,
        `Operator: ${SITE.operator}. A postal address can be provided on request.`,
      ],
      note: "Please use the email channel above rather than social media or comment features so that your notice is logged.",
    },
    {
      id: "process",
      title: "What happens next",
      body: [
        "We acknowledge notices that include the information above and review them promptly. When a notice is valid, we aim to remove or disable the identified item from KINO within 72 hours.",
        "We may forward a copy of your notice (with your contact details) to anyone affected or to the third party operating the source, and we may keep a record of notices and our responses.",
      ],
    },
    {
      id: "counter",
      title: "Counter-notices",
      body: [
        "If you believe something was removed by mistake or misidentification, you can send a counter-notice that includes:",
      ],
      list: [
        "your name, address, telephone number and email, and your physical or electronic signature;",
        "a description of the removed item and where it appeared before removal;",
        "a statement, under penalty of perjury, that you have a good-faith belief it was removed by mistake or misidentification;",
        "your consent to the jurisdiction of the courts for your address (or, outside the US, an appropriate court), and to accept service from the person who sent the original notice.",
      ],
      after: [
        "We may pass a counter-notice to the original complainant. Where the law provides a statutory period, we will restore the item unless the complainant notifies us that they have started a court action.",
      ],
    },
    {
      id: "repeat",
      title: "Repeat or persistent issues",
      body: [
        "KINO has no user accounts and does not host user uploads. If a specific source, mirror or listing is repeatedly the subject of credible, well-founded claims, we may remove that source or listing from the Service permanently.",
      ],
    },
    {
      id: "misuse",
      title: "False or abusive notices",
      body: [
        "Knowingly sending a materially false notice or counter-notice can have legal consequences, including liability for damages and costs. Please make sure a notice is accurate before sending it. We may ignore requests that appear automated, abusive or unfounded.",
      ],
    },
    {
      id: "international",
      title: "Notices outside the United States",
      body: [
        "If your rights arise under the laws of another country (for example the EU or UK), you can still use this process. Include the legal basis for your claim and the details above, and we will treat it as a notice-and-action request.",
      ],
    },
    {
      id: "trademark",
      title: "Trademarks and other claims",
      body: [
        "For trademark, privacy, defamation or other legal complaints, write to the same address with the URL, the right you are relying on, and why the content infringes it. We will review it and respond as the law and these Terms require.",
      ],
    },
    {
      id: "reservation",
      title: "No waiver",
      body: [
        "Nothing in this policy limits any right or remedy available to you or to us. Submitting or receiving a notice does not admit liability.",
      ],
    },
  ],
};
