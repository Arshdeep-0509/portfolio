import type { NextConfig } from "next";
import { deployUrl } from "./src/lib/deployUrl";

const isDev = process.env.NODE_ENV === "development";
// Previews get their own URL; see deployUrl. Baked in through `env` below.
const { NEXT_PUBLIC_SITE_URL, VERCEL_ENV, VERCEL_URL } = process.env;
const siteUrl = deployUrl({ NEXT_PUBLIC_SITE_URL, VERCEL_ENV, VERCEL_URL });
const httpsSite = !isDev && (siteUrl ?? "").startsWith("https://");
const isPreview = VERCEL_ENV === "preview";
// Speed Insights only exists on Vercel; Docker and local builds would request a missing script.
const onVercel = Boolean(process.env.VERCEL);
// Docker / self-hosted builds set BUILD_STANDALONE=true (see Dockerfile).
const standalone = process.env.BUILD_STANDALONE === "true";

function originOf(url: string | undefined) {
  try {
    return url ? new URL(url).origin : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Content-Security-Policy listing only the third parties this site actually uses:
 * Google Analytics 4 + Microsoft Clarity (after consent), Cloudflare Turnstile (forms),
 * Calendly + Google Maps (embeds opened on click), Razorpay (/pay), Sentry and Plausible (if set).
 * Vercel Speed Insights is served from this origin, so 'self' covers it. Resend, Slack, Telegram,
 * Upstash, Supabase and S3 are called from the server only, so they don't appear here.
 *
 * 'unsafe-inline' for scripts is required by Next.js's inline bootstrap scripts on statically
 * generated pages; nonces would force every page to render dynamically. JSON-LD blocks are data,
 * not scripts, so they aren't affected.
 */
function contentSecurityPolicy() {
  const sentry = originOf(process.env.NEXT_PUBLIC_SENTRY_DSN);
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
    ? (originOf(process.env.NEXT_PUBLIC_PLAUSIBLE_SRC) ?? "https://plausible.io")
    : undefined;

  const google = [
    "https://*.googletagmanager.com",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.g.doubleclick.net",
    "https://www.google.com",
  ];
  const clarity = ["https://*.clarity.ms", "https://c.bing.com"];
  const razorpay = ["https://*.razorpay.com"];

  const directives: Record<string, (string | undefined)[] | undefined> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      isDev ? "'unsafe-eval'" : undefined,
      "https://www.googletagmanager.com",
      ...clarity,
      "https://challenges.cloudflare.com",
      ...razorpay,
      plausible,
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", ...google, ...clarity, ...razorpay],
    "font-src": ["'self'", "data:"],
    "connect-src": [
      "'self'",
      isDev ? "ws:" : undefined,
      ...google,
      ...clarity,
      ...razorpay,
      sentry,
      plausible,
    ],
    "frame-src": [
      "https://challenges.cloudflare.com",
      "https://calendly.com",
      "https://www.google.com",
      ...razorpay,
    ],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    "form-action": ["'self'", ...razorpay],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "frame-ancestors": ["'none'"],
    // Only for HTTPS deployments; it would break local production testing on http://localhost.
    "upgrade-insecure-requests": httpsSite ? [] : undefined,
  };

  return Object.entries(directives)
    .filter(([, values]) => values !== undefined)
    .map(([name, values]) => [name, ...(values ?? []).filter(Boolean)].join(" "))
    .join("; ");
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy() },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Legacy equivalent of frame-ancestors 'none' for older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "usb=()",
      "browsing-topics=()",
      'payment=(self "https://api.razorpay.com" "https://checkout.razorpay.com")',
    ].join(", "),
  },
];

/** The one public address. Keep in step with the fallback in src/content/site.ts. */
const CANONICAL_ORIGIN = "https://polestride.com";

/**
 * Hosts that move to the canonical origin, with a 301. Matched exactly, so preview deployments
 * (other *.vercel.app hosts) carry on working. No regex escapes: a literal is safe on every host.
 */
const OLD_HOSTS = ["www.polestride.com", "portfolio-4xrz.vercel.app"];

// Files in /public aren't content-hashed, so they get a long but not immutable lifetime.
const publicAssetCache = "public, max-age=2592000, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  env: {
    ...(siteUrl ? { NEXT_PUBLIC_SITE_URL: siteUrl } : {}),
    NEXT_PUBLIC_ON_VERCEL: onVercel ? "1" : "",
  },
  // The policy: no trailing slashes. Next.js redirects /about/ to /about with a 308.
  trailingSlash: false,
  cacheComponents: true,
  partialPrefetching: true,
  ...(standalone ? { output: "standalone" as const } : {}),
  // Behind Nginx (self-hosted), Nginx compresses with brotli/gzip instead.
  compress: !standalone,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Routes renamed in the rebrand (src/lib/routes.ts › renamedRoutes). Permanent: 308.
  async redirects() {
    return [
      ...OLD_HOSTS.map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        statusCode: 301 as const,
      })),
      { source: "/why-me", destination: "/approach", permanent: true },
      { source: "/insights", destination: "/journal", permanent: true },
      { source: "/insights/:slug", destination: "/journal/:slug", permanent: true },
      { source: "/careers", destination: "/collaborate", permanent: true },
      { source: "/rss.xml", destination: "/journal/rss.xml", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Previews share the production code; only this keeps them out of search results.
      ...(isPreview
        ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] }]
        : []),
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: publicAssetCache }] },
      { source: "/icons/:path*", headers: [{ key: "Cache-Control", value: publicAssetCache }] },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: publicAssetCache }] },
      { source: "/favicon.ico", headers: [{ key: "Cache-Control", value: publicAssetCache }] },
    ];
  },
};

export default nextConfig;
