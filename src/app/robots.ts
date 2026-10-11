import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

/** robots.txt: everything is crawlable except utility areas. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dev", "/api", "/pay"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
