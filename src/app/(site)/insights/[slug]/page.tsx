import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  ReadingProgress,
  ShareButtons,
  TableOfContents,
} from "@/components/sections/insights/PostWidgets";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PostCard } from "@/components/ui/cards/PostCard";
import { ServiceLinkCard } from "@/components/ui/cards/ServiceLinkCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { insightsContent } from "@/content/insights";
import { socialLinks } from "@/content/navigation";
import { getService, type ServiceEntry } from "@/content/services";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";
import { isUnoptimized } from "@/lib/images";
import {
  EMPTY_COLLECTION_SLUG,
  extractHeadings,
  getPost,
  getPosts,
  type PostMeta,
} from "@/lib/mdx";
import { MdxContent } from "@/lib/mdx-render";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, formatDate } from "@/lib/utils";

// Await params at the top so unknown slugs return a real HTTP 404. Every valid slug is prerendered,
// so opting out of instant-navigation validation costs nothing here.
export const instant = false;

export function generateStaticParams() {
  const slugs = getPosts().map((post) => ({ slug: post.slug }));
  // Cache Components needs at least one entry; the placeholder slug renders a 404.
  return slugs.length ? slugs : [{ slug: EMPTY_COLLECTION_SLUG }];
}

export async function generateMetadata({
  params,
}: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const base = buildMetadata({
    title: post.title,
    description: post.description,
    path: `/insights/${post.slug}`,
    image: isUnoptimized(post.cover) ? false : post.cover,
    type: "article",
  });
  return {
    ...base,
    alternates: { ...base.alternates, types: { "application/rss+xml": "/rss.xml" } },
    // Drafts are only reachable in development or SHOW_DRAFTS previews; never index them.
    ...(post.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Same category first, then the most recent others. */
function relatedPosts(post: PostMeta, all: PostMeta[]) {
  const others = all.filter((entry) => entry.slug !== post.slug);
  return [
    ...others.filter((entry) => entry.category === post.category),
    ...others.filter((entry) => entry.category !== post.category),
  ].slice(0, 3);
}

export default async function PostPage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const post = siteConfig.featureFlags.blog ? getPost(slug) : undefined;
  if (!post) notFound();

  const headings = extractHeadings(post.body);
  const related = relatedPosts(post, getPosts());
  const url = absoluteUrl(`/insights/${post.slug}`);
  const copy = insightsContent.post;
  const relatedServices = post.services
    .map((slug) => getService(slug))
    .filter((service): service is ServiceEntry => Boolean(service));
  const { founder } = siteConfig;
  const hasPhoto = !isPlaceholder(founder.photo);

  return (
    <>
      <ReadingProgress targetId="article-body" />

      <header className="bg-tint">
        <Container size="narrow" className="py-12 sm:py-16">
          <Breadcrumb
            jsonLd
            items={[
              { label: "Home", href: "/" },
              { label: "Insights", href: "/insights" },
              { label: post.title },
            ]}
          />
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Badge variant="soft">{post.category}</Badge>
            {post.draft ? <Badge variant="outline">Draft — not published</Badge> : null}
          </div>
          <h1 className="mt-4 text-h1 font-extrabold tracking-tight">{post.title}</h1>
          <p className="mt-4 text-lg text-muted">{post.description}</p>
          <p className="mt-5 text-small text-muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.updated ? (
              <>
                {" "}
                (updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>)
              </>
            ) : null}
            <span aria-hidden="true"> · </span>
            {post.readingMinutes} min read
            <span aria-hidden="true"> · </span>
            {post.category}
          </p>
        </Container>
      </header>

      <Container className="pt-10">
        <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-xl border border-border bg-soft shadow-card">
          <Image
            src={post.cover}
            alt={post.coverAlt ?? ""}
            fill
            preload
            sizes="(min-width: 1100px) 1024px, 100vw"
            unoptimized={isUnoptimized(post.cover)}
            className="object-cover"
          />
        </div>
      </Container>

      <Section background="white" padding="sm" aria-label="Article">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <article id="article-body" className="min-w-0">
            {headings.length > 0 ? (
              <details className="mb-8 rounded-lg border border-border bg-tint p-4 lg:hidden">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold text-ink">
                  {copy.toc}
                  <ChevronDown aria-hidden="true" className="size-4" />
                </summary>
                <div className="mt-3">
                  <TableOfContents headings={headings} label={copy.toc} />
                </div>
              </details>
            ) : null}

            <div className="prose max-w-none">
              <MdxContent source={post.body} />
            </div>

            {relatedServices.length > 0 ? (
              <section aria-labelledby="related-services-title" className="mt-12">
                <h2 id="related-services-title" className="text-h3 font-bold">
                  {copy.relatedServices}
                </h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {relatedServices.map((service) => (
                    <li key={service.slug}>
                      <ServiceLinkCard
                        href={`/services/${service.slug}`}
                        icon={service.icon}
                        title={service.title}
                        tagline={service.tagline}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="mt-12 border-t border-border pt-8">
              <ShareButtons
                url={url}
                title={post.title}
                label={copy.share}
                copiedLabel={copy.copied}
              />
            </div>

            <aside
              aria-label="About the author"
              className="mt-10 flex flex-col gap-5 rounded-xl border border-border bg-tint p-6 sm:flex-row"
            >
              <Image
                src={hasPhoto ? founder.photo : "/images/founder-placeholder.svg"}
                alt={
                  hasPhoto
                    ? `Portrait of ${founder.name}`
                    : `Placeholder for ${founder.name}'s portrait`
                }
                width={80}
                height={80}
                unoptimized={!hasPhoto}
                className="size-20 shrink-0 rounded-pill object-cover"
              />
              <div>
                <p className="font-heading text-h3 font-bold text-ink">{founder.name}</p>
                <p className="text-small font-semibold text-primary">{founder.role}</p>
                <p className="mt-2 text-small text-muted">{copy.author.bio}</p>
                <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-small font-semibold">
                  {copy.author.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-primary hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {socialLinks.map((social) => (
                    <li key={social.key}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${social.label} (opens in a new tab)`}
                        className="inline-flex size-11 items-center justify-center rounded-pill border border-border text-ink hover:text-primary"
                      >
                        <SocialIcon name={social.key} className="size-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </article>

          {headings.length > 0 ? (
            <div className="hidden lg:block">
              <div className="sticky top-[calc(var(--header-h)+2rem)]">
                <TableOfContents headings={headings} label={copy.toc} />
              </div>
            </div>
          ) : null}
        </div>
      </Section>

      {related.length > 0 ? (
        <Section background="tint" aria-labelledby="related-posts-title">
          <h2 id="related-posts-title" className="text-h2 font-extrabold tracking-tight">
            {copy.related}
          </h2>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <PostCard post={item} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated ?? post.date,
          url,
          mainEntityOfPage: url,
          ...(isUnoptimized(post.cover) ? {} : { image: absoluteUrl(post.cover) }),
          articleSection: post.category,
          keywords: post.tags.join(", "),
          author: { "@type": "Person", name: founder.name, url: absoluteUrl("/about") },
          publisher: { "@type": "Person", name: founder.name, url: absoluteUrl("/") },
        }}
      />
    </>
  );
}
