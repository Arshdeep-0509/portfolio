import type { Metadata, Viewport } from "next";
import { Preloader, preloaderScript } from "@/components/layout/Preloader";
import { Providers } from "@/components/layout/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/content/site";
import { LOCALE } from "@/lib/constants";
import { brandColors } from "@/lib/brandColors";
import { fontVariables } from "@/lib/fonts";
import { buildMetadata } from "@/lib/seo";
import { skyScript } from "@/lib/starField";
import { siteGraph } from "@/lib/structuredData";
import { themeScript } from "@/lib/theme";
import "@/styles/globals.css";

export const metadata: Metadata = {
  ...buildMetadata(),
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    // Pages pass short titles (≤ 60 characters) through buildMetadata(); this suffix is appended.
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.founder.name, url: "/about" }],
  creator: siteConfig.founder.name,
  // Google Search Console: the content value of the HTML-tag verification method.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: brandColors.dark.bg },
    { media: "(prefers-color-scheme: light)", color: brandColors.light.bg },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={LOCALE}
      // Tells Next.js to jump, not smooth-scroll, to the top on page changes.
      data-scroll-behavior="smooth"
      // The head scripts below add data-theme and data-preloader before React hydrates.
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <head>
        {/* Set the theme before first paint, so there is no flash of the wrong one. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Decides before first paint whether the hero's moment and the opening sequence play. */}
        <script dangerouslySetInnerHTML={{ __html: skyScript }} />
        <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Preloader />
        {/* Without JavaScript, scroll reveals would never run; show their content. */}
        <noscript>
          <style>
            {
              "[data-reveal]{opacity:1!important;filter:none!important;transform:none!important;clip-path:none!important}"
            }
          </style>
        </noscript>
        <Providers>{children}</Providers>
        {/* WebSite + ProfessionalService + Person, referenced by @id from page-level data. */}
        <JsonLd data={siteGraph()} />
      </body>
    </html>
  );
}
