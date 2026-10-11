import { servicesPage } from "@/content/servicesPage";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Services from Arshdeep Singh, engineer in India";

export default function Image() {
  return renderOgImage({
    eyebrow: "Services",
    title: servicesPage.hero.title,
    subtitle: servicesPage.hero.text,
    path: "/services",
  });
}
