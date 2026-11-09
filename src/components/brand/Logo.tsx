import Link from "next/link";
import {
  MARK_BODY_SOLID,
  MARK_STAR,
  MARK_TIGHT_RATIO,
  MARK_TIGHT_VIEW_BOX,
  MARK_TRANSFORM,
} from "@/components/brand/mark";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * The mark, inline so it follows the theme: the "P" takes currentColor and the star is always
 * --accent. Decorative: the caller supplies the accessible name.
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox={MARK_TIGHT_VIEW_BOX}
      width={Math.round(size * MARK_TIGHT_RATIO)}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <g transform={MARK_TRANSFORM}>
        <path d={MARK_BODY_SOLID} fill="currentColor" />
        <path className="logo-star" d={MARK_STAR} fill="var(--accent)" />
      </g>
    </svg>
  );
}

type LogoProps = {
  /** "full" adds the wordmark to the mark. */
  variant?: "full" | "mark";
  /** Height of the mark in pixels; the wordmark scales with it. */
  size?: number;
  /** Show the tagline under the logo. It sits outside the link. */
  showTagline?: boolean;
  /** For hiding the wordmark at some widths. The link keeps its name either way. */
  wordmarkClassName?: string;
  onClick?: () => void;
  className?: string;
};

/** Home link: the mark plus "Polestride" as real text in Sora 600. */
export function Logo({
  variant = "full",
  size = 32,
  showTagline = false,
  wordmarkClassName,
  onClick,
  className,
}: LogoProps) {
  const link = (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${siteConfig.name} home`}
      className={cn(
        "inline-flex min-h-11 min-w-11 shrink-0 items-center gap-2.5 rounded-button text-ink",
        !showTagline && className,
      )}
    >
      <LogoMark size={size} />
      {variant === "full" ? (
        <span
          className={cn("font-display leading-none font-semibold", wordmarkClassName)}
          style={{ fontSize: Math.round(size * 0.68), letterSpacing: "-0.02em" }}
        >
          {siteConfig.name}
        </span>
      ) : null}
    </Link>
  );

  if (!showTagline) return link;
  return (
    <div className={className}>
      {link}
      <p className="mt-3 text-lg text-balance text-ink-muted">{siteConfig.tagline}</p>
    </div>
  );
}
