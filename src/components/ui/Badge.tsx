import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-pill font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        /** Translucent pill for hero eyebrows on dark/gradient backgrounds. */
        "eyebrow-dark": "border border-white/25 bg-white/10 px-3.5 py-1.5 text-white backdrop-blur",
        soft: "bg-soft px-3 py-1 text-primary",
        outline: "border border-border bg-surface px-3 py-1 text-muted",
        "in-development": "bg-amber-500 px-2.5 py-0.5 text-navy-950",
        new: "bg-amber-500 px-2.5 py-0.5 text-navy-950",
        live: "bg-success-soft px-2.5 py-0.5 text-success-strong",
        limited: "bg-navy-900 px-2.5 py-0.5 text-white",
      },
      size: {
        sm: "text-eyebrow tracking-normal",
        md: "text-small",
      },
    },
    defaultVariants: { variant: "soft", size: "sm" },
  },
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

/** Status badges show a small dot so the state is not conveyed by colour alone. */
const dotVariants: Partial<Record<BadgeVariant, string>> = {
  "in-development": "bg-navy-950",
  live: "bg-success",
  limited: "bg-sky-400",
};

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ variant, size, className, children, ...props }: BadgeProps) {
  const dot = variant ? dotVariants[variant] : undefined;
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot ? <span aria-hidden="true" className={cn("size-1.5 rounded-pill", dot)} /> : null}
      {children}
    </span>
  );
}
