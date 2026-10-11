import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NumberedCard } from "@/components/ui/cards/NumberedCard";
import { cardBase } from "@/components/ui/cards/Card";
import { TechChip } from "@/components/ui/Chip";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { Icon } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { techCategories } from "@/content/techStack";
import { whyMeContent } from "@/content/whyMe";
import { cn } from "@/lib/utils";

/** Section components for /why-me. All copy comes from src/content/whyMe.ts. */

export function WhyIntro() {
  const { intro } = whyMeContent;
  return (
    <Section background="white" aria-labelledby="why-intro-title">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="why-intro-title"
            align="left"
            title={intro.title}
            highlight={intro.highlight}
          />
          <div className="mt-6 space-y-4 text-lg text-muted">
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Button href={intro.cta.href} size="lg" className="mt-8">
            {intro.cta.label}
          </Button>
        </div>

        <div>
          <p className="font-mono text-eyebrow font-medium text-muted uppercase">
            {intro.commitmentsLabel}
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-4">
            {intro.commitments.map((item) => (
              <li key={item.label} className={cn(cardBase, "p-5")}>
                <Icon icon={item.icon} className="size-5 text-primary" />
                <p className="mt-3 font-heading text-h3 font-extrabold text-ink">{item.value}</p>
                <p className="mt-1 text-small text-muted">{item.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export function WhyDifferent() {
  const { different } = whyMeContent;
  return (
    <Section background="tint" aria-labelledby="why-different-title">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          id="why-different-title"
          title={different.title}
          highlight={different.highlight}
        />
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
          {different.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function WhyBenefits() {
  const { benefits } = whyMeContent;
  return (
    <Section background="white" aria-labelledby="why-benefits-title">
      <SectionHeading
        id="why-benefits-title"
        title={benefits.title}
        highlight={benefits.highlight}
      />
      <RevealGroup as="ul" className="mx-auto mt-12 grid max-w-4xl gap-5">
        {benefits.items.map((item, index) => (
          <RevealItem as="li" key={item.title} index={index}>
            <div className={cn(cardBase, "flex flex-col gap-5 sm:flex-row sm:items-start")}>
              <IconTile icon={item.icon} />
              <div>
                <h3 className="text-h3 font-bold">{item.title}</h3>
                <p className="mt-2 text-muted">{item.text}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

export function WhyComparison() {
  const { comparison } = whyMeContent;
  return (
    <Section id="comparison" background="section">
      <SectionHeading
        title={comparison.title}
        highlight={comparison.highlight}
        subtitle={comparison.intro}
      />
      <ComparisonTable id="why-comparison" data={comparison} className="mt-12" />
    </Section>
  );
}

export function WhyDifferentiators() {
  const { differentiators } = whyMeContent;
  return (
    <Section background="white" aria-labelledby="why-differentiators-title">
      <SectionHeading
        id="why-differentiators-title"
        title={differentiators.title}
        highlight={differentiators.highlight}
      />
      <RevealGroup as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {differentiators.items.map((item, index) => (
          <RevealItem as="li" key={item.title} index={index}>
            <NumberedCard
              number={index + 1}
              label={item.label}
              icon={item.icon}
              title={item.title}
              text={item.text}
            />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

export function WhyFit() {
  const { fit } = whyMeContent;
  return (
    <Section background="tint" aria-label={`${fit.forTitle} and ${fit.notForTitle.toLowerCase()}`}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className={cn(cardBase, "border-t-4 border-t-success")}>
          <h2 className="text-h3 font-bold">{fit.forTitle}</h2>
          <ul className="mt-5 space-y-3">
            {fit.forItems.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-pill bg-success-soft text-success-strong"
                >
                  <Check className="size-3.5" strokeWidth={2.75} />
                </span>
                <span className="text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cn(cardBase, "border-t-4 border-t-subtle")}>
          <h2 className="text-h3 font-bold">{fit.notForTitle}</h2>
          <ul className="mt-5 space-y-3">
            {fit.notForItems.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-pill bg-tint text-muted"
                >
                  <X className="size-3.5" strokeWidth={2.75} />
                </span>
                <span className="text-ink">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-small text-muted">{fit.notForNote}</p>
        </div>
      </div>
    </Section>
  );
}

export function WhyTechnology() {
  const { technology } = whyMeContent;
  return (
    <Section background="white" aria-labelledby="why-tech-title">
      <SectionHeading
        id="why-tech-title"
        title={technology.title}
        highlight={technology.highlight}
        subtitle={technology.subtitle}
      />
      <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {techCategories.map((category) => (
          <li key={category.id}>
            <h3 className="text-body font-bold">{category.title}</h3>
            <p className="text-small text-muted">{category.subtitle}</p>
            <ul aria-label={`${category.title} tools`} className="mt-3 flex flex-wrap gap-1.5">
              {category.tech.map((name) => (
                <li key={name}>
                  <TechChip>{name}</TechChip>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
