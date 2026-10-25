import { SITE } from "@/lib/site-config";
import type { LegalDoc } from "../types";

export const donations: LegalDoc = {
  slug: "donations",
  title: "Donations & Support",
  kicker: "Tips are thanks, not tickets",
  summary:
    "How voluntary donations work, what they do and do not buy, and how refunds and data are handled.",
  sections: [
    {
      id: "voluntary",
      title: "Voluntary and optional",
      body: [
        "Every part of KINO is free to use. Donations are optional gifts to help with running costs and development. They are not payment for content, and no one is required to donate.",
      ],
    },
    {
      id: "nothing-bought",
      title: "What a donation does not buy",
      body: [
        "A donation does not give you ownership, a licence, premium features, priority support, removal of any content, or any right to influence the Service. There is no subscription and no recurring billing from KINO itself.",
      ],
    },
    {
      id: "processor",
      title: "Payment processing",
      body: [
        "Donations are processed by an independent third-party platform under its own terms and privacy policy. We do not receive or store your card or bank details. We only see what that platform shares with us, such as a display name, message or amount, if you provide them.",
      ],
    },
    {
      id: "refunds",
      title: "Refunds",
      body: [
        "Donations are generally non-refundable. If you donated by mistake or without authorisation, contact the donation platform first, because it controls the payment. You may also write to us and we will consider requests in good faith, subject to the law. This does not affect any statutory rights you have.",
      ],
    },
    {
      id: "tax",
      title: "Tax",
      body: [
        "Donations are not tax-deductible unless the platform or the operator tells you otherwise in writing. You are responsible for any taxes that apply to you.",
      ],
    },
    {
      id: "use-of-funds",
      title: "Use of funds",
      body: [
        "Donations are used at the operator’s discretion, generally for hosting, bandwidth, data services and development. We make no promise about specific uses or about the continued operation of the Service.",
      ],
    },
    {
      id: "fraud",
      title: "Fraud and chargebacks",
      body: [
        "We may report suspected fraud and may cooperate with the platform and authorities. Abuse of the donation system may lead to access restrictions under the Acceptable Use Policy.",
      ],
    },
    {
      id: "contact",
      title: "Questions",
      body: [`Questions about donations: ${SITE.email}.`],
    },
  ],
};
