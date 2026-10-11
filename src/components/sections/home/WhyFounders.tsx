import { NumberedCard } from "@/components/ui/cards/NumberedCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeContent } from "@/content/home";

export function WhyFounders() {
  const { why } = homeContent;

  return (
    <Section id={why.id} background="tint">
      <SectionHeading title={why.title} highlight={why.highlight} subtitle={why.subtitle} />
      <RevealGroup as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {why.items.map((item, index) => (
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
