"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 600;

/** Navy circle, bottom-right. Appears after 600px of scroll. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      // Hidden from keyboard and screen readers until it is visible.
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "tone-dark fixed right-4 bottom-4 z-40 inline-flex size-12 items-center justify-center rounded-pill bg-navy-900 text-white shadow-card-hover sm:right-6 sm:bottom-6",
        "transition-[opacity,transform,background-color] duration-200 ease-out hover:bg-primary",
        visible ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <ArrowUp aria-hidden="true" className="size-5" />
    </button>
  );
}
