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
 * Name story (night) · Values (ivory) · Toolbox (sand) · From the lab (night) ·
 * Working rhythm (sand) · Questions. Person JSON-LD comes from the site graph.
 */
export default function AboutPage() {
  const { opening, values, toolbox, rhythm, faq } = aboutContent;
  const { founder } = siteConfig;
  const hasPhoto = !isPlaceholder(founder.photo);
  const availabilityLabel = opening.availability[siteConfig.availability];

  return (
    <>
      <Section
        tone="night"
        underHeader
        padding="none"
        className="overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-20 lg:pt-[calc(var(--header-h)+5rem)] lg:pb-28"
        aria-labelledby="about-title"
      >
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <div className="mt-10 grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h1 id="about-title" className="animate-rise text-h1 text-fg">
              Arsh means <em>sky</em>. Deep means <em>lamp</em>.
            </h1>
            <p className="mt-3 label-mono text-mist-300">
              <PlaceholderText text={opening.titleNote} />
            </p>
            <p className="mt-8 max-w-xl font-display-soft text-2xl leading-snug text-fg">
              {opening.text}
            </p>
            <p className="mt-5 max-w-xl text-fg-muted">{opening.lead}</p>
            <p className="mt-5 label-mono text-mist-300">
              {founder.role} ·{" "}
              <PlaceholderText
                text={`${siteConfig.location.city}, ${siteConfig.location.country}`}
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
                      className="inline-flex size-11 items-center justify-center rounded-button border border-line-dark text-ivory-50 hover:border-lamp-500"
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
              preload
              sizes="(min-width: 1024px) 384px, 90vw"
              unoptimized={!hasPhoto}
            >
              <StatusDot status={siteConfig.availability} label={availabilityLabel} />
            </ArchFrame>
          </div>
        </div>
      </Section>

      <Section id={values.id} tone="ivory" aria-labelledby="values-title">
        <p className="label-mono text-accent">
          ({pad2(1)}) {values.label}
        </p>
        <h2 id="values-title" className="sr-only">
          {values.title}
        </h2>
        <ul className="mt-10 border-t border-rule">
          {values.lines.map((line, index) => (
            <RevealItem
              as="li"
              key={line.word}
              index={index}
              className="grid gap-2 border-b border-rule py-6 md:grid-cols-12 md:items-baseline md:gap-8"
            >
              <p className="font-display-soft text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] leading-tight text-fg md:col-span-5">
                {line.word}
              </p>
              <p className="text-fg-muted md:col-span-7">{line.text}</p>
            </RevealItem>
          ))}
        </ul>
      </Section>

      <Section id={toolbox.id} tone="sand" aria-labelledby="toolbox-title">
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
              className="rounded-card border border-rule p-7 transition-[border-color,box-shadow] duration-300 hover:border-lamp-500 hover:shadow-glow"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-dot border border-rule text-accent">
                <Icon icon={pillar.icon} strokeWidth={1.5} className="size-5" />
              </span>
              <h3 className="mt-5 text-h3 text-fg">{pillar.title}</h3>
              <p className="mt-2 text-fg-muted">{pillar.text}</p>
              <ChipList items={pillar.skills} className="mt-5" />
            </li>
          ))}
        </ul>
      </Section>

      <Lab index={3} />

      <Section id={rhythm.id} tone="sand" aria-labelledby="rhythm-title">
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
            className="absolute top-[5px] right-0 left-0 hidden h-px bg-lamp-500/60 md:block"
          />
          {rhythm.week.map((slot) => (
            <li key={slot.title} className="relative">
              <span
                aria-hidden="true"
                className="relative block size-[11px] rounded-dot bg-lamp-500"
              />
              <p className="mt-5 label-mono text-accent">{slot.day}</p>
              <h3 className="mt-1 text-h3 text-fg">{slot.title}</h3>
              <p className="mt-1 text-fg-muted">{slot.text}</p>
            </li>
          ))}
        </ol>
        <dl className="mt-14 grid gap-4 border-t border-rule pt-6 text-small sm:grid-cols-3 lg:grid-cols-5">
          {rhythm.tools.map((tool) => (
            <div key={tool.label}>
              <dt className="label-mono text-fg-muted">{tool.label}</dt>
              <dd className="mt-1 font-semibold text-fg">{tool.tools}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-small text-fg-muted">{rhythm.note}</p>
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
