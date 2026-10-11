import type { LegalDocument } from "@/content/legal/types";
import { getServicesByGroup, serviceGroups } from "@/content/services";

/**
 * Terms & Conditions. A starting template — not legal advice. Have a lawyer review it before
 * launch. Numbers in [BRACKETS] are suggestions to confirm.
 */

// Generated from services.ts so the list always matches the services actually offered.
const servicesByGroup = serviceGroups.map(
  (group) =>
    `**${group.label}:** ${getServicesByGroup(group.id)
      .map((service) => service.title)
      .join(", ")}`,
);

export const termsAndConditions: LegalDocument = {
  title: "Terms & Conditions",
  path: "/terms-and-conditions",
  description:
    "The terms that apply when you use this website or work with me on a project — fees, timelines, ownership, confidentiality and support.",
  lastUpdated: "2026-10-10",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      blocks: [
        {
          type: "p",
          text: 'These terms apply to this website and to the services provided by Arshdeep Singh, trading as [LEGAL_ENTITY], [ADDRESS], Bengaluru, [STATE], India ("I", "me"), to you as a client ("you"). They\'re written in plain English so you know exactly what to expect when we work together.',
        },
      ],
    },
    {
      id: "acceptance",
      title: "Acceptance and entire agreement",
      blocks: [
        {
          type: "p",
          text: "By using this website, or by accepting a proposal, estimate or invoice from me, you agree to these terms. If you're accepting on behalf of a company, you confirm you're authorised to do so.",
        },
        {
          type: "p",
          text: "Each project is described in a written proposal or statement of work (SOW). **If a signed proposal or SOW says something different from these terms, the proposal or SOW wins.** Together, the proposal or SOW and these terms are the entire agreement between us for that project, and replace earlier discussions about it.",
        },
      ],
    },
    {
      id: "scope-of-services",
      title: "Scope of services",
      blocks: [
        { type: "p", text: "I offer the following services:" },
        { type: "ul", items: servicesByGroup },
        {
          type: "p",
          text: "The exact scope, deliverables, timeline and price of your project are set out in its proposal or SOW. Anything not listed there is out of scope.",
        },
        { type: "h3", text: "Change requests" },
        {
          type: "p",
          text: "Ideas change as products take shape — that's normal. If you'd like to add or change something, I'll tell you in writing how it affects the timeline and cost before doing it. Changes go ahead only once you approve them in writing (email or WhatsApp is fine).",
        },
      ],
    },
    {
      id: "client-responsibilities",
      title: "Client responsibilities",
      blocks: [
        { type: "p", text: "To keep your project on track, you agree to:" },
        {
          type: "ul",
          items: [
            "Provide content, access, credentials, feedback and decisions on time, as agreed in the project plan.",
            "Name one person who can give feedback and approvals for your side.",
            "Make sure you own or have permission to use everything you give me — text, images, logos, data and code — and that using it won't infringe anyone's rights.",
            "Use the deliverables lawfully, and comply with the laws that apply to your business and your users (including data protection and consumer laws).",
            "Keep your own accounts (hosting, domains, app stores, third-party services) in good standing and paid for.",
          ],
        },
        {
          type: "p",
          text: "Delays in your inputs may move the timeline. If a project is paused on your side for more than [30] days, I may reschedule the remaining work around my other commitments.",
        },
      ],
    },
    {
      id: "timelines-and-approvals",
      title: "Timelines, milestones and approvals",
      blocks: [
        {
          type: "p",
          text: "Projects are split into milestones, each with deliverables and an estimated date. Timelines are good-faith estimates based on the agreed scope and on receiving your inputs on time.",
        },
        {
          type: "p",
          text: "When I deliver a milestone, please review it and either approve it or tell me what doesn't match the agreed scope. **If I don't hear back within [7] days after a reminder, the milestone is treated as approved**, and work continues to the next one.",
        },
      ],
    },
    {
      id: "fees-and-payment",
      title: "Fees and payment",
      blocks: [
        {
          type: "ul",
          items: [
            "**Quotes:** in Indian rupees (INR) or US dollars (USD), as stated in the proposal. Quotes are valid for [30] days.",
            "**Advance:** an advance of [30–50]% of the project fee is due before work starts.",
            "**Milestones:** the rest is billed by milestone, as set out in the proposal. Ongoing work (support, retainers, marketing) is billed monthly in advance.",
            "**Taxes:** GST is added where applicable if I'm registered for GST. Clients outside India are responsible for any taxes or bank charges in their country.",
            "**Due date:** invoices are due within [15] days of the invoice date.",
            "**Late payment:** overdue amounts may attract a late fee of [1.5]% per month. If an invoice is unpaid for more than [15] days after its due date, I may pause work until it's paid; the timeline moves accordingly.",
            "**Third-party costs:** hosting, domains, paid APIs, licences, app store fees and ad spend are paid by you directly or reimbursed at cost, unless the proposal says otherwise.",
          ],
        },
        {
          type: "p",
          text: "Payments can be made by bank transfer, UPI or through the [secure payment page](/pay) (Razorpay).",
        },
      ],
    },
    {
      id: "refunds-and-cancellation",
      title: "Refunds and cancellation",
      blocks: [
        {
          type: "p",
          text: "In short: the advance is non-refundable once work has started, approved milestones are non-refundable, and any prepaid work that hasn't been done is refunded within [10] working days if the project is cancelled. Full details are in the [Refund & Cancellation Policy](/refund-policy).",
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      blocks: [
        {
          type: "ul",
          items: [
            "**Your deliverables:** once you've paid in full for a project, you own the custom code, designs and content I created specifically for you, and I'll hand over the source and access.",
            "**Before full payment:** you get a licence to review and test the work; ownership transfers on full payment.",
            "**My pre-existing tools:** reusable libraries, components, templates and know-how I had before your project (or build for general use) remain mine. You get a perpetual, royalty-free licence to use them as part of your deliverables.",
            "**Open-source software:** deliverables may include open-source components, which are governed by their own licences. I'll choose licences compatible with your use and respect their terms.",
            "**Your materials:** everything you give me — content, data, brand assets, existing code — remains yours. I use it only for your project.",
            "**Portfolio:** I may show non-confidential parts of the work (such as screenshots and a short description) in my portfolio once it's public. If you'd rather I didn't, just tell me in writing — you can opt out at any time.",
          ],
        },
      ],
    },
    {
      id: "confidentiality",
      title: "Confidentiality and NDA",
      blocks: [
        {
          type: "p",
          text: "I treat everything you share about your business, product and users as confidential, whether or not we sign an NDA. I use it only for your project, share it only with people who need it for the work and are bound by confidentiality, and don't disclose it to anyone else unless the law requires it.",
        },
        {
          type: "p",
          text: "Happy to sign a mutual NDA before you share details — just ask. Confidentiality continues after the project ends. It doesn't cover information that is already public, that I knew before you shared it, or that I receive independently from someone else.",
        },
      ],
    },
    {
      id: "warranty-and-support",
      title: "Warranty and support",
      blocks: [
        {
          type: "p",
          text: "For [30] days after launch (or after final delivery, if earlier), I'll fix bugs free of charge — that is, defects where the work doesn't do what the agreed scope says it should.",
        },
        {
          type: "p",
          text: "This doesn't cover new features or changes to the scope; problems caused by changes made by you or others; issues in third-party services, hosting or devices outside my control; or content you provide. Ongoing maintenance and support after this window are available as a separate plan.",
        },
      ],
    },
    {
      id: "third-party-services-and-ai",
      title: "Third-party services and AI tools",
      blocks: [
        {
          type: "p",
          text: "Most products rely on third-party services — cloud hosting, payment gateways, email, maps, AI models and app stores. Their own terms apply, and I'm not responsible for their outages, changes, pricing or policies, though I'll help you work around problems where I reasonably can.",
        },
        {
          type: "p",
          text: "I may use AI tools to work faster, for example to draft code, tests or copy. **Everything AI-assisted is reviewed by a human — me — before it's delivered**, and I don't put your confidential information into AI tools that use it to train their models. AI features built into your product produce outputs that can be wrong; part of the work is designing sensible checks, but you remain responsible for how those outputs are used.",
        },
      ],
    },
    {
      id: "liability",
      title: "Disclaimers and limitation of liability",
      blocks: [
        {
          type: "p",
          text: 'This website and its content are provided for general information, "as is". I work carefully and professionally, but I can\'t promise that any software will be completely error-free or that a product will achieve particular business results such as revenue, users or rankings.',
        },
        {
          type: "p",
          text: "To the extent the law allows: **my total liability for any project is limited to the fees you paid me for that project**, and I'm not liable for indirect or consequential losses, such as lost profits, revenue, data or business opportunities. Nothing in these terms limits liability that can't be limited by law, such as for fraud.",
        },
      ],
    },
    {
      id: "termination",
      title: "Termination",
      blocks: [
        {
          type: "p",
          text: "Either of us can end a project by giving [7] days' written notice. If that happens:",
        },
        {
          type: "ul",
          items: [
            "You pay for the work done up to the end of the notice period, including any approved milestones.",
            "I refund any prepaid amount for work that hasn't been done, as described in the [Refund & Cancellation Policy](/refund-policy).",
            "I hand over the work completed and paid for, with the source code and access.",
          ],
        },
        {
          type: "p",
          text: "Either of us can end a project immediately if the other seriously breaches these terms and doesn't fix the breach within [7] days of being told about it.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      blocks: [
        {
          type: "p",
          text: "I may update these terms from time to time; the \"Last updated\" date shows the latest version. Changes don't affect a project that's already underway — it continues under the terms in place when you accepted its proposal, unless we both agree otherwise.",
        },
      ],
    },
    {
      id: "governing-law",
      title: "Governing law and jurisdiction",
      blocks: [
        {
          type: "p",
          text: "These terms are governed by the laws of India. If a dispute arises, we'll first try to resolve it in good faith by talking. If that doesn't work within [30] days, the courts of Bengaluru, [STATE] will have exclusive jurisdiction.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        {
          type: "p",
          text: "Questions about these terms? Email arshdeepsinghdev96@gmail.com or write to [LEGAL_ENTITY], [ADDRESS], Bengaluru, [STATE], India.",
        },
      ],
    },
  ],
};
