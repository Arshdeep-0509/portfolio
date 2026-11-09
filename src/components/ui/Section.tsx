import { cva, type VariantProps } from "class-variance-authority";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const sectionVariants = cva("relative", {
  variants: {
    tone: {
      /** The page colour with the star field. Heroes and closing sections. */
      sky: "bg-bg bg-stars text-ink",
      /** The same sky between hairlines, for when the section above shares its colour. */
      "sky-ruled": "border-y border-border bg-bg bg-stars text-ink",
      /** The plain page colour. */
      base: "bg-bg text-ink",
      /** One step up from the page, so sections alternate. */
      surface: "bg-surface text-ink",
    },
    padding: {
      none: "",
      tight: "py-14 lg:py-20",
      default: "section-y",
    },
  },
  defaultVariants: { tone: "base", padding: "default" },
});

export type SectionTone = NonNullable<VariantProps<typeof sectionVariants>["tone"]>;

type SectionProps = Omit<React.ComponentProps<"section">, "id"> &
  VariantProps<typeof sectionVariants> & {
    id?: string;
    /** Wrap children in a <Container>. Default true. */
    contained?: boolean;
    /**
     * First section of a page that should sit under a transparent header (heroes).
     * The section must add the header height to its own top padding.
     */
    underHeader?: boolean;
  };

/**
 * Page section. Sections alternate the page and surface colours down every page. Colours come from
 * the theme tokens, so they follow the light or dark theme by themselves.
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
