import { cva, type VariantProps } from "class-variance-authority";
import { Icon, type IconProp } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const tileVariants = cva("inline-flex shrink-0 items-center justify-center rounded-md", {
  variants: {
    variant: {
      default: "bg-soft text-primary",
      "on-dark": "border border-white/15 bg-white/10 text-tone-accent",
    },
    size: {
      sm: "size-10 [&_svg]:size-5",
      md: "size-12 [&_svg]:size-6",
      lg: "size-14 [&_svg]:size-7",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

type IconTileProps = VariantProps<typeof tileVariants> & {
  icon: IconProp;
  className?: string;
};

/** Square icon tile (48px by default). Decorative: the adjacent title carries the meaning. */
export function IconTile({ icon, variant, size, className }: IconTileProps) {
  return (
    <span className={cn(tileVariants({ variant, size }), className)}>
      <Icon icon={icon} strokeWidth={1.75} />
    </span>
  );
}
