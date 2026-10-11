import { NextResponse, type NextRequest } from "next/server";
import { services } from "@/content/services";
import { siteConfig } from "@/content/site";
import { getMdxSlugs, type MdxCollection } from "@/lib/mdx";

/**
 * Real 404 status codes for unknown slugs.
 *
 * Detail pages stream their prerendered shell before the page body runs, so a notFound() in the
 * page can only produce a 200 with a noindex 404 page (a "soft 404"). Checking here, before
 * rendering starts, lets Next.js answer with a proper 404.
 */
const serviceSlugs = new Set(services.map((service) => service.slug));

function mdxSlugExists(collection: MdxCollection, slug: string): boolean {
  try {
    return getMdxSlugs(collection).includes(slug);
  } catch {
    // If content/ can't be read on this host, let the page decide (it still renders the
    // noindex 404 UI) rather than risk a false 404 for a real post.
    return true;
  }
}

export function proxy(request: NextRequest) {
  const [, section, slug, ...rest] = request.nextUrl.pathname.split("/");
  if (!slug || rest.length > 0) return NextResponse.next();
  // Section-level metadata routes (e.g. /services/opengraph-image) aren't slugs.
  if (/^(opengraph|twitter)-image/.test(slug)) return NextResponse.next();

  const exists =
    section === "services"
      ? serviceSlugs.has(slug)
      : section === "work"
        ? mdxSlugExists("work", slug)
        : section === "insights"
          ? siteConfig.featureFlags.blog && mdxSlugExists("insights", slug)
          : true;

  if (exists) return NextResponse.next();
  // An unmatched internal path renders the root not-found page with a 404 status.
  return NextResponse.rewrite(new URL("/__not-found", request.url));
}

export const config = {
  matcher: ["/services/:slug", "/work/:slug", "/insights/:slug"],
};
