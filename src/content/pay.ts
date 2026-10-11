/**
 * Copy for /pay (noindex, not linked from navigation). The Razorpay button id and payment link
 * live in siteConfig.payments.
 */
export const payContent = {
  seo: {
    title: "Invoice Payments",
    description:
      "Settle an invoice or an advance with Arshdeep Singh via Razorpay's secure checkout.",
  },
  hero: {
    label: "Payments",
    title: "Settle an invoice or a deposit",
    text: "Advances, milestone payments and monthly invoices can all be paid here in a minute, by UPI, card or net banking.",
  },
  steps: {
    title: "How payment works",
    items: [
      "Keep your invoice nearby — you'll need its number and the amount.",
      "Press the payment button and fill in the sum and your details on Razorpay's protected checkout.",
      "Choose UPI, card or net banking. Razorpay processes it, and your card or bank details never touch this site.",
      "Razorpay sends a receipt at once, and I confirm and mark the invoice paid within one business day.",
    ],
  },
  methods: {
    title: "Ways to pay",
    items: ["UPI (GPay, PhonePe, Paytm…)", "Debit or credit card", "Net banking"],
  },
  security:
    "Razorpay, a PCI DSS–compliant gateway, handles every payment. You type card details into Razorpay's own checkout; this website never receives or keeps them.",
  card: {
    title: "Pay now",
    text: "Enter the amount on your invoice and put the invoice number in the notes.",
    linkCta: "Pay securely through Razorpay",
    placeholder:
      "Paying online isn't available just yet. Use the bank or UPI details printed on your invoice, or email me and I'll send a payment link.",
    other: "Would a bank transfer suit you better? The account details are on your invoice.",
  },
  policies: {
    text: "Paying means you accept the",
    terms: { label: "Terms & Conditions", href: "/terms-and-conditions" },
    refund: { label: "Refund & Cancellation Policy", href: "/refund-policy" },
  },
};
