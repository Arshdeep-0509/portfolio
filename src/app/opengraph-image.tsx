import { homeContent } from "@/content/home";
import { siteConfig } from "@/content/site";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

// Default share image for every page that doesn't define its own.
export const size = ogSize;
export const contentType = ogContentType;
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

export default function Image() {
  return renderOgImage({ title: homeContent.hero.title });
}
