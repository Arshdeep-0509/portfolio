import { Check, CircleCheck } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { CaseStudyCard } from "@/components/ui/cards/CaseStudyCard";
import { FeatureCard } from "@/components/ui/cards/FeatureCard";
import { ServiceLinkCard } from "@/components/ui/cards/ServiceLinkCard";
import { TechChip } from "@/components/ui/Chip";
import { IconTile } from "@/components/ui/IconTile";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Timeline } from "@/components/ui/Timeline";
import { JsonLd } from "@/components/seo/JsonLd";
import { getRelatedServices, type ServiceEntry } from "@/content/services";
import { serviceDetailCopy } from "@/content/servicesPage";
import { workContent } from "@/content/work";
import { getCaseStudies } from "@/lib/mdx";

/**
 * Body sections of /services/[slug]. Every section renders only when its field in services.ts
 * has content, so a stub service shows no empty headings. getServiceSections() is the single
 * source of truth for which sections exist (the sub-nav and background alternation use it too).
 */

type SectionKey = keyof typeof serviceDetailCopy.sections;
type Background = "white" | "tint";

export function getServiceSections(service: ServiceEntry): SectionKey[] {
  const present: Record<SectionKey, boolean> = {
    overview: (service.intro?.length ?? 0) > 0,
    useCases: (service.useCases?.length ?? 0) > 0,
    benefits: (service.benefits?.length ?? 0) > 0,
    whyMe: Boolean(service.whyMe?.text || service.whyMe?.points.length),
    tech: (service.tech?.length ?? 0) > 0,
    process: (service.process?.length ?? 0) > 0,
    deliverables: (service.deliverables?.length ?? 0) > 0,
    faq: (service.faqs?.length ?? 0) > 0,
  };
  return (Object.keys(serviceDetailCopy.sections) as SectionKey[]).filter((key) => present[key]);
}

type SectionProps = { service: ServiceEntry; background: Background };

function Heading({ section }: { section: SectionKey }) {
  return <SectionHeading align="left" title={serviceDetailCopy.sections[section].title} />;
}

export function ServiceOverview({ service, background }: SectionProps) {
  if (!service.intro?.length) return null;
  return (
    <Section id={serviceDetailCopy.sections.overview.id} background={background}>
      <Heading section="overview" />
      <div className="mt-8 max-w-[720px] space-y-5 text-lg leading-relaxed text-muted">
        {service.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}

export function ServiceUseCases({ service, background }: SectionProps) {
  if (!service.useCases?.length) return null;
  return (
    <Section id={serviceDetailCopy.sections.useCases.id} background={background}>
      <Heading section="useCases" />
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {service.useCases.map((useCase) => (
          <li key={useCase.title}>
            <FeatureCard icon={useCase.icon} title={useCase.title} text={useCase.text} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function ServiceBenefits({ service, background }: SectionProps) {
  if (!service.benefits?.length) return null;
  return (
    <Section id={serviceDetailCopy.sections.benefits.id} background={background}>
      <Heading section="benefits" />
      <ul className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {service.benefits.map((benefit) => (
          <li key={benefit.title} className="flex gap-4">
            <IconTile icon={Check} size="sm" />
            <div>
              <h3 className="text-body font-bold">{benefit.title}</h3>
              <p className="mt-1 text-muted">{benefit.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function ServiceWhyMe({ service, background }: SectionProps) {
  const whyMe = service.whyMe;
  if (!whyMe?.text && !whyMe?.points.length) return null;
  const facts = serviceDetailCopy.quickFacts;

  return (
    <Section id={serviceDetailCopy.sections.whyMe.id} background={background}>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
        <div>
          <Heading section="whyMe" />
          {whyMe.text ? <p className="mt-6 text-lg text-muted">{whyMe.text}</p> : null}
          {whyMe.points.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {whyMe.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <CircleCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                  <span className="text-ink">{point}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <aside
          aria-labelledby="quick-facts-title"
          className="tone-light rounded-xl border border-border bg-surface p-card shadow-card lg:sticky lg:top-[calc(var(--header-h)+var(--subnav-h,0px)+24px)]"
        >
          <h3 id="quick-facts-title" className="text-h3 font-bold">
            {facts.title}
          </h3>
          <dl className="mt-5 divide-y divide-border text-small">
            {[
              {
                label: "Typical timeline",
                value: service.typicalTimeline ?? facts.timelineFallback,
              },
              ...facts.items,
            ].map((fact) => (
              <div key={fact.label} className="flex justify-between gap-4 py-3 first:pt-0">
                <dt className="text-muted">{fact.label}</dt>
                <dd className="text-right font-semibold text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <Button href={`${facts.cta.href}?service=${service.slug}`} className="mt-6 w-full">
            {facts.cta.label}
          </Button>
        </aside>
      </div>
    </Section>
  );
}

export function ServiceTech({ service, background }: SectionProps) {
  if (!service.tech?.length) return null;
  return (
    <Section id={serviceDetailCopy.sections.tech.id} background={background}>
      <Heading section="tech" />
      <ul className="mt-8 flex flex-wrap gap-2.5">
        {service.tech.map((name) => (
          <li key={name}>
            <TechChip className="px-3 py-1.5 text-small">{name}</TechChip>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function ServiceProcess({ service, background }: SectionProps) {
  if (!service.process?.length) return null;
  return (
    <Section id={serviceDetailCopy.sections.process.id} background={background}>
      <Heading section="process" />
      <Timeline
        variant="vertical"
        className="mt-10 max-w-3xl"
        items={service.process.map((step) => ({ title: step.title, text: step.text }))}
      />
    </Section>
  );
}

export function ServiceDeliverables({ service, background }: SectionProps) {
  if (!service.deliverables?.length) return null;
  return (
    <Section id={serviceDetailCopy.sections.deliverables.id} background={background}>
      <Heading section="deliverables" />
      <ul className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
        {service.deliverables.map((item) => (
          <li key={item} className="flex gap-3">
            <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            <span className="text-ink">{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function ServiceFaq({ service, background }: SectionProps) {
  if (!service.faqs?.length) return null;
  return (
    <Section id={serviceDetailCopy.sections.faq.id} background={background}>
      <Heading section="faq" />
      <Accordion
        className="mt-10 max-w-3xl"
        items={service.faqs.map((faq) => ({ question: faq.q, answer: faq.a }))}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }}
      />
    </Section>
  );
}

export function RelatedServices({ service, background }: SectionProps) {
  const related = getRelatedServices(service);
  if (related.length === 0) return null;
  return (
    <Section background={background} aria-labelledby="related-services-title">
      <h2 id="related-services-title" className="text-h2 font-extrabold tracking-tight">
        {serviceDetailCopy.relatedTitle}
      </h2>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => (
          <li key={item.slug}>
            <ServiceLinkCard
              href={`/services/${item.slug}`}
              icon={item.icon}
              title={item.title}
              tagline={item.tagline}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

/**
 * One case study per service page: the newest case study whose frontmatter lists this service,
 * or — when none does yet — the most recent case study, under an honest "Recent work" heading.
 */
export function ServiceCaseStudy({ service, background }: SectionProps) {
  const studies = getCaseStudies();
  const matching = studies.find((study) => study.services.includes(service.slug));
  const study = matching ?? studies[0];
  if (!study) return null;
  const copy = serviceDetailCopy.caseStudy;

  return (
    <Section background={background} aria-labelledby="service-case-study-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="service-case-study-title" className="text-h2 font-extrabold tracking-tight">
          {matching ? copy.title : copy.fallbackTitle}
        </h2>
        <Button href="/work" variant="link">
          {copy.allWork}
        </Button>
      </div>
      <div className="mt-8 max-w-xl">
        <CaseStudyCard
          study={{
            slug: study.slug,
            title: study.title,
            summary: study.summary,
            cover: study.cover,
            coverAlt: study.coverAlt,
            status: study.status,
            stack: study.stack,
            categories: study.categories,
          }}
          statusLabels={workContent.status}
          ctaLabel={workContent.card.cta}
        />
      </div>
    </Section>
  );
}
