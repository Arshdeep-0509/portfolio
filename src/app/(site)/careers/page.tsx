import { Faq } from "@/components/sections/home/Faq";
import {
  CareersApply,
  CareersBenefits,
  CareersCulture,
  CareersHiring,
  CareersOpenings,
  CareersRoleTypes,
  CareersTech,
  CareersWhyJoin,
  JobPostingsJsonLd,
} from "@/components/sections/careers/CareersSections";
import { CompactPageHero } from "@/components/sections/shared/CompactPageHero";
import { careersContent } from "@/content/careers";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: careersContent.seo.title,
  description: careersContent.seo.description,
  path: "/careers",
});

// The CTA band override ("Don't see your role?…") is set in ctaBandOverrides.ts.
export default function CareersPage() {
  const { hero } = careersContent;

  return (
    <>
      <CompactPageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Careers" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        highlight={hero.highlight}
        subtitle={hero.subtitle}
        primaryCta={{ label: "Apply now", href: "#apply" }}
        secondaryCta={{ label: "See open positions", href: "#openings" }}
      />
      <CareersOpenings />
      <CareersCulture />
      <CareersBenefits />
      <CareersWhyJoin />
      <CareersTech />
      <CareersHiring />
      <CareersRoleTypes />
      <CareersApply />
      <Faq copy={careersContent.faq} items={careersContent.faq.items} />
      <JobPostingsJsonLd />
    </>
  );
}
