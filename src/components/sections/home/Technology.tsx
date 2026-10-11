import { TechStackTabs } from "@/components/sections/home/TechStackTabs";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeContent } from "@/content/home";

/** Tech categories filtered by tabs (All · Web · Mobile · AI & Data · Cloud). Data: techStack.ts. */
export function Technology() {
  const { technology } = homeContent;

  return (
    <Section id={technology.id} background="section">
      <SectionHeading
        title={technology.title}
        highlight={technology.highlight}
        subtitle={technology.subtitle}
      />
      <TechStackTabs />
    </Section>
  );
}
