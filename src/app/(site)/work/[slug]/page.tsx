import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ChapterNav, type Chapter } from "@/components/ui/ChapterNav";
import { ChipList } from "@/components/ui/Chip";
import { Gallery } from "@/components/ui/Gallery";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { StatusDot } from "@/components/ui/StatusDot";
import { workContent } from "@/content/work";
import { isPlaceholder } from "@/lib/constants";
import { isUnoptimized } from "@/lib/images";
import { EMPTY_COLLECTION_SLUG, getCaseStudies, getCaseStudy } from "@/lib/mdx";
import { MdxContent } from "@/lib/mdx-render";
import { buildMetadata } from "@/lib/seo";
import { pad2 } from "@/lib/utils";

// Await params at the top so unknown slugs return a real HTTP 404. Every valid slug is prerendered,
// so opting out of instant-navigation validation costs nothing here.
export const instant = false;

export function generateStaticParams() {
  const slugs = getCaseStudies().map((study) => ({ slug: study.slug }));
  // Cache Components needs at least one entry; the placeholder slug renders a 404.
  return slugs.length ? slugs : [{ slug: EMPTY_COLLECTION_SLUG }];
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return buildMetadata({
    title: study.title,
    description: study.summary,
    path: `/work/${study.slug}`,
    // Real cover images become the share image; otherwise ./opengraph-image.tsx renders one.
    image: isUnoptimized(study.cover) ? false : study.cover,
    type: "article",
  });
}

/** Live / GitHub links only when they are real URLs. */
function realLink(href?: string) {
  return href && !isPlaceholder(href) && /^https?:\/\//.test(href) ? href : undefined;
}

function ChapterBlock({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-rule pt-8">
      <p className="font-mono text-sm text-accent">{pad2(number)}</p>
      <h2 id={id} className="mt-2 text-h2 text-fg">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/**
 * A magazine-style case study: a night opening with the uncropped cover, then a sticky facts
 * sidebar beside numbered chapters. Every section comes from the MDX frontmatter or body —
 * nothing invents a client, a result or a link; optional chapters appear only with data.
 */
export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const copy = workContent.detail;
  const all = getCaseStudies();
  const position = all.findIndex((entry) => entry.slug === study.slug);
  // The listing is newest first: "older" is the next entry, "newer" the previous one.
  const older = all[position + 1];
  const newer = position > 0 ? all[position - 1] : undefined;
  const live = realLink(study.links.live);
  const github = realLink(study.links.github);

  const chapterList: (Chapter & { show: boolean })[] = [
    { id: "problem", text: copy.sections.problem, show: true },
    { id: "goals", text: copy.sections.goals, show: study.goals.length > 0 },
    { id: "approach", text: copy.sections.approach, show: true },
    { id: "architecture", text: copy.sections.architecture, show: Boolean(study.architecture) },
    { id: "features", text: copy.sections.features, show: study.features.length > 0 },
    { id: "screens", text: copy.sections.screens, show: study.screens.length > 0 },
    { id: "results", text: copy.sections.results, show: study.results.length > 0 },
    { id: "next", text: copy.sections.next, show: study.nextSteps.length > 0 },
  ];
  const chapters = chapterList
    .filter((chapter) => chapter.show)
    .map(({ id, text }) => ({ id, text }));
  const number = (id: string) => chapters.findIndex((chapter) => chapter.id === id) + 1;

  return (
    <>
      <section
        data-under-header=""
        aria-labelledby="case-title"
        className="tone-night relative isolate overflow-hidden bg-night-950 bg-stars text-fg"
      >
        <div className="container-site pt-[calc(var(--header-h)+3.5rem)] pb-14 lg:pt-[calc(var(--header-h)+5rem)]">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Work", href: "/work" },
              { label: study.title },
            ]}
          />
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <StatusDot status={study.status} label={workContent.status[study.status]} />
            <span className="label-mono text-mist-300">{study.publishedAt.slice(0, 4)}</span>
          </div>
          <h1 id="case-title" className="mt-6 max-w-[20ch] animate-rise text-h1 text-fg">
            {study.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-fg-muted">{study.summary}</p>
        </div>
        {/* The whole cover, never cropped: screenshots read better complete than full-bleed. */}
        <div className="container-site pb-16 lg:pb-24">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card border border-line-dark bg-night-900">
            <Image
              src={study.cover}
              alt={study.coverAlt ?? ""}
              fill
              preload
              sizes="(min-width: 1440px) 1280px, 92vw"
              unoptimized={isUnoptimized(study.cover)}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <div className="tone-ivory grain bg-ivory-50 text-fg">
        <div className="container-site py-20 lg:py-28">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <p className="label-mono text-accent">{copy.factsTitle}</p>
                <dl className="mt-3 border-t border-rule text-small">
                  {(
                    [
                      [copy.facts.client, study.client],
                      [copy.facts.role, study.role],
                      [copy.facts.timeline, study.timeline],
                    ].filter(([, detail]) => detail) as [string, string][]
                  ).map(([term, detail]) => (
                    <div key={term} className="border-b border-rule py-3">
                      <dt className="text-fg-muted">{term}</dt>
                      <dd className="mt-0.5 font-semibold text-fg">
                        <PlaceholderText text={detail} />
                      </dd>
                    </div>
                  ))}
                  <div className="py-3">
                    <dt className="text-fg-muted">{copy.facts.stack}</dt>
                    <dd className="mt-2">
                      <ChipList items={study.stack} />
                    </dd>
                  </div>
                </dl>
                {live || github ? (
                  <ul className="mt-4 space-y-1 text-small font-semibold">
                    {live ? (
                      <li>
                        <a
                          href={live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center gap-1.5 link-underline text-accent"
                        >
                          {copy.links.live}{" "}
                          <ExternalLink aria-hidden="true" strokeWidth={1.5} className="size-4" />
                        </a>
                      </li>
                    ) : null}
                    {github ? (
                      <li>
                        <a
                          href={github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center gap-1.5 link-underline text-accent"
                        >
                          {copy.links.github}{" "}
                          <ExternalLink aria-hidden="true" strokeWidth={1.5} className="size-4" />
                        </a>
                      </li>
                    ) : null}
                  </ul>
                ) : null}
                <ChapterNav
                  chapters={chapters}
                  label={copy.contents}
                  numbered
                  className="mt-10 hidden lg:block"
                />
              </div>
            </aside>

            <article className="mt-14 space-y-20 lg:col-span-8 lg:col-start-5 lg:mt-0">
              <ChapterBlock id="problem" number={number("problem")} title={copy.sections.problem}>
                <p className="max-w-[68ch] text-xl leading-relaxed text-fg">
                  <PlaceholderText text={study.problem} />
                </p>
              </ChapterBlock>

              {study.goals.length > 0 ? (
                <ChapterBlock id="goals" number={number("goals")} title={copy.sections.goals}>
                  <ul className="border-t border-rule">
                    {study.goals.map((goal) => (
                      <li
                        key={goal}
                        className="flex min-h-12 items-center gap-3 border-b border-rule py-2 text-fg"
                      >
                        <span
                          aria-hidden="true"
                          className="size-1.5 shrink-0 rounded-dot bg-lamp-500"
                        />
                        <PlaceholderText text={goal} />
                      </li>
                    ))}
                  </ul>
                </ChapterBlock>
              ) : null}

              <ChapterBlock
                id="approach"
                number={number("approach")}
                title={copy.sections.approach}
              >
                <div className="prose max-w-none">
                  <MdxContent source={study.body} />
                </div>
              </ChapterBlock>

              {study.architecture ? (
                <ChapterBlock
                  id="architecture"
                  number={number("architecture")}
                  title={copy.sections.architecture}
                >
                  <figure>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-rule bg-night-900">
                      <Image
                        src={study.architecture.src}
                        alt={study.architecture.alt}
                        fill
                        sizes="(min-width: 1024px) 800px, 100vw"
                        unoptimized={isUnoptimized(study.architecture.src)}
                        className="object-contain"
                      />
                    </div>
                    {study.architecture.caption ? (
                      <figcaption className="mt-3 text-small text-fg-muted">
                        <PlaceholderText text={study.architecture.caption} />
                      </figcaption>
                    ) : null}
                  </figure>
                </ChapterBlock>
              ) : null}

              {study.features.length > 0 ? (
                <ChapterBlock
                  id="features"
                  number={number("features")}
                  title={copy.sections.features}
                >
                  <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                    {study.features.map((feature) => (
                      <div key={feature.title} className="border-t border-rule pt-4">
                        <dt className="font-semibold text-fg">{feature.title}</dt>
                        <dd className="mt-1.5 text-fg-muted">
                          <PlaceholderText text={feature.text} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </ChapterBlock>
              ) : null}

              {study.screens.length > 0 ? (
                <ChapterBlock id="screens" number={number("screens")} title={copy.sections.screens}>
                  <p className="mb-6 text-small text-fg-muted">{copy.screensHint}</p>
                  <Gallery images={study.screens} label={study.title} />
                </ChapterBlock>
              ) : null}

              {/* Rendered only when the frontmatter lists real, verifiable results. */}
              {study.results.length > 0 ? (
                <ChapterBlock id="results" number={number("results")} title={copy.sections.results}>
                  <ul className="border-t border-rule">
                    {study.results.map((result) => (
                      <li
                        key={result}
                        className="flex min-h-14 items-center gap-3 border-b border-rule py-3 font-semibold text-fg"
                      >
                        <span aria-hidden="true" className="font-mono text-success-fg">
                          ✓
                        </span>
                        {result}
                      </li>
                    ))}
                  </ul>
                </ChapterBlock>
              ) : null}

              {study.nextSteps.length > 0 ? (
                <ChapterBlock id="next" number={number("next")} title={copy.sections.next}>
                  <ul className="max-w-[68ch] list-disc space-y-2 pl-5 text-lg text-fg-muted marker:text-lamp-700">
                    {study.nextSteps.map((step) => (
                      <li key={step}>
                        <PlaceholderText text={step} />
                      </li>
                    ))}
                  </ul>
                </ChapterBlock>
              ) : null}
            </article>
          </div>

          {older || newer ? (
            <nav
              aria-label="More case studies"
              className="mt-24 grid border-t border-rule sm:grid-cols-2"
            >
              {older ? (
                <Link
                  href={`/work/${older.slug}`}
                  className="group flex min-h-24 flex-col justify-center gap-1 border-b border-rule py-5 sm:border-r sm:pr-6"
                >
                  <span className="inline-flex items-center gap-2 label-mono text-accent">
                    <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-4" />{" "}
                    {copy.pager.previous}
                  </span>
                  <span className="font-display-soft text-xl text-fg group-hover:text-accent">
                    {older.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {newer ? (
                <Link
                  href={`/work/${newer.slug}`}
                  className="group flex min-h-24 flex-col justify-center gap-1 border-b border-rule py-5 sm:items-end sm:pl-6 sm:text-right"
                >
                  <span className="inline-flex items-center gap-2 label-mono text-accent">
                    {copy.pager.next}{" "}
                    <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
                  </span>
                  <span className="font-display-soft text-xl text-fg group-hover:text-accent">
                    {newer.title}
                  </span>
                </Link>
              ) : null}
            </nav>
          ) : null}
        </div>
      </div>
    </>
  );
}
