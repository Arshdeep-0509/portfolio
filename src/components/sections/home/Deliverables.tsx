import { DeliverableCard } from "@/components/ui/cards/DeliverableCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { deliverables, type Deliverable } from "@/content/deliverables";
import { homeContent, type SectionCopy } from "@/content/home";

/** Defaults to the home page copy and the shared deliverables; other pages can pass their own. */
export function Deliverables({
  copy = homeContent.deliverables,
  items = deliverables,
}: {
  copy?: SectionCopy;
  items?: Deliverable[];
}) {
  return (
    <Section id={copy.id} background="white">
      <SectionHeading title={copy.title} highlight={copy.highlight} subtitle={copy.subtitle} />
      <RevealGroup as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <RevealItem as="li" key={item.title} index={index}>
            <DeliverableCard
              title={item.title}
              tag={item.tag}
              text={item.text}
              points={item.points}
            />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
