import { ApplicationForm } from "@/components/sections/collaborate/ApplicationForm";
import { ApplyButton } from "@/components/sections/collaborate/ApplyButton";
import { FaqSection } from "@/components/sections/shared/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
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
        tone="night"
        underHeader
        padding="none"
        className="overflow-hidden pt-[calc(var(--header-h)+4rem)] pb-20 lg:pt-[calc(var(--header-h)+6rem)] lg:pb-24"
        aria-labelledby="collaborate-title"
      >
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Collaborate" }]} />
        <p className="mt-8 label-mono text-lamp-400">{hero.label}</p>
        <h1 id="collaborate-title" className="mt-5 max-w-[20ch] animate-rise text-h1 text-fg">
          <Emphasis text={hero.title} emphasis={hero.emphasis} />
        </h1>
        <dl className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line-dark pt-6 label-mono text-mist-300">
          <dt className="sr-only">{hero.factsLabel}</dt>
          {hero.facts.map((fact, index) => (
            <dd key={fact} className="flex items-center gap-4">
              {index > 0 ? (
                <span aria-hidden="true" className="size-1 rounded-dot bg-lamp-500/70" />
              ) : null}
              {fact}
            </dd>
          ))}
        </dl>
        <Button href="#apply" size="lg" className="mt-10" data-cta="collaborate-hero">
          {hero.cta}
        </Button>
      </Section>

      <Section id={audiences.id} tone="ivory" aria-labelledby="audiences-title">
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
                    <p className="text-lg text-fg">{group.intro}</p>
                    <ul className="mt-6 border-t border-rule">
                      {group.points.map((point) => (
                        <li
                          key={point}
                          className="flex min-h-12 items-center gap-3 border-b border-rule text-fg"
                        >
                          <span aria-hidden="true" className="size-1.5 rounded-dot bg-lamp-500" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 label-mono text-fg-muted">{group.typicalLabel}</p>
                    <ChipList items={group.typical} className="mt-2" />
                  </div>
                  <div className="lg:col-span-6 lg:col-start-7">
                    <p className="label-mono text-accent">{audiences.rolesLabel}</p>
                    {groupRoles.length > 0 ? (
                      <ul className="mt-3 border-t border-rule">
                        {groupRoles.map((role) => (
                          <RoleRow key={role.id} role={role} applyLabel={audiences.apply} />
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 border-y border-rule py-6 text-fg-muted">
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

      <Section id={hiring.id} tone="sand" aria-labelledby="hiring-title">
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
            className="absolute top-[5px] right-0 left-0 hidden h-px bg-lamp-500/60 md:block"
          />
          {hiring.steps.map((item, index) => (
            <li key={item.title} className="relative">
              <span
                aria-hidden="true"
                className="relative block size-[11px] rounded-dot bg-lamp-500"
              />
              <p className="mt-5 font-mono text-xs text-accent">{pad2(index + 1)}</p>
              <h3 className="mt-1 font-sans text-body font-semibold text-fg">{item.title}</h3>
              <p className="mt-1 text-small text-fg-muted">{item.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 label-mono text-fg-muted">{hiring.note}</p>
      </Section>

      <Section id={benefitsCopy.id} tone="ivory" aria-labelledby="benefits-title">
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

      <Section id={form.id} tone="night-900" aria-labelledby="apply-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="label-mono text-accent">
              ({pad2(4)}) {form.label}
            </p>
            <h2 id="apply-title" data-reveal="mask" className="mt-6 text-h2 text-fg">
              <Emphasis text={form.title} emphasis={form.emphasis} />
            </h2>
            <p className="mt-6 text-fg-muted">{form.intro}</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ApplicationForm copy={form} roles={roleOptions} />
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
    <li className="grid gap-2 border-b border-rule py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
      <div>
        <h3 className="font-sans text-body font-semibold text-fg">{role.title}</h3>
        <p className="mt-1 label-mono text-fg-muted">
          {role.type.join(" / ")} · {role.location}
        </p>
        <p className="mt-2 text-small text-fg-muted">{role.summary}</p>
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
