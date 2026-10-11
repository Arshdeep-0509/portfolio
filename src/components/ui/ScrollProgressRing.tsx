"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 480;
const RADIUS = 17;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Bottom-right: a ring that fills with the lamp colour as you scroll the page; clicking it goes
 * back to the top. The ring is decorative — the button's name is "Back to top", and it is
 * hidden from keyboard and screen readers until it appears.
 */
export function ScrollProgressRing() {
  const ringRef = useRef<SVGCircleElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      ringRef.current?.style.setProperty(
        "stroke-dashoffset",
        String(CIRCUMFERENCE * (1 - progress)),
      );
      setVisible(window.scrollY > SHOW_AFTER_PX);
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
  }, []);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "tone-night group fixed right-4 bottom-20 z-40 inline-flex size-12 items-center justify-center rounded-button border border-line-dark bg-night-950/90 text-ivory-50 backdrop-blur-md sm:right-6 sm:bottom-24",
        "transition-[opacity,transform,border-color] duration-300 hover:border-lamp-500/60 print:hidden",
        visible ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        className="absolute inset-0 m-auto size-10 -rotate-90"
      >
        <circle cx="20" cy="20" r={RADIUS} fill="none" stroke="var(--line-dark)" strokeWidth="2" />
        <circle
          ref={ringRef}
          cx="20"
          cy="20"
          r={RADIUS}
          fill="none"
          stroke="var(--lamp-500)"
          strokeWidth="2"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <ArrowUp
        aria-hidden="true"
        strokeWidth={1.5}
        className="relative size-4 transition-transform duration-200 group-hover:-translate-y-0.5"
      />
    </button>
  );
}
