import Image from "next/image";
import Link from "next/link";
import { icons } from "lucide-react";
import { ArrowLeft, ArrowRight, CircleCheck, ExternalLink } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { TechChip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Gallery } from "@/components/ui/Gallery";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { Section } from "@/components/ui/Section";
import { workContent } from "@/content/work";
import { isUnoptimized } from "@/lib/images";
import type { CaseStudyMeta } from "@/lib/mdx";
import { isPlaceholder } from "@/lib/constants";

/**
 * Sections of /work/[slug]. Everything shown comes from the case study's frontmatter or body:
 * no section invents a client, a result or a link. Optional sections render only with data.
 */

const copy = workContent.detail;

/** Live / GitHub links only when they are real URLs. */
function realLink(href?: string) {
  return href && !isPlaceholder(href) && /^https?:\/\//.test(href) ? href : undefined;
}

export function CaseStudyFacts({ study }: { study: CaseStudyMeta }) {
  const live = realLink(study.links.live);
  const github = realLink(study.links.github);
  return (
    <div className="border-b border-border bg-surface">
      <Container className="py-8">
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1.4fr_1fr_2fr]">
          <div>
            <dt className="font-mono text-eyebrow font-medium text-muted uppercase">
              {copy.facts.client}
            </dt>
            <dd className="mt-1.5 font-semibold text-ink">
              <PlaceholderText text={study.client} />
            </dd>
          </div>
          <div>
            <dt className="font-mono text-eyebrow font-medium text-muted uppercase">
              {copy.facts.role}
            </dt>
            <dd className="mt-1.5 font-semibold text-ink">
              <PlaceholderText text={study.role} />
            </dd>
          </div>
          <div>
            <dt className="font-mono text-eyebrow font-medium text-muted uppercase">
              {copy.facts.timeline}
            </dt>
            <dd className="mt-1.5 font-semibold text-ink">
              <PlaceholderText text={study.timeline} />
            </dd>
          </div>
          <div>
            <dt className="font-mono text-eyebrow font-medium text-muted uppercase">
              {copy.facts.stack}
            </dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-1.5">
                {study.stack.map((tech) => (
                  <li key={tech}>
                    <TechChip>{tech}</TechChip>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
        {live || github ? (
          <div className="mt-6 flex flex-wrap gap-4 text-small font-semibold">
            {live ? (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                {copy.links.live} <ExternalLink aria-hidden="true" className="size-4" />
              </a>
            ) : null}
            {github ? (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                <SocialIcon name="github" className="size-4" /> {copy.links.github}
              </a>
            ) : null}
          </div>
        ) : null}
      </Container>
    </div>
  );
}

export function CaseStudyBody({
  study,
  approach,
}: {
  study: CaseStudyMeta;
  approach: React.ReactNode;
}) {
  return (
    <Section background="white" aria-label="Case study">
      <div className="mx-auto max-w-3xl space-y-16">
        <section aria-labelledby="cs-problem">
          <h2 id="cs-problem" className="text-h2 font-extrabold tracking-tight">
            {copy.sections.problem}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            <PlaceholderText text={study.problem} />
          </p>
        </section>

        {study.goals.length > 0 ? (
          <section aria-labelledby="cs-goals">
            <h2 id="cs-goals" className="text-h2 font-extrabold tracking-tight">
              {copy.sections.goals}
            </h2>
            <ul className="mt-5 space-y-3">
              {study.goals.map((goal) => (
                <li key={goal} className="flex gap-3">
                  <CircleCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                  <span className="text-ink">
                    <PlaceholderText text={goal} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="cs-approach">
          <h2 id="cs-approach" className="text-h2 font-extrabold tracking-tight">
            {copy.sections.approach}
          </h2>
          <div className="prose mt-5 max-w-none">{approach}</div>
        </section>
      </div>
    </Section>
  );
}

export function CaseStudyArchitecture({ study }: { study: CaseStudyMeta }) {
  if (!study.architecture) return null;
  const { src, alt, caption } = study.architecture;
  return (
    <Section background="tint" aria-labelledby="cs-architecture">
      <h2 id="cs-architecture" className="text-h2 font-extrabold tracking-tight">
        {copy.sections.architecture}
      </h2>
      <figure className="mt-8">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-surface shadow-card">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1200px) 1152px, 100vw"
            unoptimized={isUnoptimized(src)}
            className="object-contain"
          />
        </div>
        {caption ? (
          <figcaption className="mt-3 text-small text-muted">
            <PlaceholderText text={caption} />
          </figcaption>
        ) : null}
      </figure>
    </Section>
  );
}

export function CaseStudyFeatures({ study }: { study: CaseStudyMeta }) {
  if (study.features.length === 0) return null;
  return (
    <Section background="white" aria-labelledby="cs-features">
      <h2 id="cs-features" className="text-h2 font-extrabold tracking-tight">
        {copy.sections.features}
      </h2>
      <ul className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {study.features.map((feature) => {
          const Icon = icons[feature.icon as keyof typeof icons];
          if (!Icon) {
            throw new Error(
              `Case study "${study.slug}": unknown lucide icon "${feature.icon}" in features.`,
            );
          }
          return (
            <li key={feature.title} className="flex gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-md bg-soft text-primary">
                <Icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-body font-bold">{feature.title}</h3>
                <p className="mt-1 text-muted">
                  <PlaceholderText text={feature.text} />
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function CaseStudyScreens({ study }: { study: CaseStudyMeta }) {
  if (study.screens.length === 0) return null;
  return (
    <Section background="tint" aria-labelledby="cs-screens">
      <h2 id="cs-screens" className="text-h2 font-extrabold tracking-tight">
        {copy.sections.screens}
      </h2>
      <div className="mt-8">
        <Gallery images={study.screens} label={study.title} />
      </div>
    </Section>
  );
}

/** Rendered only when the frontmatter lists real results. */
export function CaseStudyResults({ study }: { study: CaseStudyMeta }) {
  if (study.results.length === 0) return null;
  return (
    <Section background="white" aria-labelledby="cs-results">
      <h2 id="cs-results" className="text-h2 font-extrabold tracking-tight">
        {copy.sections.results}
      </h2>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {study.results.map((result) => (
          <li
            key={result}
            className="flex gap-3 rounded-lg border border-border bg-surface p-5 shadow-card"
          >
            <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-success" />
            <span className="font-semibold text-ink">{result}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function CaseStudyNext({ study }: { study: CaseStudyMeta }) {
  if (study.nextSteps.length === 0) return null;
  return (
    <Section background="white" aria-labelledby="cs-next">
      <div className="mx-auto max-w-3xl">
        <h2 id="cs-next" className="text-h2 font-extrabold tracking-tight">
          {copy.sections.next}
        </h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-lg text-muted marker:text-primary">
          {study.nextSteps.map((step) => (
            <li key={step}>
              <PlaceholderText text={step} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

type PagerLink = { slug: string; title: string } | undefined;

export function CaseStudyPager({ previous, next }: { previous: PagerLink; next: PagerLink }) {
  if (!previous && !next) return null;
  const link =
    "group flex h-full flex-col gap-1 rounded-lg border border-border bg-surface p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover";
  return (
    <nav aria-label="More case studies" className="bg-tint">
      <Container className="grid gap-4 py-10 sm:grid-cols-2">
        {previous ? (
          <Link href={`/work/${previous.slug}`} className={link}>
            <span className="inline-flex items-center gap-1.5 text-small font-semibold text-primary">
              <ArrowLeft aria-hidden="true" className="size-4" /> {copy.pager.previous}
            </span>
            <span className="font-heading font-bold text-ink">{previous.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/work/${next.slug}`} className={`${link} sm:items-end sm:text-right`}>
            <span className="inline-flex items-center gap-1.5 text-small font-semibold text-primary">
              {copy.pager.next} <ArrowRight aria-hidden="true" className="size-4" />
            </span>
            <span className="font-heading font-bold text-ink">{next.title}</span>
          </Link>
        ) : null}
      </Container>
    </nav>
  );
}
