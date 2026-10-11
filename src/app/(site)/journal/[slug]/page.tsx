import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ReadingProgress, ShareButtons } from "@/components/sections/journal/PostWidgets";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ChapterNav } from "@/components/ui/ChapterNav";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { journalContent } from "@/content/journal";
import { socialLinks } from "@/content/navigation";
import { getService, type Service } from "@/content/services";
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
}: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const base = buildMetadata({
    title: post.title,
    description: post.description,
    path: `/journal/${post.slug}`,
    image: isUnoptimized(post.cover) ? false : post.cover,
    type: "article",
  });
  return {
    ...base,
    alternates: { ...base.alternates, types: { "application/rss+xml": "/journal/rss.xml" } },
    // Drafts are only reachable in development or SHOW_DRAFTS previews; never index them.
    ...(post.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Same topic first, then the most recent others. */
function relatedPosts(post: PostMeta, all: PostMeta[]) {
  const others = all.filter((entry) => entry.slug !== post.slug);
  return [
    ...others.filter((entry) => entry.category === post.category),
    ...others.filter((entry) => entry.category !== post.category),
  ].slice(0, 3);
}

/** A journal post on ivory: serif headings, a sticky table of contents in the margin, a hairline progress bar. */
export default async function PostPage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const post = siteConfig.featureFlags.blog ? getPost(slug) : undefined;
  if (!post) notFound();

  const headings = extractHeadings(post.body);
  const related = relatedPosts(post, getPosts());
  const url = absoluteUrl(`/journal/${post.slug}`);
  const copy = journalContent.post;
  const relatedServices = post.services
    .map((serviceSlug) => getService(serviceSlug))
    .filter((service): service is Service => Boolean(service));
  const { founder } = siteConfig;
  const hasPhoto = !isPlaceholder(founder.photo);
  const chapters = headings.map((heading) => ({
    id: heading.id,
    text: heading.text,
    level: heading.level,
  }));

  return (
    <div className="tone-ivory grain bg-ivory-50 text-fg">
      <ReadingProgress targetId="article-body" />

      <header className="container-site pt-16 lg:pt-24">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Journal", href: "/journal" },
            { label: post.title },
          ]}
        />
        <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9 lg:col-start-4">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 label-mono text-fg-muted">
              <span className="text-accent">{post.category}</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.updated ? (
                <span>
                  {copy.updated} <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                </span>
              ) : null}
              <span>{post.readingMinutes} min</span>
              {post.draft ? <span className="text-danger-fg">{copy.draft}</span> : null}
            </p>
            <h1 className="mt-6 max-w-[22ch] animate-rise text-h1 text-fg">{post.title}</h1>
            <p className="mt-6 max-w-2xl text-xl text-fg-muted">{post.description}</p>
          </div>
        </div>
        <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-card border border-rule bg-night-900 lg:aspect-[21/9]">
          <Image
            src={post.cover}
            alt={post.coverAlt ?? ""}
            fill
            preload
            sizes="(min-width: 1290px) 1240px, 100vw"
            unoptimized={isUnoptimized(post.cover)}
            className="object-cover"
          />
        </div>
      </header>

      <div className="container-site py-16 lg:py-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {headings.length > 0 ? (
            <aside className="lg:col-span-3">
              <div className="hidden lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:block">
                <ChapterNav chapters={chapters} label={copy.toc} />
              </div>
              <details className="group mb-10 rounded-card border border-rule lg:hidden">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {copy.toc}
                  <ChevronDown
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 transition-transform group-open:rotate-180"
                  />
                </summary>
                <ol className="border-t border-rule px-4 py-2">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        className={`flex min-h-11 items-center text-small text-fg-muted hover:text-fg ${heading.level === 3 ? "pl-4" : ""}`}
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            </aside>
          ) : null}

          <article id="article-body" className="min-w-0 lg:col-span-8 lg:col-start-4">
            <div className="prose max-w-[68ch]">
              <MdxContent source={post.body} />
            </div>

            {relatedServices.length > 0 ? (
              <section aria-labelledby="related-services-title" className="mt-16">
                <h2 id="related-services-title" className="label-mono text-accent">
                  {copy.relatedServices}
                </h2>
                <ul className="mt-3 border-t border-rule">
                  {relatedServices.map((service) => (
                    <li key={service.slug} className="border-b border-rule">
                      <Link
                        href={`/services/${service.slug}`}
                        className="group flex min-h-16 items-center justify-between gap-4 py-3"
                      >
                        <span>
                          <span className="block font-display-soft text-xl text-fg group-hover:text-accent">
                            {service.title}
                          </span>
                          <span className="block text-small text-fg-muted">{service.tagline}</span>
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="size-5 shrink-0 text-accent"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="mt-12 border-t border-rule pt-6">
              <ShareButtons
                url={url}
                title={post.title}
                label={copy.share}
                copyLabel={copy.copy}
                copiedLabel={copy.copied}
              />
            </div>

            <aside
              aria-label="Who wrote this"
              className="mt-10 flex flex-col gap-5 border-t border-rule pt-8 sm:flex-row"
            >
              <Image
                src={hasPhoto ? founder.photo : "/images/founder-placeholder.svg"}
                alt={
                  hasPhoto
                    ? `Portrait of ${founder.name}`
                    : `Placeholder for ${founder.name}'s portrait`
                }
                width={80}
                height={100}
                unoptimized={!hasPhoto}
                className="h-24 w-20 shrink-0 rounded-[999px_999px_4px_4px] object-cover"
              />
              <div>
                <p className="font-display-soft text-xl text-fg">{founder.name}</p>
                <p className="label-mono text-accent">{founder.role}</p>
                <p className="mt-2 text-small text-fg-muted">{copy.author.bio}</p>
                <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-small font-semibold">
                  {copy.author.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-10 items-center link-underline text-fg hover:text-accent"
                      >
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
                        className="inline-flex size-11 items-center justify-center rounded-button border border-rule text-fg hover:border-lamp-500"
                      >
                        <SocialIcon name={social.key} className="size-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </article>
        </div>

        {related.length > 0 ? (
          <section aria-labelledby="related-posts-title" className="mt-24">
            <h2 id="related-posts-title" className="label-mono text-accent">
              {copy.related}
            </h2>
            <ul className="mt-3 border-t border-rule">
              {related.map((item) => (
                <li key={item.slug} className="border-b border-rule">
                  <Link
                    href={`/journal/${item.slug}`}
                    className="group grid gap-1 py-5 md:grid-cols-12 md:items-baseline md:gap-6"
                  >
                    <time
                      dateTime={item.date}
                      className="font-mono text-xs text-fg-muted md:col-span-2"
                    >
                      {formatDate(item.date, { day: "2-digit", month: "short", year: "numeric" })}
                    </time>
                    <span className="font-display-soft text-xl text-fg group-hover:text-accent md:col-span-8">
                      {item.title}
                    </span>
                    <span className="label-mono text-accent md:col-span-2">{item.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

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
    </div>
  );
}
