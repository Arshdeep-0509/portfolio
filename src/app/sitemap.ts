import type { MetadataRoute } from "next";
import { cookiePolicy } from "@/content/legal/cookies";
import { privacyPolicy } from "@/content/legal/privacy";
import { refundPolicy } from "@/content/legal/refund";
import { termsAndConditions } from "@/content/legal/terms";
import { services } from "@/content/services";
import { siteConfig } from "@/content/site";
import { getCaseStudies, getPosts } from "@/lib/mdx";
import { CONTENT_UPDATED, staticRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/utils";

/**
 * sitemap.xml. Case studies and posts are read from content/, so a new .mdx file appears here
 * with no code change. Drafts and noindex routes (/pay, /dev/ui) are excluded.
 *
 * lastModified: legal pages use their own `lastUpdated`, /work and /insights the newest entry,
 * everything else CONTENT_UPDATED (src/lib/routes.ts — bump it when you change page copy).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const blog = siteConfig.featureFlags.blog;
  const studies = getCaseStudies();
  const posts = blog ? getPosts() : [];
  const newest = (dates: string[]) => dates.sort().at(-1) ?? CONTENT_UPDATED;

  const lastModified: Record<string, string> = {
    [privacyPolicy.path]: privacyPolicy.lastUpdated,
    [termsAndConditions.path]: termsAndConditions.lastUpdated,
    [cookiePolicy.path]: cookiePolicy.lastUpdated,
    [refundPolicy.path]: refundPolicy.lastUpdated,
    "/work": newest(studies.map((study) => study.publishedAt)),
    "/insights": newest(posts.map((post) => post.updated ?? post.date)),
  };

  const priority: Record<string, number> = { "/": 1, "/services": 0.9, "/contact": 0.9 };
  const legalPaths = new Set(
    [privacyPolicy, termsAndConditions, cookiePolicy, refundPolicy].map((doc) => doc.path),
  );

  const pages = staticRoutes
    .filter((route) => !route.noIndex)
    .filter((route) => blog || route.href !== "/insights")
    .map((route) => ({
      url: absoluteUrl(route.href),
      lastModified: lastModified[route.href] ?? CONTENT_UPDATED,
      priority: priority[route.href] ?? (legalPaths.has(route.href) ? 0.3 : 0.7),
    }));

  const servicePages = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    lastModified: CONTENT_UPDATED,
    priority: 0.8,
  }));

  const caseStudies = studies.map((study) => ({
    url: absoluteUrl(`/work/${study.slug}`),
    lastModified: study.publishedAt,
    priority: 0.6,
  }));

  const postPages = posts.map((post) => ({
    url: absoluteUrl(`/insights/${post.slug}`),
    lastModified: post.updated ?? post.date,
    priority: 0.6,
  }));

  return [...pages, ...servicePages, ...caseStudies, ...postPages];
}
