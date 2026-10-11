"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Expand } from "lucide-react";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { isUnoptimized } from "@/lib/images";

export type GalleryImage = { src: string; alt: string; caption?: string };

// The lightbox (dialog, navigation, large image) is only downloaded when first opened.
const GalleryLightbox = dynamic(
  () => import("@/components/ui/GalleryLightbox").then((mod) => mod.GalleryLightbox),
  { ssr: false },
);

/**
 * Thumbnail grid that opens a lightbox (GalleryLightbox, loaded on first open).
 */
export function Gallery({ images, label }: { images: GalleryImage[]; label: string }) {
  const [index, setIndex] = useState<number | null>(null);
  // Stays mounted after the first open so the native dialog can restore focus on close.
  const [loaded, setLoaded] = useState(false);
  const count = images.length;

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, i) => (
          <li key={`${image.src}-${i}`}>
            <figure>
              <button
                type="button"
                onClick={() => {
                  setLoaded(true);
                  setIndex(i);
                }}
                aria-label={`Open screen ${i + 1} of ${count}: ${image.alt}`}
                className="group relative block aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-soft shadow-card"
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                  unoptimized={isUnoptimized(image.src)}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                />
                <span className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-pill bg-navy-900/85 text-white">
                  <Expand aria-hidden="true" className="size-4" />
                </span>
              </button>
              {image.caption ? (
                <figcaption className="mt-2 text-small text-muted">
                  <PlaceholderText text={image.caption} />
                </figcaption>
              ) : null}
            </figure>
          </li>
        ))}
      </ul>

      {loaded ? (
        <GalleryLightbox images={images} label={label} index={index} onIndexChange={setIndex} />
      ) : null}
    </>
  );
}
