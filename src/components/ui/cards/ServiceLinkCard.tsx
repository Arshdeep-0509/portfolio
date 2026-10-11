import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IconTile } from "@/components/ui/IconTile";
import type { IconProp } from "@/components/ui/Icon";
import { cardBase, cardHover } from "@/components/ui/cards/Card";
import { cn } from "@/lib/utils";

type ServiceLinkCardProps = {
  href: string;
  icon: IconProp;
  title: string;
  tagline: string;
  /** Heading level for the title. Default "h3". */
  as?: "h3" | "h4";
  className?: string;
};

/**
 * Compact card that is one link: icon tile, title, one-line tagline and an arrow that slides on
 * hover. The whole card is clickable; the accessible name is just the title.
 */
export function ServiceLinkCard({
  href,
  icon,
  title,
  tagline,
  as: Tag = "h3",
  className,
}: ServiceLinkCardProps) {
  return (
    <Link
      href={href}
      className={cn(cardBase, cardHover, "group flex h-full flex-col p-6", className)}
    >
      <IconTile icon={icon} />
      <Tag className="mt-4 text-body font-bold text-ink">{title}</Tag>
      <p className="mt-1.5 flex-1 text-small text-muted">{tagline}</p>
      <ArrowRight
        aria-hidden="true"
        className="mt-4 size-5 text-primary transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
      />
    </Link>
  );
}
