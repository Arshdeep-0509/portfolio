import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServicePicker } from "@/components/sections/home/ServicePicker";
import { Bento, BentoTile } from "@/components/ui/Bento";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { homeContent } from "@/content/home";
import { getServiceGroup, getServicesByGroup, services } from "@/content/services";
import { cn, pad2 } from "@/lib/utils";

/**
 * "What I build": a bento of the four service groups — AI & Cloud is the large night tile —
 * each listing its services as text links, plus a fifth tile with the three-question picker.
 */
export function WhatIBuild({ index }: { index: number }) {
  const { build } = homeContent;
  const titles = Object.fromEntries(services.map((service) => [service.slug, service.title]));

  return (
    <Section id={build.id} tone="ivory" aria-labelledby="what-i-build-title">
      <SectionHeader
        id="what-i-build-title"
        index={index}
        label={build.label}
        title={build.title}
        emphasis={build.emphasis}
        intro={<p>{build.intro}</p>}
      />
      <Bento
        className="mt-14"
        areas={{
          base: '"ai" "build" "design" "grow" "picker"',
          md: '"ai ai" "build design" "grow picker"',
          lg: '"build ai ai" "design ai ai" "grow picker picker"',
        }}
        columns={{ md: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" }}
      >
        {build.tiles.map((tile) => {
          const group = getServiceGroup(tile.group);
          const night = tile.group === "ai-cloud";
          if (!group) return null;
          return (
            <BentoTile
              key={tile.group}
              area={tile.area}
              tone={night ? "night" : "paper"}
              className={cn(night && "flex flex-col justify-end lg:min-h-[30rem] lg:p-12")}
            >
              <p className="label-mono text-accent">{group.label}</p>
              <h3 className={cn("mt-3 text-fg", night ? "max-w-md text-h2" : "text-h3")}>
                {group.description}
              </h3>
              <ul className="mt-6 border-t border-rule">
                {getServicesByGroup(tile.group).map((service) => (
                  <li key={service.slug} className="border-b border-rule">
                    <Link
                      href={`/services/${service.slug}`}
                      className="group flex min-h-12 items-center justify-between gap-3 text-small font-semibold text-fg transition-colors hover:text-accent"
                    >
                      {service.title}
                      <ArrowRight
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              {night ? (
                <p className="mt-6 label-mono text-mist-300">
                  {pad2(getServicesByGroup(tile.group).length)} services
                </p>
              ) : null}
            </BentoTile>
          );
        })}
        <BentoTile area="picker" className="tone-sand bg-sand-100">
          <ServicePicker
            questions={build.picker.questions}
            titles={titles}
            copy={{
              title: build.picker.title,
              text: build.picker.text,
              resultsTitle: build.picker.resultsTitle,
              discuss: build.picker.discuss,
              reset: build.picker.reset,
            }}
          />
        </BentoTile>
      </Bento>
    </Section>
  );
}
