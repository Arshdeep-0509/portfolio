import Image from "next/image";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { cardBase } from "@/components/ui/cards/Card";
import { SkillPillar } from "@/components/ui/cards/SkillPillar";
import { Container } from "@/components/ui/Container";
import { IconTile } from "@/components/ui/IconTile";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Timeline } from "@/components/ui/Timeline";
import { aboutContent } from "@/content/about";
import { homeContent } from "@/content/home";
import { socialLinks } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Section components for /about. All copy comes from src/content/about.ts. */

const PLACEHOLDER_PORTRAIT = "/images/founder-placeholder.svg";

export function FounderHero({ hasCv }: { hasCv: boolean }) {
  const { hero } = aboutContent;
  const { founder, location } = siteConfig;
  const hasPhoto = !isPlaceholder(founder.photo);

  return (
    <section
      aria-labelledby="page-title"
      className="tone-gradient relative isolate overflow-hidden bg-grad-hero text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-dots" />
      <Container className="py-12 sm:py-16 lg:py-20">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} jsonLd />
        <div className="mt-8 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
          <div className="max-w-2xl">
            <Badge variant="eyebrow-dark">{hero.eyebrow}</Badge>
            <h1 id="page-title" className="mt-5 text-h1 font-extrabold tracking-tight text-white">
              Hi, I&apos;m <span className="text-tone-highlight">{founder.name}</span>
            </h1>
            <p className="mt-4 font-mono text-small font-medium tracking-wide text-white">
              {founder.role} · <PlaceholderText text={`${location.city}, ${location.country}`} />
            </p>
            <p className="mt-5 max-w-xl text-lg text-white">{hero.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={hero.primaryCta.href} variant="white" size="lg">
                {hero.primaryCta.label}
              </Button>
              {hasCv ? (
                <Button
                  href={hero.cv.href}
                  variant="ghost-light"
                  size="lg"
                  download
                  prefetch={false}
                >
                  {hero.cv.label}
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
                      className="inline-flex size-11 items-center justify-center rounded-pill border border-white/40 text-white transition-colors duration-200 hover:bg-white/10"
                    >
                      <SocialIcon name={social.key} className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Portrait: 24px radius, gradient border, with a status card over its bottom-left corner. */}
          <div className="relative mx-auto w-full max-w-sm pb-12 pl-4 sm:pl-8">
            <div className="rounded-xl bg-linear-to-br from-sky-400 via-sky-200 to-white p-1 shadow-card-hover">
              <Image
                src={hasPhoto ? founder.photo : PLACEHOLDER_PORTRAIT}
                alt={hasPhoto ? hero.photoAlt : `Placeholder for ${founder.name}'s portrait`}
                width={480}
                height={560}
                preload
                sizes="(min-width: 1024px) 384px, 90vw"
                // The placeholder is an SVG, which the image optimiser doesn't process.
                unoptimized={!hasPhoto}
                className="aspect-[6/7] w-full rounded-[20px] object-cover"
              />
            </div>
            {/* Near-opaque navy rather than see-through glass: white text must stay readable over
                light areas of the photo. */}
            <div className="tone-dark absolute bottom-0 left-0 max-w-[17rem] rounded-lg border border-white/20 bg-navy-900/90 p-5 shadow-card-hover backdrop-blur-md">
              <p className="text-small font-semibold text-white">{hero.currently}</p>
              <AvailabilityBadge status={siteConfig.availability} className="mt-3" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function AboutStory() {
  const { story } = aboutContent;
  return (
    <Section id={story.id} background="white">
      <div className="mx-auto max-w-3xl">
        <SectionHeading align="left" title={story.title} highlight={story.highlight} />
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
          {story.paragraphs.map((paragraph) => (
            <p key={paragraph}>
              <PlaceholderText text={paragraph} />
            </p>
          ))}
        </div>
        <figure className="mt-12 border-l-4 border-primary pl-6">
          <blockquote className="font-heading text-h2 font-extrabold tracking-tight text-ink">
            <p>“{story.quote}”</p>
          </blockquote>
        </figure>
      </div>
    </Section>
  );
}

export function MissionVision() {
  return (
    <Section background="tint" aria-label="Mission and vision">
      <ul className="grid gap-6 md:grid-cols-2">
        {aboutContent.missionVision.map((item) => (
          <li key={item.label} className={cn(cardBase, "flex flex-col gap-5 sm:flex-row")}>
            <IconTile icon={item.icon} size="lg" />
            <div>
              <h2 className="font-mono text-eyebrow font-medium text-primary uppercase">
                {item.label}
              </h2>
              <p className="mt-2 font-heading text-h3 leading-snug font-bold text-ink">
                {item.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function AboutValues() {
  const { values } = aboutContent;
  return (
    <Section background="white" aria-labelledby="about-values-title">
      <SectionHeading id="about-values-title" title={values.title} highlight={values.highlight} />
      <RevealGroup as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {values.items.map((item, index) => (
          <RevealItem as="li" key={item.title} index={index}>
            <div className={cn(cardBase, "h-full p-6")}>
              <IconTile icon={item.icon} size="sm" />
              <h3 className="mt-4 text-body font-bold">{item.title}</h3>
              <p className="mt-1.5 text-small text-muted">{item.text}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

export function AboutJourney() {
  const { journey } = aboutContent;
  return (
    <Section id={journey.id} background="section">
      <SectionHeading title={journey.title} highlight={journey.highlight} />
      <Timeline
        variant="milestones"
        className="mx-auto mt-14 max-w-4xl"
        items={journey.milestones.map((milestone, index) => ({
          title: milestone.title,
          // Custom content so [YEAR] / [ADD DETAILS] placeholders are visibly marked.
          content: (
            <div className={cn(index % 2 === 0 && "md:text-right")}>
              <p className="font-mono text-eyebrow font-medium text-tone-accent-text uppercase">
                <PlaceholderText text={milestone.meta} />
              </p>
              <h3 className="mt-1 text-h3 font-bold">{milestone.title}</h3>
              <p className="mt-1.5 text-tone-muted">
                <PlaceholderText text={milestone.text} />
              </p>
            </div>
          ),
        }))}
      />
    </Section>
  );
}

export function AboutPillars() {
  const { pillars } = aboutContent;
  return (
    <Section background="white" aria-labelledby="about-pillars-title">
      <SectionHeading
        id="about-pillars-title"
        title={pillars.title}
        highlight={pillars.highlight}
      />
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.items.map((pillar) => (
          <li key={pillar.title}>
            <SkillPillar
              icon={pillar.icon}
              title={pillar.title}
              text={pillar.text}
              skills={pillar.skills}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function WorkTogether() {
  const { workTogether } = aboutContent;
  return (
    <Section background="white" aria-labelledby="about-work-title">
      <SectionHeading
        id="about-work-title"
        title={workTogether.title}
        highlight={workTogether.highlight}
      />
      <ul className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {workTogether.tools.map((tool) => (
          <li key={tool.label} className="flex flex-col items-center text-center">
            <IconTile icon={tool.icon} size="lg" />
            <h3 className="mt-3 text-body font-bold">{tool.label}</h3>
            <p className="mt-0.5 text-small text-muted">{tool.tools}</p>
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-10 max-w-2xl rounded-pill bg-soft px-6 py-3 text-center text-small font-semibold text-navy-900">
        {workTogether.cadence}
      </p>
    </Section>
  );
}

export function AboutBenefits() {
  const copy = aboutContent.benefits;
  return (
    <Section background="tint" aria-labelledby="about-benefits-title">
      <SectionHeading id="about-benefits-title" title={copy.title} highlight={copy.highlight} />
      <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {homeContent.benefits.items.map((item) => (
          <li key={item.title} className="flex gap-4">
            <IconTile icon={item.icon} size="sm" />
            <div>
              <h3 className="text-body font-bold">{item.title}</h3>
              <p className="mt-1 text-small text-muted">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
