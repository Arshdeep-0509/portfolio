import { cn } from "@/lib/utils";

type Areas = {
  /** grid-template-areas below 768px, e.g. `"a" "b" "c"`. */
  base: string;
  /** From 768px. */
  md?: string;
  /** From 1024px. */
  lg?: string;
};

type BentoProps = {
  areas: Areas;
  /** grid-template-columns from 768px / 1024px, e.g. "repeat(6, minmax(0, 1fr))". */
  columns?: { md?: string; lg?: string };
  className?: string;
  children: React.ReactNode;
  as?: "div" | "ul";
};

/**
 * A CSS grid with named areas, so tiles can take different sizes per breakpoint. Areas are
 * passed as CSS variables (Tailwind can't generate arbitrary area strings at build time);
 * each <BentoTile area="…"> places itself.
 */
export function Bento({ areas, columns, className, children, as: Tag = "div" }: BentoProps) {
  const style = {
    "--bento-areas": areas.base,
    "--bento-areas-md": areas.md ?? areas.base,
    "--bento-areas-lg": areas.lg ?? areas.md ?? areas.base,
    "--bento-cols-md": columns?.md ?? "repeat(2, minmax(0, 1fr))",
    "--bento-cols-lg": columns?.lg ?? columns?.md ?? "repeat(2, minmax(0, 1fr))",
  } as React.CSSProperties;

  return (
    <Tag
      style={style}
      className={cn(
        "grid gap-px overflow-hidden rounded-card border border-rule bg-rule",
        "[grid-template-areas:var(--bento-areas)]",
        "md:[grid-template-columns:var(--bento-cols-md)] md:[grid-template-areas:var(--bento-areas-md)]",
        "lg:[grid-template-columns:var(--bento-cols-lg)] lg:[grid-template-areas:var(--bento-areas-lg)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

type BentoTileProps = {
  area: string;
  /** Tiles default to the section's paper; "night" makes a dark tile with a lamp glow. */
  tone?: "paper" | "night";
  className?: string;
  children: React.ReactNode;
  as?: "div" | "li";
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

export function BentoTile({
  area,
  tone = "paper",
  className,
  children,
  as: Tag = "div",
  style,
  ...props
}: BentoTileProps) {
  return (
    <Tag
      style={{ gridArea: area, ...style }}
      className={cn(
        "relative min-w-0 p-6 sm:p-8",
        tone === "night"
          ? "tone-night isolate overflow-hidden bg-night-900 bg-stars text-fg"
          : "bg-ivory-50 text-fg",
        className,
      )}
      {...props}
    >
      {tone === "night" ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -bottom-32 -z-10 size-96 rounded-dot bg-[radial-gradient(circle,rgb(245_165_36/0.32),rgb(46_42_79/0.35)_45%,transparent_70%)]"
        />
      ) : null}
      {children}
    </Tag>
  );
}
