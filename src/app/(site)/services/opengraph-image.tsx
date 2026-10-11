import { servicesPage } from "@/content/servicesPage";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Services from Arshdeep Singh";

export default function Image() {
  return renderOgImage({
    eyebrow: servicesPage.hero.eyebrow,
    title: servicesPage.hero.title,
    subtitle: servicesPage.hero.subtitle,
    path: "/services",
  });
}
