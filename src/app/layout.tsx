import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/content/site";
import { SITE_URL } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { siteGraph } from "@/lib/structuredData";
import "@/styles/globals.css";

// Display serif. Variable, so weights 500–650 and the SOFT and optical-size axes come from one file.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

// The italic is a separate face for the emphasised words in headlines. It is preloaded: most
// above-the-fold headlines use it, and loading it late delayed first paint and shifted layout.
const frauncesItalic = Fraunces({
  variable: "--font-fraunces-italic",
  subsets: ["latin"],
  style: "italic",
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  // Only small labels use the mono face; don't let it compete with the hero for bandwidth.
  preload: false,
});

export const metadata: Metadata = {
  ...buildMetadata(),
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} — ${siteConfig.founder.role}`,
    // Pages pass short titles (≤ 60 characters) through buildMetadata(); this suffix is appended.
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.founder.name, url: "/about" }],
  creator: siteConfig.founder.name,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  // Google Search Console: the content value of the HTML-tag verification method.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0A0A12",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      // Tells Next.js to jump, not smooth-scroll, to the top on page changes.
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${frauncesItalic.variable} ${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
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
