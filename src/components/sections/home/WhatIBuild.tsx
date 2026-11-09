import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServicePicker } from "@/components/sections/home/ServicePicker";
import { Bento, BentoTile } from "@/components/ui/Bento";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { homeContent } from "@/content/home";
import {
  getServiceGroup,
  getServicesByGroup,
  services,
  type ServiceGroupId,
} from "@/content/services";
import { cn, pad2 } from "@/lib/utils";

type Tier = "lead" | "wide" | "compact";

/** How much room each group gets. AI & Cloud leads: it's the automation the brand is named for. */
const TIERS: Record<ServiceGroupId, Tier> = {
  "ai-cloud": "lead",
  build: "wide",
  design: "compact",
  grow: "compact",
};

const TILE_TONES = { lead: "raised", wide: "paper", compact: "outline" } as const;

/**
 * "What I build": the four service groups, sized by importance instead of four equal cards. AI &
 * Cloud leads across the full width, Build takes two thirds, Design and Grow one third each, and
 * the three-question picker fills the last gap. Fill, size and spacing carry the hierarchy.
 */
export function WhatIBuild({ index }: { index: number }) {
  const { build } = homeContent;
  const titles = Object.fromEntries(services.map((service) => [service.slug, service.title]));

  return (
    <Section id={build.id} tone="base" aria-labelledby="what-i-build-title">
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
          md: '"ai ai" "build build" "design grow" "picker picker"',
          lg: '"ai ai ai" "build build design" "grow picker picker"',
        }}
        columns={{ md: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" }}
      >
        {build.tiles.map((tile) => {
          const group = getServiceGroup(tile.group);
          if (!group) return null;
          const tier = TIERS[tile.group];
          const lead = tier === "lead";
          const groupServices = getServicesByGroup(tile.group);
          return (
            <BentoTile
              key={tile.group}
              area={tile.area}
              tone={TILE_TONES[tier]}
              className={cn(lead && "lg:grid lg:grid-cols-[1.3fr_1fr] lg:gap-12 lg:p-12")}
            >
              <div className={cn(lead && "flex flex-col")}>
                <p className="label-text text-ink-muted">{group.label}</p>
                <h3 className={cn("mt-3 text-ink", lead ? "text-h2" : "text-h3")}>
                  {group.description}
                </h3>
                {lead ? (
                  <p className="mt-6 label-text text-ink-muted lg:mt-auto lg:pt-6">
                    {pad2(groupServices.length)} services
                  </p>
                ) : null}
              </div>
              <ul
                className={cn(
                  "mt-6 border-t border-border",
                  lead && "lg:mt-0 lg:self-end",
                  tier === "wide" && "sm:grid sm:grid-cols-2 sm:gap-x-8",
                )}
              >
                {groupServices.map((service) => (
                  <li key={service.slug} className="border-b border-border">
                    <Link
                      href={`/services/${service.slug}`}
                      className="group flex min-h-12 items-center justify-between gap-3 text-small font-semibold text-ink transition-colors hover:text-link"
                    >
                      {service.title}
                      <ArrowRight
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="size-4 shrink-0 text-link transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </BentoTile>
          );
        })}
        <BentoTile area="picker">
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
