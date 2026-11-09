import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

/**
 * robots.txt. Built once per deployment, so VERCEL_ENV is fixed for its lifetime: preview
 * deployments block every crawler (next.config.ts also sends X-Robots-Tag: noindex there).
 *
 * /pay, /press and /dev/ui are deliberately NOT disallowed: they carry a noindex meta tag, and a
 * crawler can only see that tag if it is allowed to fetch the page.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
