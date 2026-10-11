import { IconTile } from "@/components/ui/IconTile";
import type { IconProp } from "@/components/ui/Icon";
import { cardBase, cardHover } from "@/components/ui/cards/Card";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  icon: IconProp;
  title: string;
  text: string;
  /** Heading level for the title. Default "h3". */
  as?: "h3" | "h4";
  className?: string;
};

export function FeatureCard({ icon, title, text, as: Tag = "h3", className }: FeatureCardProps) {
  return (
    <div className={cn(cardBase, cardHover, "h-full", className)}>
      <IconTile icon={icon} />
      <Tag className="mt-5 text-h3 font-bold">{title}</Tag>
      <p className="mt-2 text-muted">{text}</p>
    </div>
  );
}
