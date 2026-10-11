import Image from "next/image";
import { cn } from "@/lib/utils";

type IllustrationProps = {
  /** File name inside /public/images, e.g. "hero-illustration.svg". */
  name: string;
  width: number;
  height: number;
  /** Leave empty ("") for purely decorative art. */
  alt: string;
  /** Preload above-the-fold art. */
  preload?: boolean;
  className?: string;
};

/**
 * SVG from /public/images with fixed intrinsic dimensions, so the space is reserved before it
 * loads (no layout shift). SVGs skip the image optimiser, which only handles raster formats.
 */
export function Illustration({
  name,
  width,
  height,
  alt,
  preload = false,
  className,
}: IllustrationProps) {
  return (
    <Image
      src={`/images/${name}`}
      width={width}
      height={height}
      alt={alt}
      unoptimized
      preload={preload}
      className={cn("h-auto max-w-full select-none", className)}
    />
  );
}
