import { useId } from "react";
import Link from "next/link";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";

/** "light"/"dark" name the background; "auto" follows the surrounding tone (--fg). */
type Tone = "light" | "dark" | "auto";

/**
 * The Skylamp mark: a geometric "A" of two strokes meeting at a peak, with the lamp — a small
 * saffron circle in a soft radial glow — floating above the apex. The glow breathes on a slow
 * 6-second loop (globals.css stops it under reduced motion). Decorative: the caller supplies
 * the accessible name.
 *
 * tone="light" is for light backgrounds (ink strokes); tone="dark" for night (ivory strokes).
 */
export function LogoMark({
  tone = "light",
  className,
  animated = true,
}: {
  tone?: Tone;
  className?: string;
  animated?: boolean;
}) {
  const glowId = useId();
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0 overflow-visible", className)}
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="var(--lamp-400)" stopOpacity="0.9" />
          <stop offset="45%" stopColor="var(--lamp-500)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--lamp-500)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle
        cx="20"
        cy="6.5"
        r="7.5"
        fill={`url(#${glowId})`}
        className={animated ? "animate-lamp-breathe" : undefined}
      />
      <circle cx="20" cy="6.5" r="2.6" fill="var(--lamp-500)" />
      <path
        d="M7.5 35 20 13.5 32.5 35"
        fill="none"
        stroke={
          tone === "dark" ? "var(--ivory-50)" : tone === "auto" ? "var(--fg)" : "var(--ink-900)"
        }
        strokeWidth="3"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      />
    </svg>
  );
}

type LogoProps = {
  /** "mark" shows only the symbol; "full" adds the wordmark (and optionally the sub-line). */
  variant?: "mark" | "full";
  /** The background it sits on. */
  tone?: Tone;
  /** Show "ENGINEER · BUILDER · AI & CLOUD" under the wordmark. */
  subline?: boolean;
  onClick?: () => void;
  className?: string;
};

/** Home link: the mark plus "Arshdeep Singh" in Fraunces 600. The accessible name is the brand name. */
export function Logo({
  variant = "full",
  tone = "light",
  subline = true,
  onClick,
  className,
}: LogoProps) {
  const dark = tone === "dark";
  const auto = tone === "auto";
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-button", className)}
    >
      <LogoMark tone={tone} className="size-9" />
      {variant === "full" ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display-soft text-[1.1875rem] font-semibold tracking-[-0.01em]",
              auto ? "text-fg" : dark ? "text-ivory-50" : "text-ink-900",
            )}
          >
            {siteConfig.brand.wordmark}
          </span>
          {subline ? (
            <span
              aria-hidden="true"
              className={cn(
                "mt-1.5 font-mono text-[10px] font-medium tracking-[0.12em] uppercase max-[419px]:hidden",
                auto ? "text-fg-muted" : dark ? "text-mist-300" : "text-ink-600",
              )}
            >
              {siteConfig.brand.microTagline}
            </span>
          ) : null}
        </span>
      ) : (
        <span className="sr-only">{siteConfig.brand.wordmark}</span>
      )}
    </Link>
  );
}
