"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs } from "@/components/ui/Tabs";

type NavigatorCard = { slug: string; group: string; node: React.ReactNode };

type ServiceNavigatorProps = {
  /** Cards rendered on the server (they include server-resolved icons). */
  cards: NavigatorCard[];
  filters: { id: string; label: string }[];
};

const ALL = "all";

/**
 * Filter tabs over the service cards. The active filter is mirrored in the URL hash (#build,
 * #design…) so filtered views can be shared; visiting /services#design opens that filter and
 * scrolls here. No element uses those ids, so the browser's own anchor jump never fights this.
 */
export function ServiceNavigator({ cards, filters }: ServiceNavigatorProps) {
  const [filter, setFilter] = useState(ALL);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const groupIds = filters.map((f) => f.id).filter((id) => id !== ALL);
    const applyHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!groupIds.includes(hash)) return;
      setFilter(hash);
      rootRef.current?.closest("section")?.scrollIntoView({ block: "start" });
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [filters]);

  function change(id: string) {
    setFilter(id);
    const { pathname, search } = window.location;
    // replaceState: sharing the URL keeps the filter, but filters don't pile up in history.
    window.history.replaceState(null, "", id === ALL ? `${pathname}${search}` : `#${id}`);
  }

  const visible = filter === ALL ? cards : cards.filter((card) => card.group === filter);

  return (
    <div ref={rootRef}>
      <Tabs
        className="mt-10"
        align="center"
        label="Filter services by group"
        items={filters}
        value={filter}
        onValueChange={change}
      >
        <ul className="grid gap-5 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((card) => (
            <li key={card.slug}>{card.node}</li>
          ))}
        </ul>
      </Tabs>
    </div>
  );
}
