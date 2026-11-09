"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { NewsletterCopy } from "@/components/layout/NewsletterForm";
import { WhenNear } from "@/components/ui/WhenNear";

// Both forms bring react-hook-form and zod with them, about 50 KB gzipped, and both sit at the
// bottom of every page. They load as the visitor gets close, not with the first paint.
const QuickStartForm = dynamic(
  () => import("@/components/layout/QuickStartForm").then((mod) => mod.QuickStartForm),
  { ssr: false },
);
const NewsletterForm = dynamic(
  () => import("@/components/layout/NewsletterForm").then((mod) => mod.NewsletterForm),
  { ssr: false },
);

/** /contact has its own, fuller form. */
export function NotOnContact({ children }: { children: React.ReactNode }) {
  return usePathname() === "/contact" ? null : children;
}

export function LazyQuickStartForm({ emailHref }: { emailHref: string | null }) {
  return (
    <WhenNear className="min-h-[34rem] sm:min-h-[26rem]">
      <QuickStartForm emailHref={emailHref} />
    </WhenNear>
  );
}

export function LazyNewsletterForm({ copy, location }: { copy: NewsletterCopy; location: string }) {
  return (
    <WhenNear className="min-h-80">
      <NewsletterForm copy={copy} location={location} />
    </WhenNear>
  );
}
