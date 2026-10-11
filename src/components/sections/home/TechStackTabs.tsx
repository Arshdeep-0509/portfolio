"use client";

import { useState } from "react";
import { TechCategoryCard } from "@/components/ui/cards/TechCategoryCard";
import { Tabs } from "@/components/ui/Tabs";
import { getTechByFilter, techFilters, type TechFilter } from "@/content/techStack";

type FilterId = "all" | TechFilter;

/**
 * Filter tabs over one shared grid. Rendering only the selected filter's cards (rather than a
 * hidden copy of the grid per tab) keeps the page's DOM — and its layout cost — small.
 */
export function TechStackTabs() {
  const [filter, setFilter] = useState<FilterId>("all");

  return (
    <Tabs
      className="mt-10"
      align="center"
      label="Filter technologies by area"
      items={techFilters.map((item) => ({ id: item.id, label: item.label }))}
      value={filter}
      onValueChange={(id) => setFilter(id as FilterId)}
    >
      <ul className="grid gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        {getTechByFilter(filter).map((category) => (
          <li key={category.id}>
            <TechCategoryCard
              title={category.title}
              subtitle={category.subtitle}
              tag={category.tag}
              points={category.points}
              tech={category.tech}
            />
          </li>
        ))}
      </ul>
    </Tabs>
  );
}
