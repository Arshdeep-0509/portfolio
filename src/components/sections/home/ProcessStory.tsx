import { ChipList } from "@/components/ui/Chip";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StickyScrollStory } from "@/components/ui/StickyScrollStory";
import { homeContent } from "@/content/home";
import { processSteps } from "@/content/process";

/**
 * "How a project runs" on night: the six steps as a sticky scroll story. Each panel carries a
 * one-line outcome, what you receive and a typical duration.
 */
export function ProcessStory({ index }: { index: number }) {
  const { process } = homeContent;
  return (
    <Section id={process.id} tone="night-900" aria-labelledby="process-title">
      <StickyScrollStory
        outlineLabel={process.outlineLabel}
        intro={
          <div>
            <SectionHeader
              id="process-title"
              index={index}
              label={process.label}
              title={process.title}
              emphasis={process.emphasis}
            />
            <p className="mt-6 max-w-md text-fg-muted">{process.intro}</p>
          </div>
        }
        steps={processSteps.map((step) => ({
          id: step.id,
          title: step.title,
          content: (
            <>
              <p className="font-display-soft text-xl text-ivory-50 italic">{step.outcome}</p>
              <p className="mt-4 text-fg-muted">{step.text}</p>
              <div className="mt-6 grid gap-5 border-t border-line-dark pt-5 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="label-mono text-mist-300">{process.receiveLabel}</p>
                  <ChipList items={step.receive} className="mt-2.5" />
                </div>
                <div className="sm:text-right">
                  <p className="label-mono text-mist-300">{process.durationLabel}</p>
                  <p className="mt-2.5 font-mono text-sm text-lamp-400">
                    <PlaceholderText text={step.duration} />
                  </p>
                </div>
              </div>
            </>
          ),
        }))}
      />
    </Section>
  );
}
