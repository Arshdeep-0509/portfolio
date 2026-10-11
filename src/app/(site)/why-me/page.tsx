import { Deliverables } from "@/components/sections/home/Deliverables";
import { Faq } from "@/components/sections/home/Faq";
import { Process } from "@/components/sections/home/Process";
import { CompactPageHero } from "@/components/sections/shared/CompactPageHero";
import {
  WhyBenefits,
  WhyComparison,
  WhyDifferent,
  WhyDifferentiators,
  WhyFit,
  WhyIntro,
  WhyTechnology,
} from "@/components/sections/why-me/WhyMeSections";
import { deliverables } from "@/content/deliverables";
import { whyMeContent } from "@/content/whyMe";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: whyMeContent.seo.title,
  description: whyMeContent.seo.description,
  path: "/why-me",
});

// The CTA band override ("Let's see if we're a good fit…") is set in ctaBandOverrides.ts.
export default function WhyMePage() {
  const { hero } = whyMeContent;

  return (
    <>
      <CompactPageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Why Me" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        highlight={hero.highlight}
        subtitle={hero.subtitle}
      />
      <WhyIntro />
      <WhyDifferent />
      <WhyBenefits />
      <WhyComparison />
      <WhyDifferentiators />
      <WhyFit />
      <WhyTechnology />
      <Process copy={whyMeContent.process} />
      <Deliverables
        copy={whyMeContent.deliverables}
        items={[...deliverables, ...whyMeContent.deliverables.extra]}
      />
      <Faq copy={whyMeContent.faq} items={whyMeContent.faq.items} />
    </>
  );
}
