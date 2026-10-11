import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceHero } from "@/components/sections/service/ServiceHero";
import {
  getServiceSections,
  RelatedServices,
  ServiceCaseStudy,
  ServiceBenefits,
  ServiceDeliverables,
  ServiceFaq,
  ServiceOverview,
  ServiceProcess,
  ServiceTech,
  ServiceUseCases,
  ServiceWhyMe,
} from "@/components/sections/service/ServiceSections";
import { ServiceSubNav } from "@/components/sections/service/ServiceSubNav";
import { TrackOnMount } from "@/components/layout/ClickTracking";
import { JsonLd } from "@/components/seo/JsonLd";
import { getService, services, type ServiceEntry } from "@/content/services";
import { serviceDetailCopy } from "@/content/servicesPage";
import { buildMetadata } from "@/lib/seo";
import { schemaIds } from "@/lib/structuredData";
import { absoluteUrl } from "@/lib/utils";

// Await params at the top so unknown slugs return a real HTTP 404. Every valid slug is prerendered,
// so opting out of instant-navigation validation costs nothing here.
export const instant = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  // The OG image comes from ./opengraph-image.tsx, rendered per service at build time.
  return buildMetadata({
    title: service.seo?.title ?? service.title,
    description: service.seo?.description ?? service.summary ?? service.tagline,
    path: `/services/${service.slug}`,
    image: false,
  });
}

const sectionComponents = {
  overview: ServiceOverview,
  useCases: ServiceUseCases,
  benefits: ServiceBenefits,
  whyMe: ServiceWhyMe,
  tech: ServiceTech,
  process: ServiceProcess,
  deliverables: ServiceDeliverables,
  faq: ServiceFaq,
} as const;

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const sections = getServiceSections(service);
  const links = sections.map((key) => ({
    id: serviceDetailCopy.sections[key].id,
    label: serviceDetailCopy.sections[key].nav,
  }));
  // Alternate backgrounds across the sections that actually render.
  const background = (index: number): "white" | "tint" => (index % 2 === 0 ? "white" : "tint");

  return (
    <>
      <ServiceHero service={service} hasProcess={sections.includes("process")} />

      {sections.length > 0 ? (
        // --subnav-h lets anchor targets clear the sticky sub-nav as well as the header.
        <div className="[--subnav-h:56px]">
          <ServiceSubNav links={links} label={serviceDetailCopy.subNavLabel} />
          {sections.map((key, index) => {
            const Component = sectionComponents[key];
            return <Component key={key} service={service} background={background(index)} />;
          })}
        </div>
      ) : null}

      <ServiceCaseStudy service={service} background={background(sections.length)} />
      <RelatedServices service={service} background={background(sections.length + 1)} />
      <ServiceJsonLd service={service} />
      <TrackOnMount name="service_view" params={{ slug: service.slug }} />
    </>
  );
}

function ServiceJsonLd({ service }: { service: ServiceEntry }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        serviceType: service.title,
        description: service.summary ?? service.tagline,
        url: absoluteUrl(`/services/${service.slug}`),
        provider: { "@id": schemaIds.business },
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "Place", name: "Worldwide" },
        ],
      }}
    />
  );
}
