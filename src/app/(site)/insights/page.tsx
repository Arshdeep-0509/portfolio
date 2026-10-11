import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightsBrowser } from "@/components/sections/insights/InsightsBrowser";
import { NewsletterCard } from "@/components/sections/insights/NewsletterCard";
import { CompactPageHero } from "@/components/sections/shared/CompactPageHero";
import { Section } from "@/components/ui/Section";
import { insightsContent } from "@/content/insights";
import { siteConfig } from "@/content/site";
import { getPosts } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

const base = buildMetadata({
  title: insightsContent.seo.title,
  description: insightsContent.seo.description,
  path: "/insights",
});

export const metadata: Metadata = {
  ...base,
  alternates: { ...base.alternates, types: { "application/rss+xml": "/rss.xml" } },
};

export default function InsightsPage() {
  if (!siteConfig.featureFlags.blog) notFound();

  const { hero, browser, newsletter } = insightsContent;
  // Only card fields go to the client — never the MDX bodies.
  const posts = getPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    category: post.category,
    cover: post.cover,
    coverAlt: post.coverAlt,
    readingMinutes: post.readingMinutes,
    featured: post.featured,
    draft: post.draft,
  }));

  return (
    <>
      <CompactPageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Insights" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
      />
      <Section background="section" aria-label="Articles">
        <InsightsBrowser posts={posts} copy={browser} />
      </Section>
      <Section background="white" padding="sm" aria-label="Newsletter">
        <NewsletterCard copy={newsletter} />
      </Section>
    </>
  );
}
