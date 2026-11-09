import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";
import { brandColors } from "@/lib/brandColors";
import { LOCALE } from "@/lib/constants";

/** Web app manifest (/manifest.webmanifest): name, colours and the icon set in /public/icons. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: brandColors.dark.bg,
    theme_color: brandColors.dark.bg,
    lang: LOCALE,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
