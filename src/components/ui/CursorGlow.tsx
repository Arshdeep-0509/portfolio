"use client";

import { useEffect, useRef } from "react";

const QUERY = "(pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * A soft lamp glow that follows the cursor across its parent (a dark hero). Only on desktops
 * with a fine pointer and no reduced-motion preference; otherwise it rests, static, at
 * `rest`. Decorative and click-through. The parent must be `relative` with `overflow-hidden`.
 */
export function CursorGlow({
  rest = { x: "70%", y: "35%" },
  size = 520,
}: {
  rest?: { x: string; y: string };
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = ref.current;
    const area = glow?.parentElement;
    if (!glow || !area || !window.matchMedia(QUERY).matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const onMove = (event: PointerEvent) => {
      const rect = area.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          glow.style.setProperty("--glow-x", `${x}px`);
          glow.style.setProperty("--glow-y", `${y}px`);
        });
      }
    };
    area.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      area.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={
        {
          "--glow-x": rest.x,
          "--glow-y": rest.y,
          background: `radial-gradient(${size}px circle at var(--glow-x) var(--glow-y), rgb(255 193 94 / 0.13), rgb(245 165 36 / 0.05) 40%, transparent 70%)`,
        } as React.CSSProperties
      }
    />
  );
}
