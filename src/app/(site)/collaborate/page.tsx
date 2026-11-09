import { LazyApplicationForm } from "@/components/sections/LazyPageForms";
import { ApplyButton } from "@/components/sections/collaborate/ApplyButton";
import { FaqSection } from "@/components/sections/shared/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Star } from "@/components/brand/Star";
import { Button } from "@/components/ui/Button";
import { ChipList } from "@/components/ui/Chip";
import { EditorialList } from "@/components/ui/EditorialList";
import { Emphasis } from "@/components/ui/Emphasis";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import {
  benefits,
  collaborateContent,
  openRoles,
  roleOptions,
  type Role,
  type RoleType,
} from "@/content/collaborate";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, pad2 } from "@/lib/utils";

export const metadata = buildMetadata({
  title: collaborateContent.seo.title,
  description: collaborateContent.seo.description,
  path: "/collaborate",
});

/**
 * Night opening with a one-line promise · audience tabs with open roles (ivory) · hiring steps
 * as a numbered line (sand) · honest benefits (ivory) · the three-step application (night) ·
 * Questions.
 */
export default function CollaboratePage() {
  const { hero, audiences, hiring, benefits: benefitsCopy, form, faq } = collaborateContent;

  return (
    <>
      <Section
        tone="sky"
        underHeader
        padding="none"
        className="overflow-hidden pt-[calc(var(--header-h)+4rem)] pb-20 lg:pt-[calc(var(--header-h)+6rem)] lg:pb-24"
        aria-labelledby="collaborate-title"
      >
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Collaborate" }]} />
        <p className="mt-8 label-text text-ink-muted">{hero.label}</p>
        <h1 id="collaborate-title" className="mt-5 max-w-[20ch] animate-rise text-h1 text-ink">
          <Emphasis text={hero.title} emphasis={hero.emphasis} />
        </h1>
        <dl className="mt-12 flex label-text flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-6 text-ink-muted max-sm:flex-col max-sm:items-start">
          <dt className="sr-only">{hero.factsLabel}</dt>
          {hero.facts.map((fact, index) => (
            <dd key={fact} className="flex items-center gap-4">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="size-1 rounded-dot bg-ink-muted max-sm:hidden"
                />
              ) : null}
              {fact}
            </dd>
          ))}
        </dl>
        <Button href="#apply" size="lg" className="mt-10" data-cta="collaborate-hero">
          {hero.cta}
        </Button>
      </Section>

      <Section id={audiences.id} tone="base" aria-labelledby="audiences-title">
        <SectionHeader
          id="audiences-title"
          index={1}
          label={audiences.label}
          title={audiences.title}
          emphasis={audiences.emphasis}
        />
        <Tabs
          className="mt-14"
          label={audiences.tabsLabel}
          items={audiences.groups.map((group) => {
            const groupRoles = openRoles.filter((role) => role.audiences.includes(group.id));
            return {
              id: group.id,
              label: group.label,
              content: (
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                  <div className="lg:col-span-5">
                    <p className="text-lg text-ink">{group.intro}</p>
                    <ul className="mt-6 border-t border-border">
                      {group.points.map((point) => (
                        <li
                          key={point}
                          className="flex min-h-12 items-center gap-3 border-b border-border text-ink"
                        >
                          <span aria-hidden="true" className="size-1.5 rounded-dot bg-ink-muted" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 label-text text-ink-muted">{group.typicalLabel}</p>
                    <ChipList items={group.typical} className="mt-2" />
                  </div>
                  <div className="lg:col-span-6 lg:col-start-7">
                    <p className="label-text text-ink-muted">{audiences.rolesLabel}</p>
                    {groupRoles.length > 0 ? (
                      <ul className="mt-3 border-t border-border">
                        {groupRoles.map((role) => (
                          <RoleRow key={role.id} role={role} applyLabel={audiences.apply} />
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 border-y border-border py-6 text-ink-muted">
                        {audiences.noRoles}
                      </p>
                    )}
                  </div>
                </div>
              ),
            };
          })}
        />
      </Section>

      <Section id={hiring.id} tone="surface" aria-labelledby="hiring-title">
        <SectionHeader
          id="hiring-title"
          index={2}
          label={hiring.label}
          title={hiring.title}
          emphasis={hiring.emphasis}
        />
        <ol className="relative mt-14 grid gap-8 md:grid-cols-5 md:gap-6">
          <span
            aria-hidden="true"
            className="absolute top-1.5 right-0 left-0 hidden star-path-x md:block"
          />
          {hiring.steps.map((item, index) => (
            <li key={item.title} className="group relative max-md:pl-8">
              {/* Below 768px the steps stack, so the path runs down the side instead of across. */}
              {index < hiring.steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-6 -bottom-7 left-1.5 star-path md:hidden"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="relative block w-fit bg-surface pr-1 max-md:absolute max-md:top-0.5 max-md:left-0"
              >
                <Star className="block size-3.5 text-ink-muted transition-colors duration-300 group-hover:text-accent" />
              </span>
              <p className="text-xs text-ink-muted tabular-nums md:mt-5">{pad2(index + 1)}</p>
              <h3 className="mt-1 font-sans text-body font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-small text-ink-muted">{item.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 label-text text-ink-muted">{hiring.note}</p>
      </Section>

      <Section id={benefitsCopy.id} tone="base" aria-labelledby="benefits-title">
        <SectionHeader
          id="benefits-title"
          index={3}
          label={benefitsCopy.label}
          title={benefitsCopy.title}
          emphasis={benefitsCopy.emphasis}
          intro={<p>{benefitsCopy.note}</p>}
        />
        <EditorialList className="mt-14" layout="wide" items={benefits} />
      </Section>

      <Section id={form.id} tone="sky-ruled" aria-labelledby="apply-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="label-text text-ink-muted">
              ({pad2(4)}) {form.label}
            </p>
            <h2 id="apply-title" data-reveal="mask" className="mt-6 text-h2 text-ink">
              <Emphasis text={form.title} emphasis={form.emphasis} />
            </h2>
            <p className="mt-6 text-ink-muted">{form.intro}</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <LazyApplicationForm copy={form} roles={roleOptions} />
          </div>
        </div>
      </Section>

      <FaqSection
        index={5}
        label={faq.label}
        title={faq.title}
        emphasis={faq.emphasis}
        items={faq.items}
      />
      <JobPostingsJsonLd />
    </>
  );
}

function RoleRow({ role, applyLabel }: { role: Role; applyLabel: string }) {
  return (
    <li className="grid gap-2 border-b border-border py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
      <div>
        <h3 className="font-sans text-body font-semibold text-ink">{role.title}</h3>
        <p className="mt-1 label-text text-ink-muted">
          {role.type.join(" / ")} · {role.location}
        </p>
        <p className="mt-2 text-small text-ink-muted">{role.summary}</p>
      </div>
      {role.applyUrl ? (
        <Button href={role.applyUrl} variant="text-link" target="_blank" rel="noopener noreferrer">
          {applyLabel}
          <span className="sr-only">: {role.title} (opens in a new tab)</span>
        </Button>
      ) : (
        <ApplyButton roleId={role.id} label={applyLabel} roleTitle={role.title} />
      )}
    </li>
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
function JobPostingsJsonLd() {
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
        url: role.applyUrl ?? absoluteUrl(`/collaborate?role=${role.id}#apply`),
      }}
    />
  ));
}
