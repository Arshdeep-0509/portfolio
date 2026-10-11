import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StackMap } from "@/components/ui/StackMap";
import { homeContent } from "@/content/home";
import { stackBands } from "@/content/techStack";

/** "Stack map" on sand: one band per layer, no tabs. */
export function StackSection({ index }: { index: number }) {
  const { stack } = homeContent;
  return (
    <Section id={stack.id} tone="sand" aria-labelledby="stack-title">
      <SectionHeader
        id="stack-title"
        index={index}
        label={stack.label}
        title={stack.title}
        emphasis={stack.emphasis}
        intro={<p>{stack.intro}</p>}
      />
      <StackMap bands={stackBands} className="mt-14" />
    </Section>
  );
}
