import { siteConfig } from "@/content/site";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

// Default share image for every page that doesn't define its own.
export const size = ogSize;
export const contentType = ogContentType;
export const alt = `${siteConfig.name} — ${siteConfig.founder.role}`;

export default function Image() {
  return renderOgImage({
    eyebrow: siteConfig.founder.role,
    title: siteConfig.positioning,
  });
}
