import { cva, type VariantProps } from "class-variance-authority";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const sectionVariants = cva("relative", {
  variants: {
    tone: {
      /** Deepest sky, with the star field. Heroes and closing sections. */
      night: "tone-night bg-night-950 bg-stars text-fg",
      /** Dark sections between paper ones. */
      "night-900": "tone-night bg-night-900 bg-stars text-fg",
      /** Warm paper with a faint grain: the main light surface. */
      ivory: "tone-ivory grain bg-ivory-50 text-fg",
      /** Alternate light surface. */
      sand: "tone-sand bg-sand-100 text-fg",
    },
    padding: {
      none: "",
      tight: "py-14 lg:py-20",
      default: "section-y",
    },
  },
  defaultVariants: { tone: "ivory", padding: "default" },
});

export type SectionTone = NonNullable<VariantProps<typeof sectionVariants>["tone"]>;

type SectionProps = Omit<React.ComponentProps<"section">, "id"> &
  VariantProps<typeof sectionVariants> & {
    id?: string;
    /** Wrap children in a <Container>. Default true. */
    contained?: boolean;
    /**
     * First section of a page that should sit under a transparent header (night heroes).
     * The section must add the header height to its own top padding.
     */
    underHeader?: boolean;
  };

/**
 * Page section. Sections alternate night and paper down every page; the tone class switches text,
 * hairline, accent and focus colours inside so components never pick colours themselves.
 */
export function Section({
  id,
  tone,
  padding,
  contained = true,
  underHeader = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      data-under-header={underHeader ? "" : undefined}
      className={cn(sectionVariants({ tone, padding }), className)}
      {...props}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
