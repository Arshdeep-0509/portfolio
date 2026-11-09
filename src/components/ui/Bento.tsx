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
        "grid gap-5",
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
  /** Hierarchy comes from the fill: raised for the lead tile, paper, then a bare outline. */
  tone?: "raised" | "paper" | "outline";
  className?: string;
  children: React.ReactNode;
  as?: "div" | "li";
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

const tileTones = {
  raised: "bg-surface-raised",
  paper: "bg-surface",
  outline: "bg-transparent",
};

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
        "relative min-w-0 rounded-card border border-border p-6 text-ink sm:p-8",
        tileTones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
