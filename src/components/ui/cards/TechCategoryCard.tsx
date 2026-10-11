import { Badge } from "@/components/ui/Badge";
import { TechChip } from "@/components/ui/Chip";
import { cardBase, cardHover, CheckList } from "@/components/ui/cards/Card";
import { cn } from "@/lib/utils";

type TechCategoryCardProps = {
  title: string;
  subtitle: string;
  /** Short tag shown top-right, e.g. "Web UI". */
  tag?: string;
  /** Up to three short bullet points. */
  points: string[];
  tech: string[];
  className?: string;
};

export function TechCategoryCard({
  title,
  subtitle,
  tag,
  points,
  tech,
  className,
}: TechCategoryCardProps) {
  return (
    <div className={cn(cardBase, cardHover, "flex h-full flex-col", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-h3 font-bold">{title}</h3>
          <p className="mt-1 text-small text-muted">{subtitle}</p>
        </div>
        {tag ? <Badge variant="soft">{tag}</Badge> : null}
      </div>
      <CheckList items={points.slice(0, 3)} className="mt-5" />
      <ul aria-label={`${title} technologies`} className="mt-auto flex flex-wrap gap-2 pt-6">
        {tech.map((name) => (
          <li key={name}>
            <TechChip>{name}</TechChip>
          </li>
        ))}
      </ul>
    </div>
  );
}
