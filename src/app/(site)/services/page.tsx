import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqSection } from "@/components/sections/shared/FaqSection";
import { ServiceIndex, type IndexGroup } from "@/components/sections/services/ServiceIndex";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Emphasis } from "@/components/ui/Emphasis";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getService, getServicesByGroup, serviceGroups, services } from "@/content/services";
import { servicesPage } from "@/content/servicesPage";
import { bookingIsExternal } from "@/lib/booking";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: servicesPage.seo.title,
  description: servicesPage.seo.description,
  path: "/services",
  // Uses ./opengraph-image.tsx.
  image: false,
});

/**
 * Ivory hero · service index (table of contents + preview) · Ways to work together (night) ·
 * Popular combinations (sand) · Questions. The layout's QuickStart closes the page.
 */
export default function ServicesPage() {
  const { hero, index, models, bundles, faq } = servicesPage;
  const numberOf = (slug: string) => services.findIndex((service) => service.slug === slug) + 1;
  const groups: IndexGroup[] = serviceGroups.map((group) => ({
    id: group.id,
    label: group.label,
    services: getServicesByGroup(group.id).map((service) => ({
      slug: service.slug,
      number: numberOf(service.slug),
      title: service.title,
      tagline: service.tagline,
      summary: service.summary,
      deliverables: service.deliverables.slice(0, 3),
      timeline: service.typicalTimeline,
    })),
  }));

  return (
    <>
      <Section tone="ivory" padding="none" className="pt-16 pb-16 lg:pt-24 lg:pb-20">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h1 className="max-w-[18ch] text-h1 text-fg lg:col-span-8">
            <Emphasis text={hero.title} emphasis={hero.emphasis} />
          </h1>
          <div className="lg:col-span-4">
            <p className="text-lg text-fg-muted">{hero.text}</p>
            <Button
              href={hero.cta.href}
              size="lg"
              className="mt-6"
              data-cta="services-hero"
              {...(bookingIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {hero.cta.label}
            </Button>
          </div>
        </div>
      </Section>

      <Section
        id={index.id}
        tone="ivory"
        padding="none"
        className="pb-(--section-y) lg:pb-(--section-y-desktop)"
        aria-labelledby="index-title"
      >
        <SectionHeader
          id="index-title"
          index={1}
          label={index.label}
          title={index.title}
          emphasis={index.emphasis}
          intro={<p>{index.intro}</p>}
        />
        <div className="mt-14">
          <ServiceIndex groups={groups} copy={index} />
        </div>
      </Section>

      <Section id={models.id} tone="night" aria-labelledby="models-title">
        <SectionHeader
          id="models-title"
          index={2}
          label={models.label}
          title={models.title}
          emphasis={models.emphasis}
          intro={<p>{models.intro}</p>}
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-line-dark bg-line-dark md:grid-cols-3">
          {models.items.map((model) => (
            <li key={model.name} className="bg-night-950 p-7 lg:p-9">
              <h3 className="text-h3 text-fg">{model.name}</h3>
              <dl className="mt-6 space-y-5 text-small">
                {[
                  [models.includedLabel, model.included],
                  [models.suitsLabel, model.suits],
                  [models.billingLabel, model.billing],
                ].map(([term, detail]) => (
                  <div key={term}>
                    <dt className="label-mono text-accent">{term}</dt>
                    <dd className="mt-1.5 text-fg-muted">{detail}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </Section>

      <Section id={bundles.id} tone="sand" aria-labelledby="bundles-title">
        <SectionHeader
          id="bundles-title"
          index={3}
          label={bundles.label}
          title={bundles.title}
          emphasis={bundles.emphasis}
          intro={<p>{bundles.intro}</p>}
        />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {bundles.items.map((bundle) => (
            <li
              key={bundle.id}
              className="tone-ivory flex flex-col rounded-card border border-rule bg-ivory-50 p-7 transition-[border-color,box-shadow] duration-300 hover:border-lamp-500 hover:shadow-glow"
            >
              <h3 className="text-h3 text-fg">{bundle.name}</h3>
              <p className="mt-3 text-small text-fg-muted">{bundle.text}</p>
              <ul className="mt-5 border-t border-rule">
                {bundle.services.map((slug) => {
                  const service = getService(slug);
                  if (!service) return null;
                  return (
                    <li key={slug} className="border-b border-rule">
                      <Link
                        href={`/services/${slug}`}
                        className="group flex min-h-11 items-center justify-between gap-2 text-small font-semibold text-fg hover:text-accent"
                      >
                        {service.title}
                        <ArrowRight
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="size-4 text-accent transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-auto pt-6">
                <Button
                  href={`/contact?bundle=${bundle.id}`}
                  variant="outline"
                  size="sm"
                  data-cta={`bundle-${bundle.id}`}
                >
                  {bundles.ask}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <FaqSection
        index={4}
        label={faq.label}
        title={faq.title}
        emphasis={faq.emphasis}
        items={faq.items}
      />
    </>
  );
}
