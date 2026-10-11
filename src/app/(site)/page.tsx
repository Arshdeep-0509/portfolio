import { Benefits } from "@/components/sections/home/Benefits";
import { Deliverables } from "@/components/sections/home/Deliverables";
import { Faq } from "@/components/sections/home/Faq";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { Overview } from "@/components/sections/home/Overview";
import { Process } from "@/components/sections/home/Process";
import { Products } from "@/components/sections/home/Products";
import { Technology } from "@/components/sections/home/Technology";
import { TechMarquee } from "@/components/sections/home/TechMarquee";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { WhyFounders } from "@/components/sections/home/WhyFounders";
import { homeContent } from "@/content/home";
import { buildMetadata } from "@/lib/seo";

// No title: the root layout's default title is used on the home page.
export const metadata = buildMetadata({ path: "/", description: homeContent.seo.description });

// The layout's CTA band closes the page.
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TechMarquee />
      <Overview />
      <Benefits />
      <WhyFounders />
      <Technology />
      <Process />
      <Deliverables />
      <Products />
      <Testimonials />
      <Faq />
    </>
  );
}
