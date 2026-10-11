import { Button } from "@/components/ui/Button";
import { InfoCard } from "@/components/ui/cards/InfoCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeContent } from "@/content/home";

export function Overview() {
  const { overview } = homeContent;

  return (
    <Section id={overview.id} background="white">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading
            align="left"
            eyebrow={overview.eyebrow}
            title={overview.title}
            highlight={overview.highlight}
          />
          <div className="mt-6 space-y-4 text-muted">
            {overview.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={overview.primaryCta.href}>{overview.primaryCta.label}</Button>
            <Button href={overview.secondaryCta.href} variant="outline">
              {overview.secondaryCta.label}
            </Button>
          </div>
        </div>

        <Reveal className="lg:col-span-5">
          <InfoCard
            heading={overview.card.title}
            text={overview.card.text}
            items={overview.card.items}
          />
        </Reveal>
      </div>
    </Section>
  );
}
