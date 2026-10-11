import { GroupBands } from "@/components/sections/services/GroupBands";
import { ServiceList } from "@/components/sections/services/ServiceList";
import { ServiceStart } from "@/components/sections/services/ServiceStart";
import { CompactPageHero } from "@/components/sections/shared/CompactPageHero";
import { Illustration } from "@/components/ui/Illustration";
import { servicesPage } from "@/content/servicesPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: servicesPage.seo.title,
  description: servicesPage.seo.description,
  path: "/services",
  // Uses ./opengraph-image.tsx.
  image: false,
});

// The layout's CTA band closes the page.
export default function ServicesPage() {
  const { hero } = servicesPage;

  return (
    <>
      <CompactPageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Services" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        highlight={hero.highlight}
        subtitle={hero.subtitle}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
        asideClassName="hidden lg:block"
        aside={
          <Illustration
            name={hero.illustration.name}
            width={hero.illustration.width}
            height={hero.illustration.height}
            alt={hero.illustration.alt}
            className="w-full"
          />
        }
      />
      <ServiceList />
      <GroupBands />
      <ServiceStart />
    </>
  );
}
