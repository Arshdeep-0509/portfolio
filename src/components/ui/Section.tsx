import { cva, type VariantProps } from "class-variance-authority";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const sectionVariants = cva("relative", {
  variants: {
    background: {
      white: "bg-surface",
      tint: "bg-tint",
      section: "bg-grad-section",
      gradient: "tone-gradient bg-grad-hero text-white",
      dark: "tone-dark bg-navy-950 text-white",
    },
    padding: {
      none: "",
      sm: "py-12 lg:py-16",
      md: "section-y",
      lg: "py-20 lg:py-32",
    },
  },
  defaultVariants: { background: "white", padding: "md" },
});

type SectionProps = Omit<React.ComponentProps<"section">, "id"> &
  VariantProps<typeof sectionVariants> & {
    id?: string;
    /** Wrap children in a <Container>. Default true. */
    contained?: boolean;
  };

/**
 * Page section. "dark" and "gradient" backgrounds switch the tone, so SectionHeading,
 * NumberLabel and focus rings inside pick readable colours automatically.
 */
export function Section({
  id,
  background,
  padding,
  contained = true,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section id={id} className={cn(sectionVariants({ background, padding }), className)} {...props}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
