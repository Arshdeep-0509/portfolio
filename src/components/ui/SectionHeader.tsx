import { Emphasis } from "@/components/ui/Emphasis";
import { cn, pad2 } from "@/lib/utils";

type SectionHeaderProps = {
  /** Position of the section on its page, shown as "(03)". Omit for no number. */
  index?: number;
  /** The section's name, shown in the mono label: "(03) How a project runs". */
  label: string;
  /** The big serif title. */
  title: string;
  /** Part of `title` set in Fraunces italic with the flame underline. */
  emphasis?: string;
  /** Optional intro, placed in a narrower right-hand column on desktop. */
  intro?: React.ReactNode;
  /** Use "h1" for page openings. */
  as?: "h1" | "h2";
  /** id for the title, e.g. for aria-labelledby on the section. */
  id?: string;
  /** Extra content under the intro (a text link, a button). */
  children?: React.ReactNode;
  className?: string;
};

/**
 * Left-aligned section opening: a mono index label with a hairline running to the right edge,
 * then a large Fraunces title and — on desktop — the intro in its own narrower column.
 * The title is wiped in line by line as it scrolls into view (instant under reduced motion).
 */
export function SectionHeader({
  index,
  label,
  title,
  emphasis,
  intro,
  as: Tag = "h2",
  id,
  children,
  className,
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <p className="flex items-center gap-4 label-mono text-accent">
        <span className="shrink-0">
          {index !== undefined ? `(${pad2(index)}) ` : ""}
          {label}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-rule" />
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
        <Tag
          id={id}
          data-reveal={Tag === "h2" ? "mask" : undefined}
          className={cn(
            "max-w-[22ch] text-fg lg:col-span-7",
            Tag === "h1" ? "text-h1" : "text-h2",
            !intro && !children && "lg:col-span-10",
          )}
        >
          <Emphasis text={title} emphasis={emphasis} />
        </Tag>
        {intro || children ? (
          <div className="text-fg-muted lg:col-span-4 lg:col-start-9">
            {intro ? <div className="space-y-4">{intro}</div> : null}
            {children ? <div className={cn(intro && "mt-5")}>{children}</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
