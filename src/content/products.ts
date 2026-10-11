import type { BadgeVariant } from "@/components/ui/Badge";
import type { IconName } from "@/content/services";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";

/**
 * Own products and initiatives. Statuses and descriptions must match reality —
 * review every entry before launch.
 */

export type Product = {
  slug: string;
  icon: IconName;
  name: string;
  description: string;
  statuses: { label: string; variant: BadgeVariant }[];
  features: string[];
  cta: { label: string; href: string };
  /** "wide" spans the full row and shows `bullets` and `note`. */
  variant?: "default" | "wide";
  bullets?: string[];
  note?: string;
};

// Until a real Calendly link replaces [CALENDLY_URL], send people to the contact form instead
// of a broken link.
const bookingHref = isPlaceholder(siteConfig.calendlyUrl)
  ? "/contact?topic=mvp-scoping"
  : siteConfig.calendlyUrl;

export const products: Product[] = [
  {
    slug: "school-platform",
    icon: "GraduationCap",
    name: "School Management Platform",
    description:
      "A unified web and mobile platform for schools from pre-primary to senior secondary, with role-based access for every user and agentic AI assistants for staff, students and parents.",
    statuses: [{ label: "In development", variant: "in-development" }],
    features: ["RBAC", "Web + App", "Agentic AI"],
    cta: { label: "Request updates", href: "/contact?topic=school-platform" },
  },
  {
    slug: "saas-observability",
    icon: "ChartNoAxesCombined",
    name: "Multi-Tenant SaaS Analytics & Observability Platform",
    description:
      "Tenant-isolated analytics, dashboards and alerting for SaaS teams that need to see how each customer uses — and experiences — their product.",
    statuses: [{ label: "In development", variant: "in-development" }],
    features: ["Multi-tenant", "Observability", "DevOps"],
    cta: { label: "Follow the build", href: "/work" },
  },
  {
    slug: "mvp-scoping",
    icon: "CalendarCheck",
    name: "Free MVP scoping session",
    description:
      "A 30-minute call to cut your idea down to a first version you can actually launch.",
    statuses: [{ label: "Limited", variant: "limited" }],
    features: ["30 minutes", "Video call", "Free"],
    variant: "wide",
    bullets: [
      "Bring: your idea, who it's for, and any sketches or competitor links",
      "Leave with: a feature shortlist, a suggested stack and a rough timeline",
      "For: founders before their first build, or rethinking an MVP that stalled",
    ],
    note: "No sales pressure. If I'm not the right fit, I'll say so.",
    cta: { label: "Book a slot", href: bookingHref },
  },
];
