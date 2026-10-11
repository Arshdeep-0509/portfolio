import { siteConfig } from "@/content/site";
import { journalContent } from "@/content/journal";
import { getPosts } from "@/lib/mdx";
import { absoluteUrl } from "@/lib/utils";

/**
 * RSS 2.0 feed of published journal posts at /journal/rss.xml (drafts never appear in production).
 * Built at build time. The old /rss.xml address redirects here (next.config.ts).
 */

const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function GET() {
  const posts = siteConfig.featureFlags.blog ? getPosts() : [];
  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/journal/${post.slug}`);
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(post.description)}</description>
      <category>${escape(post.category)}</category>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${siteConfig.name} — ${journalContent.rss.title}`)}</title>
    <link>${absoluteUrl("/journal")}</link>
    <description>${escape(journalContent.seo.description)}</description>
    <language>en-in</language>
    <atom:link href="${absoluteUrl("/journal/rss.xml")}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
