import { SplitHero } from "@/components/sections/shared/SplitHero";
import { homeContent } from "@/content/home";

export function HomeHero() {
  return <SplitHero {...homeContent.hero} />;
}
