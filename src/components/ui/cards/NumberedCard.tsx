import { IconTile } from "@/components/ui/IconTile";
import type { IconProp } from "@/components/ui/Icon";
import { NumberLabel } from "@/components/ui/NumberLabel";
import { cardBase, cardHover } from "@/components/ui/cards/Card";
import { cn } from "@/lib/utils";

type NumberedCardProps = {
  number: number | string;
  label: string;
  icon: IconProp;
  title: string;
  text: string;
  className?: string;
};

export function NumberedCard({ number, label, icon, title, text, className }: NumberedCardProps) {
  return (
    <div className={cn(cardBase, cardHover, "h-full", className)}>
      <NumberLabel number={number} label={label} />
      <div className="mt-4 flex items-center gap-4">
        <IconTile icon={icon} size="sm" />
        <h3 className="text-h3 font-bold">{title}</h3>
      </div>
      <p className="mt-3 text-muted">{text}</p>
    </div>
  );
}
