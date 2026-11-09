import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { TrackOnMount } from "@/components/layout/ClickTracking";
import { FaqJsonLd } from "@/components/sections/shared/FaqJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { ChapterNav, type Chapter } from "@/components/ui/ChapterNav";
import { ChipList } from "@/components/ui/Chip";
import { EditorialList } from "@/components/ui/EditorialList";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { StarChecklist, StarPath } from "@/components/ui/StarPath";
import {
  getRelatedServices,
  getService,
  getServiceGroup,
  services,
  type Service,
} from "@/content/services";
import { serviceDetailCopy as copy } from "@/content/servicesPage";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";
import { getCaseStudies } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";
import { schemaIds } from "@/lib/structuredData";
import { absoluteUrl, pad2 } from "@/lib/utils";

// Await params at the top so unknown slugs return a real HTTP 404. Every valid slug is prerendered,
// so opting out of instant-navigation validation costs nothing here.
export const instant = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  // The OG image comes from ./opengraph-image.tsx, rendered per service at build time.
  return buildMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${service.slug}`,
    image: false,
  });
}

type ChapterKey = keyof typeof copy.chapters;

/** The chapters this service has content for, in reading order. */
function chaptersFor(service: Service): ChapterKey[] {
  const keys: ChapterKey[] = ["overview"];
  if (service.useCases?.length) keys.push("useCases");
  keys.push("benefits", "whyMe", "process", "deliverables", "tech", "faq");
  return keys;
}

function ChapterHeading({ id, number, title }: { id: string; number: number; title: string }) {
  return (
    <div className="flex items-baseline gap-4 border-t border-border pt-6">
      <span className="text-sm text-ink-muted tabular-nums">{pad2(number)}</span>
      <h2 id={id} className="text-h2 text-ink">
        {title}
      </h2>
    </div>
  );
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const keys = chaptersFor(service);
  const chapters: Chapter[] = keys.map((key) => ({ id: key, text: copy.chapters[key] }));
  const number = (key: ChapterKey) => keys.indexOf(key) + 1;
  const related = getRelatedServices(service);
  // Linked from the case study's own `services:` frontmatter; no match means no link.
  const caseStudy = getCaseStudies().find((study) => study.services.includes(service.slug));
  const group = getServiceGroup(service.group);
  const discussHref = `/contact?service=${service.slug}`;
  const whatsappHref = isPlaceholder(siteConfig.contact.whatsapp)
    ? null
    : siteConfig.contact.whatsapp;
  const facts = [
    {
      term: copy.quickFacts.timeline,
      detail: service.typicalTimeline || copy.quickFacts.timelineFallback,
    },
    { term: copy.quickFacts.models, detail: copy.quickFacts.modelsValue },
  ];

  const actions = (
    <div className="flex flex-col gap-3">
      <Button href={discussHref} data-cta="service-actions" className="w-full">
        {copy.discuss}
      </Button>
      {whatsappHref ? (
        <Button
          href={whatsappHref}
          variant="outline"
          target="_blank"
          rel="noopener noreferrer"
          data-cta="service-actions"
          className="w-full"
        >
          {copy.whatsapp}
          <span className="sr-only"> (opens in a new tab)</span>
        </Button>
      ) : null}
    </div>
  );

  return (
    <div className="bg-bg text-ink [--subnav-h:0px]">
      <div className="container-site pt-12 pb-20 lg:pt-20 lg:pb-24">
        <header className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: service.shortTitle },
              ]}
            />
            <h1 className="mt-8 animate-rise text-h1 text-ink">{service.title}</h1>
            <p className="mt-6 text-2xl leading-snug font-medium text-ink-muted">
              {service.tagline}
            </p>
            <p className="mt-6 max-w-2xl text-lg text-ink-muted">{service.summary}</p>
          </div>
          <div className="mt-10 lg:col-span-4 lg:mt-0">
            <p className="label-text text-ink-muted">{copy.quickFacts.title}</p>
            <dl className="mt-3 border-t border-border text-small">
              {facts.map((fact) => (
                <div key={fact.term} className="border-b border-border py-3">
                  <dt className="text-ink-muted">{fact.term}</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    <PlaceholderText text={fact.detail} />
                  </dd>
                </div>
              ))}
              <div className="border-b border-border py-3">
                <dt className="text-ink-muted">{copy.quickFacts.idealFor}</dt>
                <dd>
                  <ul className="mt-1 space-y-1 font-semibold text-ink">
                    {service.idealFor.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="mt-12 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:max-h-[calc(100svh-var(--header-h)-3rem)] lg:overflow-y-auto lg:pb-6">
              <p className="hidden text-xl font-semibold text-ink lg:block">{service.title}</p>
              <p className="mt-1 hidden label-text text-ink-muted lg:block">{group?.label}</p>

              <ChapterNav
                chapters={chapters}
                label={copy.contents}
                numbered
                className="mt-8 hidden lg:block"
              />

              <details className="group rounded-card border border-border lg:hidden">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {copy.contents}
                  <ChevronDown
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 transition-transform group-open:rotate-180"
                  />
                </summary>
                <ol className="border-t border-border px-4 py-2">
                  {chapters.map((chapter, index) => (
                    <li key={chapter.id}>
                      <a
                        href={`#${chapter.id}`}
                        className="flex min-h-11 items-center gap-3 text-small text-ink-muted hover:text-ink"
                      >
                        <span className="text-xs text-ink-muted tabular-nums">
                          {pad2(index + 1)}
                        </span>
                        {chapter.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>

              <div className="mt-6 hidden lg:block">{actions}</div>
            </div>
          </aside>

          {/* Long read */}
          <article className="mt-10 lg:col-span-8 lg:col-start-5 lg:mt-0">
            <div className="mt-16 space-y-20 lg:mt-0">
              <section aria-labelledby="overview">
                <ChapterHeading
                  id="overview"
                  number={number("overview")}
                  title={copy.chapters.overview}
                />
                <div className="mt-8 max-w-[68ch] space-y-5 text-lg leading-relaxed text-ink-muted">
                  {service.intro.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {service.useCases?.length ? (
                <section aria-labelledby="useCases">
                  <ChapterHeading
                    id="useCases"
                    number={number("useCases")}
                    title={copy.chapters.useCases}
                  />
                  <EditorialList
                    className="mt-8"
                    items={service.useCases.map((useCase) => ({
                      title: useCase.title,
                      text: useCase.text,
                    }))}
                  />
                </section>
              ) : null}

              <section aria-labelledby="benefits">
                <ChapterHeading
                  id="benefits"
                  number={number("benefits")}
                  title={copy.chapters.benefits}
                />
                <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                  {service.benefits.map((benefit) => (
                    <div key={benefit.title} className="border-t border-border pt-4">
                      <dt className="font-semibold text-ink">{benefit.title}</dt>
                      <dd className="mt-1.5 text-ink-muted">{benefit.text}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="whyMe">
                <ChapterHeading id="whyMe" number={number("whyMe")} title={copy.chapters.whyMe} />
                <p className="mt-8 max-w-[68ch] text-lg leading-relaxed text-ink-muted">
                  {service.whyMe.text}
                </p>
                <ul className="mt-8 border-t border-border">
                  {service.whyMe.points.map((point) => (
                    <li
                      key={point}
                      className="flex min-h-12 items-center gap-3 border-b border-border py-2 text-ink"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 shrink-0 rounded-dot bg-ink-muted"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="process">
                <ChapterHeading
                  id="process"
                  number={number("process")}
                  title={copy.chapters.process}
                />
                <StarPath
                  numbered
                  className="mt-8"
                  items={service.process.map((step) => ({
                    title: step.title,
                    text: step.text,
                    meta: step.duration,
                  }))}
                />
              </section>

              <section aria-labelledby="deliverables">
                <ChapterHeading
                  id="deliverables"
                  number={number("deliverables")}
                  title={copy.chapters.deliverables}
                />
                <StarChecklist items={service.deliverables} className="mt-8" />
              </section>

              <section aria-labelledby="tech">
                <ChapterHeading id="tech" number={number("tech")} title={copy.chapters.tech} />
                <ChipList items={service.tech} label={copy.chapters.tech} className="mt-8 gap-2" />
              </section>

              <section aria-labelledby="faq">
                <ChapterHeading id="faq" number={number("faq")} title={copy.chapters.faq} />
                <Accordion
                  className="mt-8"
                  items={service.faqs.map((faq) => ({ question: faq.q, answer: faq.a }))}
                />
                <FaqJsonLd items={service.faqs} />
              </section>

              {related.length > 0 ? (
                <section aria-labelledby="pairs-with">
                  <h2 id="pairs-with" className="label-text text-ink-muted">
                    {copy.pairsWith}
                  </h2>
                  <ul className="mt-4 border-t border-border">
                    {related.map((item) => (
                      <li key={item.slug} className="border-b border-border">
                        <Link
                          href={`/services/${item.slug}`}
                          className="group flex min-h-20 items-center justify-between gap-6 py-4"
                        >
                          <span>
                            <span className="block text-2xl font-semibold text-ink group-hover:text-link">
                              {item.title}
                            </span>
                            <span className="block text-small text-ink-muted">{item.tagline}</span>
                          </span>
                          <ArrowRight
                            aria-hidden="true"
                            strokeWidth={1.5}
                            className="size-5 shrink-0 text-link transition-transform group-hover:translate-x-1"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {caseStudy ? (
                <section aria-labelledby="related-work">
                  <h2 id="related-work" className="label-text text-ink-muted">
                    {copy.relatedWork}
                  </h2>
                  <Link
                    href={`/work/${caseStudy.slug}`}
                    className="group mt-4 flex min-h-20 items-center justify-between gap-6 border-y border-border py-4"
                  >
                    <span>
                      <span className="block text-2xl font-semibold text-ink group-hover:text-link">
                        {caseStudy.title}
                      </span>
                      <span className="block text-small text-ink-muted">{caseStudy.summary}</span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-5 shrink-0 text-link transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </section>
              ) : null}
            </div>
          </article>
        </div>

        <section
          aria-labelledby="service-closing"
          className="mt-20 rounded-card border border-border bg-surface-raised p-8 lg:mt-28 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 lg:p-12"
        >
          <div className="lg:col-span-8">
            <p className="label-text text-ink-muted">{service.title}</p>
            <h2 id="service-closing" className="mt-3 text-h2 text-ink">
              {service.tagline}
            </h2>
          </div>
          <div className="mt-8 lg:col-span-4 lg:mt-0">{actions}</div>
        </section>
      </div>

      {/* Sticky bar on small screens */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur-md lg:hidden print:hidden">
        <div className="flex items-center gap-3 pr-32">
          <Button href={discussHref} size="sm" data-cta="service-sticky-bar" className="flex-1">
            {copy.discuss}
          </Button>
        </div>
      </div>

      <ServiceJsonLd service={service} />
      <TrackOnMount name="service_view" params={{ slug: service.slug }} />
    </div>
  );
}

function ServiceJsonLd({ service }: { service: Service }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        serviceType: service.title,
        description: service.summary,
        url: absoluteUrl(`/services/${service.slug}`),
        provider: { "@id": schemaIds.business },
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "Place", name: "Worldwide" },
        ],
      }}
    />
  );
}
