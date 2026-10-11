import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JournalIndex } from "@/components/sections/journal/JournalIndex";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { journalContent } from "@/content/journal";
import { siteConfig } from "@/content/site";
import { getPosts } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

const base = buildMetadata({
  title: journalContent.seo.title,
  description: journalContent.seo.description,
  path: "/journal",
});

export const metadata: Metadata = {
  ...base,
  alternates: { ...base.alternates, types: { "application/rss+xml": "/journal/rss.xml" } },
};

/** The journal as an editorial index: featured post, then dated rows. */
export default function JournalPage() {
  if (!siteConfig.featureFlags.blog) notFound();

  const { hero, index } = journalContent;
  // Only row fields go to the client — never the MDX bodies.
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
    <Section tone="ivory" padding="none" className="pt-16 pb-24 lg:pt-24 lg:pb-32">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Journal" }]} />
      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h1 className="text-h1 text-fg lg:col-span-7">{hero.title}</h1>
        <p className="text-lg text-fg-muted lg:col-span-4 lg:col-start-9">{hero.text}</p>
      </div>
      <div className="mt-14">
        <JournalIndex posts={posts} copy={index} />
      </div>
    </Section>
  );
}
