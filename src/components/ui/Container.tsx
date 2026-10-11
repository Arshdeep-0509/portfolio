import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div"> & {
  /** Render a narrower column for long-form text. */
  size?: "default" | "narrow";
};

/** Centred page column: 1200px max with 16px (mobile) / 24px (desktop) gutters. */
export function Container({ size = "default", className, ...props }: ContainerProps) {
  return (
    <div className={cn("container-site", size === "narrow" && "max-w-3xl", className)} {...props} />
  );
}
