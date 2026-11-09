import fs from "node:fs";
import path from "node:path";
import { FaqSection } from "@/components/sections/shared/FaqSection";
import { Lab } from "@/components/sections/shared/Lab";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { ChipList } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { StatusDot } from "@/components/ui/StatusDot";
import { aboutContent } from "@/content/about";
import { socialLinks } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { bookingHref, bookingIsExternal } from "@/lib/booking";
import { isPlaceholder } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { pad2 } from "@/lib/utils";

export const metadata = buildMetadata({
  title: aboutContent.seo.title,
  description: aboutContent.seo.description,
  path: "/about",
});

const PLACEHOLDER_PORTRAIT = "/images/founder-placeholder.svg";

/** "Download my CV" only appears once the file exists in /public (checked at build time). */
function cvExists() {
  return fs.existsSync(path.join(process.cwd(), "public", aboutContent.opening.cv.href));
}

/**
 * Why Polestride · the founder · Values · Toolbox · From the lab · Working rhythm · Questions.
 * Person JSON-LD comes from the site graph.
 */
export default function AboutPage() {
  const { why, opening, values, toolbox, rhythm, faq } = aboutContent;
  const { founder } = siteConfig;
  const hasPhoto = !isPlaceholder(founder.photo);
  const availabilityLabel = opening.availability[siteConfig.availability];

  return (
    <>
      <Section
        tone="sky"
        underHeader
        padding="none"
        className="overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-16 lg:pt-[calc(var(--header-h)+5rem)] lg:pb-24"
        aria-labelledby="about-title"
      >
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <h1 id="about-title" className="animate-rise text-h1 text-ink lg:col-span-5">
            {why.title}
          </h1>
          <div className="space-y-5 text-lg text-ink-muted lg:col-span-6 lg:col-start-7">
            {why.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="font-display text-2xl leading-snug font-semibold text-ink">
              {siteConfig.tagline}
            </p>
          </div>
        </div>
      </Section>

      <Section id="founder" tone="surface" aria-labelledby="founder-title">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="max-w-xl text-lg text-ink-muted">{opening.lead}</p>
            <h2 id="founder-title" className="mt-8 text-h2 text-ink">
              Arsh means <em>sky</em>. Deep means <em>lamp</em>.
            </h2>
            <p className="mt-3 label-text text-ink-muted">
              <PlaceholderText text={opening.titleNote} />
            </p>
            <p className="mt-8 max-w-xl text-2xl leading-snug font-medium text-ink">
              {opening.text}
            </p>
            <p className="mt-5 label-text text-ink-muted">
              {founder.role} ·{" "}
              <PlaceholderText
                text={`${siteConfig.location.city}, ${siteConfig.location.countryName}`}
              />
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                href={bookingHref}
                size="lg"
                data-cta="about-hero"
                {...(bookingIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {opening.cta.label}
              </Button>
              {cvExists() ? (
                <Button
                  href={opening.cv.href}
                  variant="outline"
                  size="lg"
                  download
                  prefetch={false}
                >
                  {opening.cv.label}
                </Button>
              ) : null}
            </div>
            {socialLinks.length > 0 ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in a new tab)`}
                      className="inline-flex size-11 items-center justify-center rounded-button border border-border text-ink hover:border-link"
                    >
                      <SocialIcon name={social.key} className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="mx-auto w-full max-w-sm lg:col-span-4 lg:col-start-9">
            <ArchFrame
              src={hasPhoto ? founder.photo : PLACEHOLDER_PORTRAIT}
              alt={hasPhoto ? opening.photoAlt : `Placeholder for ${founder.name}'s portrait`}
              width={480}
              height={600}
              sizes="(min-width: 1024px) 384px, 90vw"
              unoptimized={!hasPhoto}
            >
              <StatusDot status={siteConfig.availability} label={availabilityLabel} />
            </ArchFrame>
          </div>
        </div>
      </Section>

      <Section id={values.id} tone="base" aria-labelledby="values-title">
        <p className="label-text text-ink-muted">
          ({pad2(1)}) {values.label}
        </p>
        <h2 id="values-title" className="sr-only">
          {values.title}
        </h2>
        <ul className="mt-10 border-t border-border">
          {values.lines.map((line, index) => (
            <RevealItem
              as="li"
              key={line.word}
              index={index}
              className="grid gap-2 border-b border-border py-6 md:grid-cols-12 md:items-baseline md:gap-8"
            >
              <p className="text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] leading-tight font-semibold text-ink md:col-span-5">
                {line.word}
              </p>
              <p className="text-ink-muted md:col-span-7">{line.text}</p>
            </RevealItem>
          ))}
        </ul>
      </Section>

      <Section id={toolbox.id} tone="surface" aria-labelledby="toolbox-title">
        <SectionHeader
          id="toolbox-title"
          index={2}
          label={toolbox.label}
          title={toolbox.title}
          emphasis={toolbox.emphasis}
        />
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {toolbox.pillars.map((pillar) => (
            <li
              key={pillar.title}
              className="rounded-card border border-border p-7 transition-colors duration-300 hover:border-link"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-dot border border-border text-ink-muted">
                <Icon icon={pillar.icon} strokeWidth={1.5} className="size-5" />
              </span>
              <h3 className="mt-5 text-h3 text-ink">{pillar.title}</h3>
              <p className="mt-2 text-ink-muted">{pillar.text}</p>
              <ChipList items={pillar.skills} className="mt-5" />
            </li>
          ))}
        </ul>
      </Section>

      <Lab index={3} />

      <Section id={rhythm.id} tone="surface" aria-labelledby="rhythm-title">
        <SectionHeader
          id="rhythm-title"
          index={4}
          label={rhythm.label}
          title={rhythm.title}
          emphasis={rhythm.emphasis}
        />
        <ol className="relative mt-14 grid gap-8 md:grid-cols-3">
          <span
            aria-hidden="true"
            className="absolute top-[5px] right-0 left-0 hidden h-px bg-border md:block"
          />
          {rhythm.week.map((slot) => (
            <li key={slot.title} className="relative">
              <span
                aria-hidden="true"
                className="relative block size-[11px] rounded-dot bg-ink-muted"
              />
              <p className="mt-5 label-text text-ink-muted">{slot.day}</p>
              <h3 className="mt-1 text-h3 text-ink">{slot.title}</h3>
              <p className="mt-1 text-ink-muted">{slot.text}</p>
            </li>
          ))}
        </ol>
        <dl className="mt-14 grid gap-4 border-t border-border pt-6 text-small sm:grid-cols-3 lg:grid-cols-5">
          {rhythm.tools.map((tool) => (
            <div key={tool.label}>
              <dt className="label-text text-ink-muted">{tool.label}</dt>
              <dd className="mt-1 font-semibold text-ink">{tool.tools}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-small text-ink-muted">{rhythm.note}</p>
      </Section>

      <FaqSection
        index={5}
        label={faq.label}
        title={faq.title}
        emphasis={faq.emphasis}
        items={faq.items}
      />
    </>
  );
}
