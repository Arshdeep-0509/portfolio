import fs from "node:fs";
import path from "node:path";
import {
  AboutBenefits,
  AboutJourney,
  AboutPillars,
  AboutStory,
  AboutValues,
  FounderHero,
  MissionVision,
  WorkTogether,
} from "@/components/sections/about/AboutSections";
import { Faq } from "@/components/sections/home/Faq";
import { Products } from "@/components/sections/home/Products";
import { aboutContent } from "@/content/about";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: aboutContent.seo.title,
  description: aboutContent.seo.description,
  path: "/about",
});

/** "Download CV" only appears once the file exists in /public (checked at build time). */
function cvExists() {
  return fs.existsSync(path.join(process.cwd(), "public", aboutContent.hero.cv.href));
}

export default function AboutPage() {
  return (
    <>
      <FounderHero hasCv={cvExists()} />
      <AboutStory />
      <MissionVision />
      <AboutValues />
      <AboutJourney />
      <AboutPillars />
      <Products copy={aboutContent.products} />
      <WorkTogether />
      <AboutBenefits />
      <Faq copy={aboutContent.faq} items={aboutContent.faq.items} />
    </>
  );
}
