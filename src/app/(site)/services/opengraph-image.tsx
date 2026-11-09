import { servicesPage } from "@/content/servicesPage";
import { ogAlt, ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = ogAlt(servicesPage.hero.title);

export default function Image() {
  return renderOgImage({ title: servicesPage.hero.title });
}
