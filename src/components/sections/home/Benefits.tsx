import { FeatureCard } from "@/components/ui/cards/FeatureCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeContent } from "@/content/home";

export function Benefits() {
  const { benefits } = homeContent;

  return (
    <Section id={benefits.id} background="white">
      <SectionHeading
        title={benefits.title}
        highlight={benefits.highlight}
        subtitle={benefits.subtitle}
      />
      <RevealGroup as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.items.map((item, index) => (
          <RevealItem as="li" key={item.title} index={index}>
            <FeatureCard icon={item.icon} title={item.title} text={item.text} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
