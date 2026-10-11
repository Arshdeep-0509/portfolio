"use client";

import { usePathname } from "next/navigation";
import { CTABand } from "@/components/layout/CTABand";
import type { CTABandContent } from "@/content/ctaBand";

type SiteCTABandProps = {
  /** From ctaBandOverrides.ts, passed in by the server SiteShell. */
  overrides: Record<string, Partial<CTABandContent> | null>;
};

/** The layout's CTA band: applies the override for the current path, or hides it (null). */
export function SiteCTABand({ overrides }: SiteCTABandProps) {
  const pathname = usePathname();
  const override = overrides[pathname];
  if (override === null) return null;
  return <CTABand {...override} />;
}
