"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SubNavLink = { id: string; label: string };

function cssPx(name: string) {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
}

/**
 * Sticky in-page navigation under the fixed header, with scroll-spy. The parent sets
 * --subnav-h so anchor targets clear both bars (see the [id] rule in globals.css).
 * Scrolls horizontally on small screens and keeps the active link in view.
 */
export function ServiceSubNav({ links, label }: { links: SubNavLink[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // A section is current once its top passes just below the header + sub-nav.
      const line = cssPx("--header-h") + (scrollerRef.current?.offsetHeight ?? 0) + 24;
      let current: string | null = null;
      for (const link of links) {
        const el = document.getElementById(link.id);
        if (el && el.getBoundingClientRect().top <= line) current = link.id;
      }
      // At the very bottom, the last section wins even if it is too short to reach the line.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom && links.length > 0) current = links[links.length - 1]!.id;
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [links]);

  // Keep the active link visible in the horizontal scroller (without moving the page).
  useEffect(() => {
    const scroller = scrollerRef.current;
    const link = active ? scroller?.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
    if (!scroller || !link) return;
    const left = link.offsetLeft - scroller.offsetLeft;
    if (
      left < scroller.scrollLeft ||
      left + link.offsetWidth > scroller.scrollLeft + scroller.clientWidth
    ) {
      scroller.scrollTo({ left: left - 16, behavior: "smooth" });
    }
  }, [active]);

  return (
    <nav
      aria-label={label}
      className="tone-light sticky top-(--header-h) z-30 border-y border-border bg-surface/95 backdrop-blur-md"
    >
      <ul
        ref={scrollerRef}
        className="container-site flex h-(--subnav-h) [scrollbar-width:none] items-center gap-1 overflow-x-auto"
      >
        {links.map((link) => {
          const current = link.id === active;
          return (
            <li key={link.id} className="shrink-0">
              <a
                href={`#${link.id}`}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-pill px-3.5 text-small font-semibold whitespace-nowrap transition-colors duration-200",
                  current ? "bg-soft text-primary" : "text-muted hover:text-ink",
                )}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
