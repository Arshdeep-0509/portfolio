"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Expand } from "lucide-react";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { ScrollSnapRow } from "@/components/ui/ScrollSnapRow";
import { isUnoptimized } from "@/lib/images";

export type GalleryImage = { src: string; alt: string; caption?: string };

// The lightbox (dialog, navigation, large image) is only downloaded when first opened.
const GalleryLightbox = dynamic(
  () => import("@/components/ui/GalleryLightbox").then((mod) => mod.GalleryLightbox),
  { ssr: false },
);

/** Screens in a scroll-snap row; selecting one opens it in a lightbox (loaded on first open). */
export function Gallery({ images, label }: { images: GalleryImage[]; label: string }) {
  const [index, setIndex] = useState<number | null>(null);
  // Stays mounted after the first open so the native dialog can restore focus on close.
  const [loaded, setLoaded] = useState(false);
  const count = images.length;

  return (
    <>
      <ScrollSnapRow label={label} itemWidth="min(88%, 38rem)">
        {images.map((image, i) => (
          <li key={`${image.src}-${i}`}>
            <figure>
              <button
                type="button"
                onClick={() => {
                  setLoaded(true);
                  setIndex(i);
                }}
                aria-label={`Enlarge screen ${i + 1} of ${count}: ${image.alt}`}
                className="group relative block aspect-[16/10] w-full overflow-hidden rounded-card border border-rule bg-night-900"
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 608px, 88vw"
                  unoptimized={isUnoptimized(image.src)}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <span className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-button bg-night-950/85 text-ivory-50">
                  <Expand aria-hidden="true" strokeWidth={1.5} className="size-4" />
                </span>
              </button>
              {image.caption ? (
                <figcaption className="mt-3 text-small text-fg-muted">
                  <PlaceholderText text={image.caption} />
                </figcaption>
              ) : null}
            </figure>
          </li>
        ))}
      </ScrollSnapRow>

      {loaded ? (
        <GalleryLightbox images={images} label={label} index={index} onIndexChange={setIndex} />
      ) : null}
    </>
  );
}
