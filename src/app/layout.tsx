import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/content/site";
import { SITE_URL } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { siteGraph } from "@/lib/structuredData";
import "@/styles/globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
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
    template: `%s | ${siteConfig.name} — ${siteConfig.founder.role}`,
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
  themeColor: "#0B2545",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${jakarta.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* Without JavaScript, scroll reveals would never run; show their content. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <Providers>{children}</Providers>
        {/* WebSite + ProfessionalService + Person, referenced by @id from page-level data. */}
        <JsonLd data={siteGraph()} />
      </body>
    </html>
  );
}
