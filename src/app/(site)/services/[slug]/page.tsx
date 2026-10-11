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
    <div className="flex items-baseline gap-4 border-t border-rule pt-6">
      <span className="font-mono text-sm text-accent">{pad2(number)}</span>
      <h2 id={id} className="text-h2 text-fg">
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
  const group = getServiceGroup(service.group);
  const discussHref = `/contact?service=${service.slug}`;
  const whatsappHref = isPlaceholder(siteConfig.whatsappUrl) ? null : siteConfig.whatsappUrl;
  const facts = [
    {
      term: copy.quickFacts.timeline,
      detail: service.typicalTimeline || copy.quickFacts.timelineFallback,
    },
    { term: copy.quickFacts.models, detail: copy.quickFacts.modelsValue },
  ];

  const actions = (
    <div className="flex flex-col gap-3">
      <Button href={discussHref} data-cta="service-sidebar" className="w-full">
        {copy.discuss}
      </Button>
      {whatsappHref ? (
        <Button
          href={whatsappHref}
          variant="outline"
          target="_blank"
          rel="noopener noreferrer"
          data-cta="service-sidebar"
          className="w-full"
        >
          {copy.whatsapp}
          <span className="sr-only"> (opens in a new tab)</span>
        </Button>
      ) : null}
    </div>
  );

  return (
    <div className="tone-ivory grain bg-ivory-50 text-fg [--subnav-h:0px]">
      <div className="container-site pt-12 pb-28 lg:pt-20 lg:pb-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:max-h-[calc(100svh-var(--header-h)-3rem)] lg:overflow-y-auto lg:pb-6">
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: service.shortTitle },
                ]}
              />
              <p className="mt-6 hidden font-display-soft text-xl text-fg lg:block">
                {service.title}
              </p>
              <p className="mt-1 hidden label-mono text-fg-muted lg:block">{group?.label}</p>

              <ChapterNav
                chapters={chapters}
                label={copy.contents}
                numbered
                className="mt-8 hidden lg:block"
              />

              <details className="group mt-6 rounded-card border border-rule lg:hidden">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {copy.contents}
                  <ChevronDown
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 transition-transform group-open:rotate-180"
                  />
                </summary>
                <ol className="border-t border-rule px-4 py-2">
                  {chapters.map((chapter, index) => (
                    <li key={chapter.id}>
                      <a
                        href={`#${chapter.id}`}
                        className="flex min-h-11 items-center gap-3 text-small text-fg-muted hover:text-fg"
                      >
                        <span className="font-mono text-xs text-accent">{pad2(index + 1)}</span>
                        {chapter.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>

              <p className="mt-10 hidden border-t border-rule pt-4 label-mono text-accent lg:block">
                {copy.quickFacts.title}
              </p>
              <dl className="hidden text-small lg:block">
                {facts.map((fact) => (
                  <div key={fact.term} className="border-b border-rule py-3">
                    <dt className="text-fg-muted">{fact.term}</dt>
                    <dd className="mt-0.5 font-semibold text-fg">
                      <PlaceholderText text={fact.detail} />
                    </dd>
                  </div>
                ))}
                <div className="py-3">
                  <dt className="text-fg-muted">{copy.quickFacts.idealFor}</dt>
                  <dd>
                    <ul className="mt-1 space-y-1 font-semibold text-fg">
                      {service.idealFor.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
              <div className="mt-6 hidden lg:block">{actions}</div>
            </div>
          </aside>

          {/* Long read */}
          <article className="mt-10 lg:col-span-8 lg:col-start-5 lg:mt-0">
            <h1 className="animate-rise text-h1 text-fg">{service.title}</h1>
            <p className="mt-6 font-display-soft text-2xl leading-snug text-accent italic">
              {service.tagline}
            </p>
            <p className="mt-6 max-w-2xl text-lg text-fg-muted">{service.summary}</p>

            {/* Quick facts on small screens */}
            <dl className="mt-10 grid gap-4 border-y border-rule py-6 text-small sm:grid-cols-2 lg:hidden">
              {facts.map((fact) => (
                <div key={fact.term}>
                  <dt className="label-mono text-accent">{fact.term}</dt>
                  <dd className="mt-1 font-semibold">
                    <PlaceholderText text={fact.detail} />
                  </dd>
                </div>
              ))}
              <div className="sm:col-span-2">
                <dt className="label-mono text-accent">{copy.quickFacts.idealFor}</dt>
                <dd className="mt-1 font-semibold">{service.idealFor.join(" · ")}</dd>
              </div>
            </dl>

            <div className="mt-20 space-y-20">
              <section aria-labelledby="overview">
                <ChapterHeading
                  id="overview"
                  number={number("overview")}
                  title={copy.chapters.overview}
                />
                <div className="mt-8 max-w-[68ch] space-y-5 text-lg leading-relaxed text-fg-muted">
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
                    <div key={benefit.title} className="border-t border-rule pt-4">
                      <dt className="font-semibold text-fg">{benefit.title}</dt>
                      <dd className="mt-1.5 text-fg-muted">{benefit.text}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="whyMe">
                <ChapterHeading id="whyMe" number={number("whyMe")} title={copy.chapters.whyMe} />
                <p className="mt-8 max-w-[68ch] text-lg leading-relaxed text-fg-muted">
                  {service.whyMe.text}
                </p>
                <ul className="mt-8 border-t border-rule">
                  {service.whyMe.points.map((point) => (
                    <li
                      key={point}
                      className="flex min-h-12 items-center gap-3 border-b border-rule py-2 text-fg"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 shrink-0 rounded-dot bg-lamp-500"
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
                <ol className="mt-8 border-t border-rule">
                  {service.process.map((step, index) => (
                    <li
                      key={step.title}
                      className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b border-rule py-6 sm:grid-cols-[3rem_minmax(0,1fr)_auto]"
                    >
                      <span className="font-mono text-sm text-accent">{pad2(index + 1)}</span>
                      <div>
                        <h3 className="font-sans text-body font-semibold text-fg">{step.title}</h3>
                        <p className="mt-1 text-fg-muted">{step.text}</p>
                      </div>
                      {step.duration ? (
                        <p className="col-start-2 mt-2 label-mono text-fg-muted sm:col-start-3 sm:mt-0 sm:text-right">
                          {step.duration}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="deliverables">
                <ChapterHeading
                  id="deliverables"
                  number={number("deliverables")}
                  title={copy.chapters.deliverables}
                />
                <ul className="mt-8 grid gap-x-8 border-t border-rule sm:grid-cols-2">
                  {service.deliverables.map((item, index) => (
                    <li
                      key={item}
                      className="flex min-h-14 items-center gap-4 border-b border-rule py-3 text-fg"
                    >
                      <span className="font-mono text-xs text-accent">{pad2(index + 1)}</span>
                      <span className="font-medium">{item}</span>
                      <span aria-hidden="true" className="ml-auto font-mono text-success-fg">
                        ✓
                      </span>
                    </li>
                  ))}
                </ul>
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
                  <h2 id="pairs-with" className="label-mono text-accent">
                    {copy.pairsWith}
                  </h2>
                  <ul className="mt-4 border-t border-rule">
                    {related.map((item) => (
                      <li key={item.slug} className="border-b border-rule">
                        <Link
                          href={`/services/${item.slug}`}
                          className="group flex min-h-20 items-center justify-between gap-6 py-4"
                        >
                          <span>
                            <span className="block font-display-soft text-2xl text-fg group-hover:text-accent">
                              {item.title}
                            </span>
                            <span className="block text-small text-fg-muted">{item.tagline}</span>
                          </span>
                          <ArrowRight
                            aria-hidden="true"
                            strokeWidth={1.5}
                            className="size-5 shrink-0 text-accent transition-transform group-hover:translate-x-1"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </article>
        </div>
      </div>

      {/* Sticky bar on small screens */}
      <div className="tone-night fixed inset-x-0 bottom-0 z-30 border-t border-line-dark bg-night-950/95 px-4 py-3 backdrop-blur-md lg:hidden print:hidden">
        <div className="flex items-center gap-3 pr-28">
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
