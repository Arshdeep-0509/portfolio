import { ProcessStepCard } from "@/components/ui/cards/ProcessStepCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Timeline } from "@/components/ui/Timeline";
import { homeContent, type SectionCopy } from "@/content/home";
import { processSteps } from "@/content/process";

/** Six-step process on an alternating timeline whose line fills on scroll. Data: process.ts. */
export function Process({ copy = homeContent.process }: { copy?: SectionCopy }) {
  const process = copy;

  return (
    <Section id={process.id} background="section">
      <SectionHeading
        title={process.title}
        highlight={process.highlight}
        subtitle={process.subtitle}
      />
      <Timeline
        variant="milestones"
        className="mx-auto mt-14 max-w-5xl"
        items={processSteps.map((step) => ({
          title: step.title,
          content: <ProcessStepCard step={step.step} title={step.title} text={step.text} />,
        }))}
      />
    </Section>
  );
}
