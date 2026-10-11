import type { LegalDocument } from "@/content/legal/types";

/**
 * Refund & Cancellation Policy (payment gateways such as Razorpay require one). A starting
 * template — not legal advice. Have a lawyer review it before launch.
 */
export const refundPolicy: LegalDocument = {
  title: "Refund & Cancellation Policy",
  path: "/refund-policy",
  description:
    "When payments can be refunded, how to cancel a project and how to request a refund — clear and fair to both sides.",
  lastUpdated: "2026-10-10",
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          type: "p",
          text: "I provide custom services — design, development, AI, cloud and marketing work done specifically for you — so time and effort are spent from the moment a project starts. This policy explains what can be refunded and how. It forms part of the [Terms & Conditions](/terms-and-conditions); if your signed proposal or SOW says something different, the proposal or SOW applies.",
        },
        {
          type: "note",
          text: "In short: the advance is non-refundable once work starts, approved milestones are non-refundable, and prepaid work that hasn't been done is refunded within [10] working days.",
        },
      ],
    },
    {
      id: "advance-payments",
      title: "Advance payments",
      blocks: [
        {
          type: "p",
          text: "The advance (usually [30–50]% of the project fee) reserves time in my schedule and covers discovery, planning and early work. **It's non-refundable once work has started.** If you cancel before any work has started, I'll refund the advance in full, minus any payment-gateway charges.",
        },
      ],
    },
    {
      id: "milestones",
      title: "Milestone payments",
      blocks: [
        {
          type: "p",
          text: "Payments for milestones you've approved (including milestones treated as approved under the Terms) are non-refundable, because that work has been delivered. If a delivered milestone doesn't match the agreed scope, tell me — I'll fix it at no cost rather than refund it.",
        },
      ],
    },
    {
      id: "prepaid-unused-work",
      title: "Prepaid work that hasn't been done",
      blocks: [
        {
          type: "p",
          text: "If you've paid for work that hasn't been started or delivered — for example a prepaid milestone, a monthly retainer or a support plan — and the project is cancelled, **I'll refund the unused part within [10] working days** of the cancellation being confirmed. Work in progress is billed for the portion completed.",
        },
      ],
    },
    {
      id: "cancellation",
      title: "Cancelling a project",
      blocks: [
        { type: "h3", text: "If you cancel" },
        {
          type: "p",
          text: "You can cancel at any time by giving [7] days' written notice by email. You'll pay for work done up to the end of the notice period, and receive everything completed and paid for, with source code and access.",
        },
        { type: "h3", text: "If I cancel" },
        {
          type: "p",
          text: "If I have to end a project for reasons on my side, I'll give you [7] days' written notice, hand over all work done so far and refund everything you've paid for work that hasn't been delivered.",
        },
        { type: "h3", text: "Monthly services" },
        {
          type: "p",
          text: "Retainers, support and marketing plans can be cancelled with [15] days' notice before the next billing date. The current month isn't refunded unless no work has been done in it.",
        },
      ],
    },
    {
      id: "non-refundable",
      title: "What isn't refundable",
      blocks: [
        {
          type: "ul",
          items: [
            "Advances once work has started, and approved milestones.",
            "Third-party costs paid on your behalf: domains, hosting, licences, paid APIs, stock assets, app store fees and advertising spend.",
            "Consultations, audits and calls that have already taken place.",
            "Payment-gateway and bank charges on refunded amounts.",
          ],
        },
      ],
    },
    {
      id: "how-to-request",
      title: "How to request a refund",
      blocks: [
        {
          type: "ul",
          items: [
            'Email arshdeepsinghdev96@gmail.com with the subject "Refund request", your invoice number and the reason.',
            "I'll reply within [3] working days to confirm the amount, or to explain if part of it isn't refundable.",
            "Once agreed, the refund is sent within [10] working days to the original payment method (card, UPI or net banking via Razorpay) or by bank transfer. Your bank may take a few more days to show it.",
          ],
        },
        {
          type: "p",
          text: "If you're unhappy with how a refund request was handled, please tell me — I'd much rather sort it out together.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        {
          type: "p",
          text: "Questions about payments or refunds? Email arshdeepsinghdev96@gmail.com or write to [LEGAL_ENTITY], [ADDRESS], Bengaluru, [STATE], India.",
        },
      ],
    },
  ],
};
