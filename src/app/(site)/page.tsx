import { HandoverKit } from "@/components/sections/home/HandoverKit";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { Principles } from "@/components/sections/home/Principles";
import { ProcessStory } from "@/components/sections/home/ProcessStory";
import { Questions } from "@/components/sections/home/Questions";
import { StackSection } from "@/components/sections/home/StackSection";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { WhatIBuild } from "@/components/sections/home/WhatIBuild";
import { homeContent } from "@/content/home";
import { buildMetadata } from "@/lib/seo";

// No title: the root layout's default title is used on the home page.
export const metadata = buildMetadata({ path: "/", description: homeContent.seo.description });

/**
 * Night hero · What I build (ivory) · Principles (sand) · How a project runs (night) ·
 * The handover kit (ivory) · [testimonial, when enabled] · Stack map (sand) · Questions (ivory).
 * The layout's QuickStart closes the page.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <WhatIBuild index={1} />
      <Principles index={2} />
      <ProcessStory index={3} />
      <HandoverKit index={4} />
      <Testimonials />
      <StackSection index={5} />
      <Questions index={6} />
    </>
  );
}
