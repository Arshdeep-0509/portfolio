import type { IconName } from "@/content/services";

/**
 * Copy for /pay (noindex, not linked from navigation). The Razorpay button id and payment link
 * live in siteConfig.payments.
 */
export const payContent = {
  seo: {
    title: "Pay an Invoice",
    description: "Securely pay an invoice or project advance to Arshdeep Singh through Razorpay.",
  },
  hero: {
    eyebrow: "Payments",
    title: "Pay an invoice or deposit",
    highlight: "invoice or deposit",
    subtitle:
      "A quick, secure way to pay a project advance, milestone or monthly invoice — by UPI, card or net banking.",
  },
  steps: {
    title: "How it works",
    items: [
      "Have your invoice handy — you'll need the invoice number and the amount.",
      "Click the payment button and enter the amount and your details in Razorpay's secure checkout.",
      "Pay by UPI, card or net banking. Razorpay handles the payment; this site never sees your card or bank details.",
      "You'll get a receipt from Razorpay straight away, and I'll confirm and mark the invoice as paid within one business day.",
    ],
  },
  methods: {
    title: "Accepted payment methods",
    items: [
      { icon: "Smartphone", label: "UPI (GPay, PhonePe, Paytm…)" },
      { icon: "CreditCard", label: "Credit and debit cards" },
      { icon: "Landmark", label: "Net banking" },
    ] satisfies { icon: IconName; label: string }[],
  },
  security:
    "Payments are processed by Razorpay, a PCI DSS–compliant payment gateway. Card details are entered on Razorpay's checkout and are never collected or stored by this website.",
  card: {
    title: "Make a payment",
    text: "Enter the amount shown on your invoice and add the invoice number in the notes.",
    linkCta: "Pay securely with Razorpay",
    placeholder:
      "Online payment isn't set up yet. Please pay using the bank or UPI details on your invoice, or email me for a payment link.",
    other: "Prefer a bank transfer? The account details are on your invoice.",
  },
  policies: {
    text: "By paying you agree to the",
    terms: { label: "Terms & Conditions", href: "/terms-and-conditions" },
    refund: { label: "Refund & Cancellation Policy", href: "/refund-policy" },
  },
};
