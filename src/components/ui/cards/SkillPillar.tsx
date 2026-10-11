import { Chip } from "@/components/ui/Chip";
import { IconTile } from "@/components/ui/IconTile";
import type { IconProp } from "@/components/ui/Icon";
import { cardBase, cardHover } from "@/components/ui/cards/Card";
import { cn } from "@/lib/utils";

type SkillPillarProps = {
  icon: IconProp;
  title: string;
  text: string;
  /** Sub-skills shown as chips (four reads best). */
  skills: string[];
  className?: string;
};

/** One area of expertise: icon tile, title, one line, and its sub-skills as chips. */
export function SkillPillar({ icon, title, text, skills, className }: SkillPillarProps) {
  return (
    <div className={cn(cardBase, cardHover, "flex h-full flex-col", className)}>
      <IconTile icon={icon} />
      <h3 className="mt-5 text-h3 font-bold">{title}</h3>
      <p className="mt-2 text-muted">{text}</p>
      <ul aria-label={`${title} skills`} className="mt-auto flex flex-wrap gap-2 pt-5">
        {skills.map((skill) => (
          <li key={skill}>
            <Chip variant="soft" className="text-xs">
              {skill}
            </Chip>
          </li>
        ))}
      </ul>
    </div>
  );
}
