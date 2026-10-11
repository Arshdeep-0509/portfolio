import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  /** Part of `title` to colour: --primary on light, --sky-400 on dark, --sky-200 on the hero gradient. */
  highlight?: string;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  /** id for the heading element, e.g. for aria-labelledby on the section. */
  id?: string;
  /** Use "h1" for page heroes. */
  as?: "h1" | "h2" | "h3";
  /** Show the 56×3px accent bar. Default true. */
  bar?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "center",
  id,
  as: Tag = "h2",
  bar = true,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="mb-3 text-eyebrow font-semibold text-tone-accent-text uppercase">{eyebrow}</p>
      ) : null}
      <Tag
        id={id}
        className={cn(
          "font-extrabold tracking-tight text-tone-fg",
          Tag === "h1" ? "text-h1" : Tag === "h2" ? "text-h2" : "text-h3 font-bold",
        )}
      >
        <HighlightedTitle title={title} highlight={highlight} />
      </Tag>
      {bar ? (
        <span
          aria-hidden="true"
          className={cn(
            "mt-5 block h-[3px] w-14 rounded-pill bg-tone-accent",
            centered && "mx-auto",
          )}
        />
      ) : null}
      {subtitle ? <p className="mt-5 text-body text-tone-muted">{subtitle}</p> : null}
    </div>
  );
}

function HighlightedTitle({ title, highlight }: { title: string; highlight?: string }) {
  const index = highlight ? title.indexOf(highlight) : -1;
  if (!highlight || index === -1) return <>{title}</>;

  return (
    <>
      {title.slice(0, index)}
      <span className="text-tone-highlight">{highlight}</span>
      {title.slice(index + highlight.length)}
    </>
  );
}
