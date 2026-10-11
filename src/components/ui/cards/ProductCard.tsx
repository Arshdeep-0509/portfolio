import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { IconTile } from "@/components/ui/IconTile";
import type { IconProp } from "@/components/ui/Icon";
import { cardBase, cardHover, CheckList } from "@/components/ui/cards/Card";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  icon: IconProp;
  title: string;
  text: string;
  statuses?: { label: string; variant: BadgeVariant }[];
  features?: string[];
  cta?: { label: string; href: string };
  /** "wide" spans more columns and adds `bullets` and an italic `note`. */
  variant?: "default" | "wide";
  bullets?: string[];
  note?: string;
  className?: string;
};

export function ProductCard({
  icon,
  title,
  text,
  statuses = [],
  features = [],
  cta,
  variant = "default",
  bullets = [],
  note,
  className,
}: ProductCardProps) {
  const wide = variant === "wide";

  return (
    <div className={cn(cardBase, cardHover, "flex h-full flex-col", className)}>
      <div className="flex items-start justify-between gap-4">
        <IconTile icon={icon} />
        {statuses.length > 0 ? (
          <div className="flex flex-wrap justify-end gap-1.5">
            {statuses.map((status) => (
              <Badge key={status.label} variant={status.variant}>
                {status.label}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <h3 className="mt-5 text-h3 font-bold">{title}</h3>
      <p className="mt-2 text-muted">{text}</p>

      <div className={cn(wide && "lg:grid lg:grid-cols-2 lg:gap-8")}>
        {wide && bullets.length > 0 ? <CheckList items={bullets} className="mt-5" /> : null}
        {features.length > 0 ? (
          <ul className="mt-5 flex flex-wrap content-start gap-2">
            {features.map((feature) => (
              <li key={feature}>
                <Chip variant="soft" check>
                  {feature}
                </Chip>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {wide && note ? <p className="mt-5 text-small text-muted italic">{note}</p> : null}

      {cta ? (
        <div className="mt-auto pt-6">
          <Button href={cta.href} variant="outline">
            {cta.label}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
