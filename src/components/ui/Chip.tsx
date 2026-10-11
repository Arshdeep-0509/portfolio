import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const chipVariants = cva("inline-flex items-center gap-1.5 rounded-pill text-small font-medium", {
  variants: {
    variant: {
      default: "border border-border bg-surface px-3 py-1 text-ink",
      soft: "bg-soft px-3 py-1 text-navy-900",
      "on-dark": "border border-white/20 bg-white/10 px-3 py-1 text-white",
    },
  },
  defaultVariants: { variant: "default" },
});

type ChipProps = React.ComponentProps<"span"> &
  VariantProps<typeof chipVariants> & {
    /** Prefix a check mark (e.g. for feature lists). */
    check?: boolean;
  };

export function Chip({ variant, check = false, className, children, ...props }: ChipProps) {
  return (
    <span className={cn(chipVariants({ variant }), className)} {...props}>
      {check ? (
        <Check aria-hidden="true" strokeWidth={2.5} className="size-3.5 text-tone-accent" />
      ) : null}
      {children}
    </span>
  );
}

const techChipVariants = cva("inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-xs", {
  variants: {
    variant: {
      default: "border border-border bg-tint text-navy-900",
      // tone-muted: sky-200 on navy, white on the hero gradient (sky-200 would be 3.7:1 there).
      "on-dark": "border border-white/20 bg-white/10 text-tone-muted",
    },
  },
  defaultVariants: { variant: "default" },
});

type TechChipProps = React.ComponentProps<"span"> & VariantProps<typeof techChipVariants>;

/** Monospace tag for technology names ("Next.js", "PostgreSQL"). */
export function TechChip({ variant, className, ...props }: TechChipProps) {
  return <span className={cn(techChipVariants({ variant }), className)} {...props} />;
}
