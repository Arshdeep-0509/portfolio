import { ChevronDown, Clock, MapPin } from "lucide-react";
import { ApplicationForm } from "@/components/sections/careers/ApplicationForm";
import { ApplyButton } from "@/components/sections/careers/ApplyButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cardBase, CheckList } from "@/components/ui/cards/Card";
import { FeatureCard } from "@/components/ui/cards/FeatureCard";
import { TechChip } from "@/components/ui/Chip";
import { IconTile } from "@/components/ui/IconTile";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Timeline } from "@/components/ui/Timeline";
import {
  benefits,
  careersContent,
  openRoles,
  roleOptions,
  type Role,
  type RoleType,
} from "@/content/careers";
import { siteConfig } from "@/content/site";
import { techCategories } from "@/content/techStack";
import { absoluteUrl, cn } from "@/lib/utils";

/** Section components for /careers. All copy comes from src/content/careers.ts. */

export function CareersOpenings() {
  const { openings, shortVersion } = careersContent;

  return (
    <Section id={openings.id} background="section">
      <SectionHeading
        align="left"
        title={openings.title}
        highlight={openings.highlight}
        subtitle={openings.subtitle}
      />
      <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {openRoles.length > 0 ? (
          <ul className="space-y-6">
            {openRoles.map((role) => (
              <li key={role.id}>
                <RoleCard role={role} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="tone-light rounded-xl border border-dashed border-subtle bg-surface p-8 text-center sm:p-12">
            <p className="mx-auto max-w-lg text-lg text-ink">{openings.empty}</p>
            <Button href="#apply" className="mt-6">
              {openings.emptyCta}
            </Button>
          </div>
        )}

        <aside
          aria-labelledby="short-version-title"
          className="tone-dark rounded-xl bg-navy-900 p-7 text-white shadow-card-hover lg:sticky lg:top-[calc(var(--header-h)+2rem)]"
        >
          <h3 id="short-version-title" className="text-h3 font-bold text-white">
            {shortVersion.title}
          </h3>
          <dl className="mt-5 space-y-4">
            {shortVersion.items.map((item) => (
              <div
                key={item.label}
                className="border-t border-white/15 pt-4 first:border-0 first:pt-0"
              >
                <dt className="font-mono text-eyebrow font-medium text-tone-accent-text uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1 text-white">
                  <PlaceholderText text={item.value} />
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </Section>
  );
}

function RoleCard({ role }: { role: Role }) {
  const { openings } = careersContent;
  const detailsId = `role-${role.id}-details`;

  return (
    <article aria-labelledby={`role-${role.id}-title`} className={cn(cardBase, "p-6 sm:p-8")}>
      <div className="flex flex-wrap items-center gap-2">
        {role.type.map((type) => (
          <Badge key={type} variant="soft">
            {type}
          </Badge>
        ))}
      </div>
      <h3 id={`role-${role.id}-title`} className="mt-3 text-h3 font-bold">
        {role.title}
      </h3>
      <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-small text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MapPin aria-hidden="true" className="size-4" /> {role.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock aria-hidden="true" className="size-4" /> {role.experience}
        </span>
      </p>
      <p className="mt-3 text-muted">{role.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Skills">
        {role.skills.map((skill) => (
          <li key={skill}>
            <TechChip>{skill}</TechChip>
          </li>
        ))}
      </ul>

      {/* Native <details>: keyboard and screen-reader friendly, and works without JavaScript. */}
      <details className="group mt-5">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">{openings.viewDetails}</span>
          <span className="hidden group-open:inline">{openings.hideDetails}</span>
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform duration-200 group-open:rotate-180"
          />
        </summary>
        <div id={detailsId} className="mt-4 grid gap-6 border-t border-border pt-5 sm:grid-cols-2">
          <div>
            <h4 className="font-bold text-ink">{openings.responsibilitiesLabel}</h4>
            <CheckList items={role.responsibilities} className="mt-3" />
          </div>
          <div>
            <h4 className="font-bold text-ink">{openings.requirementsLabel}</h4>
            <CheckList items={role.requirements} className="mt-3" />
          </div>
        </div>
      </details>

      <div className="mt-5">
        {role.applyUrl ? (
          <Button href={role.applyUrl} target="_blank" rel="noopener noreferrer">
            {openings.apply}
            <span className="sr-only"> for {role.title} (opens in a new tab)</span>
          </Button>
        ) : (
          <ApplyButton roleId={role.id} label={openings.apply} />
        )}
      </div>
    </article>
  );
}

export function CareersCulture() {
  const { culture } = careersContent;
  return (
    <Section id={culture.id} background="white">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <SectionHeading align="left" title={culture.title} highlight={culture.highlight} />
          <p className="mt-6 text-lg leading-relaxed text-muted">{culture.text}</p>
        </div>
        <RevealGroup as="ul" className="grid gap-5 sm:grid-cols-2">
          {culture.points.map((point, index) => (
            <RevealItem as="li" key={point.title} index={index}>
              <div className={cn(cardBase, "h-full p-6")}>
                <IconTile icon={point.icon} size="sm" />
                <h3 className="mt-4 text-body font-bold">{point.title}</h3>
                <p className="mt-1.5 text-small text-muted">{point.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/** Renders only what is in `benefits` (careers.ts) — nothing else may appear here. */
export function CareersBenefits() {
  const copy = careersContent.benefits;
  return (
    <Section id={copy.id} background="tint">
      <SectionHeading title={copy.title} highlight={copy.highlight} subtitle={copy.subtitle} />
      <RevealGroup as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, index) => (
          <RevealItem as="li" key={benefit.title} index={index}>
            <FeatureCard icon={benefit.icon} title={benefit.title} text={benefit.text} />
          </RevealItem>
        ))}
      </RevealGroup>
      <p className="mx-auto mt-10 max-w-2xl text-center text-small text-muted">{copy.note}</p>
    </Section>
  );
}

export function CareersWhyJoin() {
  const { whyJoin } = careersContent;
  return (
    <Section background="dark" aria-labelledby="why-join-title">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading id="why-join-title" title={whyJoin.title} highlight={whyJoin.highlight} />
        <p className="mt-6 text-lg leading-relaxed text-tone-muted">{whyJoin.text}</p>
      </div>
    </Section>
  );
}

export function CareersTech() {
  const { tech } = careersContent;
  const groups = [
    ...tech.categoryIds.flatMap((id) => {
      const category = techCategories.find((item) => item.id === id);
      return category ? [{ title: category.title, tools: category.tech }] : [];
    }),
    tech.collaboration,
  ];

  return (
    <Section id={tech.id} background="white">
      <SectionHeading title={tech.title} highlight={tech.highlight} subtitle={tech.subtitle} />
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => (
          <li key={group.title} className={cn(cardBase, "p-6")}>
            <h3 className="text-body font-bold">{group.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.tools.map((tool) => (
                <li key={tool}>
                  <TechChip>{tool}</TechChip>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function CareersHiring() {
  const { hiring } = careersContent;
  return (
    <Section id={hiring.id} background="section">
      <SectionHeading
        title={hiring.title}
        highlight={hiring.highlight}
        subtitle={hiring.subtitle}
      />
      <Timeline variant="steps" className="mt-14" items={hiring.steps} />
      <p className="tone-light mx-auto mt-12 flex w-fit max-w-full items-center gap-2.5 rounded-pill border border-border bg-surface px-5 py-2.5 text-small font-semibold text-ink shadow-card">
        <Clock aria-hidden="true" className="size-4 shrink-0 text-primary" />
        {hiring.note}
      </p>
    </Section>
  );
}

export function CareersRoleTypes() {
  const { roleTypes } = careersContent;
  return (
    <Section id={roleTypes.id} background="white">
      <SectionHeading
        title={roleTypes.title}
        highlight={roleTypes.highlight}
        subtitle={roleTypes.subtitle}
      />
      <RevealGroup as="ul" className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {roleTypes.items.map((item, index) => (
          <RevealItem as="li" key={item.title} index={index}>
            <div
              className={cn(cardBase, "flex h-full flex-col gap-3 p-5 sm:flex-row sm:items-center")}
            >
              <IconTile icon={item.icon} size="sm" />
              <div>
                <h3 className="font-bold text-ink">{item.title}</h3>
                <p className="text-small text-muted">{item.text}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

export function CareersApply() {
  const { form } = careersContent;
  return (
    <Section id={form.id} background="tint">
      <SectionHeading title={form.title} highlight={form.highlight} subtitle={form.subtitle} />
      <div className="mx-auto mt-12 max-w-3xl">
        <ApplicationForm copy={form} roles={roleOptions} />
      </div>
    </Section>
  );
}

const EMPLOYMENT_TYPE: Record<RoleType, string> = {
  Freelance: "CONTRACTOR",
  Contract: "CONTRACTOR",
  Internship: "INTERN",
  "Full-time": "FULL_TIME",
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * JobPosting structured data for OPEN roles only. A role also needs a real `datePosted`
 * (Google requires it); closed roles are never included.
 */
export function JobPostingsJsonLd() {
  const postings = openRoles.filter((role) => role.datePosted && ISO_DATE.test(role.datePosted));
  if (postings.length === 0) return null;

  return postings.map((role) => (
    <JsonLd
      key={role.id}
      data={{
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: role.title,
        description: [
          `<p>${role.summary}</p>`,
          `<p><strong>Responsibilities</strong></p><ul>${role.responsibilities.map((item) => `<li>${item}</li>`).join("")}</ul>`,
          `<p><strong>Requirements</strong></p><ul>${role.requirements.map((item) => `<li>${item}</li>`).join("")}</ul>`,
        ].join(""),
        identifier: { "@type": "PropertyValue", name: siteConfig.name, value: role.id },
        datePosted: role.datePosted,
        ...(role.validThrough ? { validThrough: role.validThrough } : {}),
        employmentType: [...new Set(role.type.map((type) => EMPLOYMENT_TYPE[type]))],
        hiringOrganization: {
          "@type": "Organization",
          name: siteConfig.name,
          sameAs: siteConfig.url,
        },
        jobLocationType: "TELECOMMUTE",
        applicantLocationRequirements: { "@type": "Country", name: "India" },
        skills: role.skills.join(", "),
        experienceRequirements: role.experience,
        directApply: !role.applyUrl,
        url: role.applyUrl ?? absoluteUrl(`/careers?role=${role.id}#apply`),
      }}
    />
  ));
}
