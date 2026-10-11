import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const httpsSite = !isDev && (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://");
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

// Files in /public aren't content-hashed, so they get a long but not immutable lifetime.
const publicAssetCache = "public, max-age=2592000, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
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
  // Routes renamed in the Skylamp rebrand (src/lib/routes.ts › renamedRoutes). Permanent: 308.
  async redirects() {
    return [
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
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: publicAssetCache }] },
      { source: "/icons/:path*", headers: [{ key: "Cache-Control", value: publicAssetCache }] },
      { source: "/favicon.ico", headers: [{ key: "Cache-Control", value: publicAssetCache }] },
    ];
  },
};

export default nextConfig;
