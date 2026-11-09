import type { Metadata } from "next";
import { siteConfig } from "@/content/site";
import { LOCALE, OG_LOCALE } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

/** Rendered by src/app/opengraph-image.tsx and twitter-image.tsx. */
const DEFAULT_OG_IMAGE = "/opengraph-image";
const DEFAULT_TWITTER_IMAGE = "/twitter-image";
const DEFAULT_IMAGE_ALT = `${siteConfig.name} — ${siteConfig.tagline}`;

type BuildMetadataInput = {
  /** Page title without the site name; the root layout template appends it. */
  title?: string;
  description?: string;
  /** Site-relative path, e.g. "/services/mvp-development". Used for the canonical URL. */
  path?: string;
  /**
   * Share image: a site-relative or absolute URL (1200×630). Omit it to use the site default.
   * Pass `false` when the route has its own opengraph-image.tsx — a config image would override it.
   */
  image?: string | false;
  /** Hide utility pages such as /pay and /dev/ui from search engines. */
  noIndex?: boolean;
  type?: "website" | "article";
};

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image,
  noIndex = false,
  type = "website",
}: BuildMetadataInput = {}): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  // A page's `openGraph` object replaces its parent's wholesale, so pages would lose the root share
  // image; default to it here. With `image: false` the key is left out entirely so the route's
  // own opengraph-image.tsx applies (config images, even `undefined`, override file-based ones).
  const shareImage = image === false ? null : absoluteUrl(image ?? DEFAULT_OG_IMAGE);
  // Alt text describes the picture: the default card shows the brand, not this page's title.
  const imageAlt = image && title ? `${title} — ${siteConfig.name}` : DEFAULT_IMAGE_ALT;
  const ogImages = shareImage
    ? { images: [{ url: shareImage, width: 1200, height: 630, alt: imageAlt }] }
    : {};
  const twitterImages = shareImage
    ? { images: [{ url: image ? shareImage : absoluteUrl(DEFAULT_TWITTER_IMAGE), alt: imageAlt }] }
    : {};

  return {
    // Only set when given: an explicit `title: undefined` would override the layout's default title.
    ...(title ? { title } : {}),
    description,
    // One language today; hreflang still tells Google the page targets India and is the default.
    alternates: { canonical: url, languages: { [LOCALE]: url, "x-default": url } },
    openGraph: {
      type,
      url,
      title: socialTitle,
      description,
      siteName: siteConfig.name,
      locale: OG_LOCALE,
      ...ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      ...twitterImages,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
