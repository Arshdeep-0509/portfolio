import type { StatusKind } from "@/components/ui/StatusDot";
import { bookingHref } from "@/lib/booking";

/**
 * "From the lab": my own products and the free scoping call. Statuses and descriptions must match
 * reality — review every entry before launch.
 */

export type LabItem = {
  slug: string;
  kind: "product" | "offer";
  name: string;
  description: string;
  status: { kind: StatusKind; label: string };
  facts: string[];
  /** Extra lines for the offer card. */
  bullets?: string[];
  note?: string;
  cta: { label: string; href: string };
};

export const labItems: LabItem[] = [
  {
    slug: "trading-platform",
    kind: "product",
    name: "Trader's Platform",
    description:
      "Stock analysis built around an RSI-HA strategy — the Relative Strength Index read alongside Heikin-Ashi candles — for intraday and swing trading.",
    status: { kind: "in-development", label: "In development" },
    facts: ["RSI-HA", "Intraday", "Swing"],
    cta: { label: "Read the write-up", href: "/work/trading-platform" },
  },
  {
    slug: "pharma-inventory",
    kind: "product",
    name: "Hospital Pharmacy Inventory Management",
    description:
      "Software that keeps a hospital pharmacy's medicine stock in order: what's on the shelf, what's running low and what's close to expiry.",
    status: { kind: "in-development", label: "In development" },
    facts: ["Hospital pharmacy", "Stock control", "Expiry tracking"],
    cta: { label: "Ask about it", href: "/contact?topic=pharma-inventory" },
  },
  {
    slug: "mvp-scoping",
    kind: "offer",
    name: "Free 30-minute idea-to-scope call",
    description:
      "Thirty minutes spent shrinking your idea into a first release that's realistic to build.",
    status: { kind: "limited", label: "Limited" },
    facts: ["30 minutes", "Video call", "Free"],
    bullets: [
      "Come with the idea, the audience and any sketches or competitor links",
      "Go away with a short feature list, a stack suggestion and a ballpark timeline",
      "Best before a first build, or when an MVP has stalled",
    ],
    note: "No hard sell. If someone else suits you better, I'll tell you.",
    cta: { label: "Book a free call", href: bookingHref },
  },
];
