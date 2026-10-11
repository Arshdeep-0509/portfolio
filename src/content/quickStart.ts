/**
 * Copy for the QuickStart section that closes every page except /contact. Keep this module free
 * of heavy imports: it is read by a client component.
 */
export const quickStartCopy = {
  label: "Start here",
  title: "Tell me what you're building.",
  text: "Three short fields are enough. I read every message myself and answer within one business day.",
  fields: {
    name: "Your name",
    email: "Email",
    idea: "The idea, in one line",
    ideaPlaceholder: "e.g. A booking app for my three coaching centres",
  },
  consent: { before: "I accept the", link: "Privacy Policy", href: "/privacy-policy" },
  submit: "Send it over",
  sending: "Sending…",
  fullForm: { label: "Prefer the full form?", href: "/contact" },
  success: {
    title: "Thank you, {firstName}. It's with me now.",
    text: "A copy is on its way to your inbox, and I'll write back within one business day. If nothing arrives, peek in your spam folder.",
  },
  error: {
    title: "Your note didn't go through",
    fallback: "Write to me by email instead",
    offline: "Check your connection, then try again.",
    retry: "Try again in a moment.",
    botCheck: "Finish the quick human check above the button first.",
  },
};
