import { Badge } from "@/components/ui/Badge";
import { cardBase, cardHover, CheckList } from "@/components/ui/cards/Card";
import { cn } from "@/lib/utils";

type DeliverableCardProps = {
  title: string;
  /** Short tag, e.g. "IP" or "Docs". */
  tag?: string;
  text: string;
  /** Two short check bullets. */
  points: string[];
  className?: string;
};

export function DeliverableCard({ title, tag, text, points, className }: DeliverableCardProps) {
  return (
    <div className={cn(cardBase, cardHover, "h-full", className)}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-h3 font-bold">{title}</h3>
        {tag ? <Badge variant="soft">{tag}</Badge> : null}
      </div>
      <p className="mt-2 text-muted">{text}</p>
      <CheckList items={points.slice(0, 2)} className="mt-4" />
    </div>
  );
}
