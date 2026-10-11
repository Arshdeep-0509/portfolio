import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type OgInput = {
  /** Short mono label, shown in parentheses: "(Services)". */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Site-relative path shown at the bottom, e.g. "/services/mvp-development". */
  path?: string;
};

// The real domain once set in site.ts; until then the placeholder stays visible on the image.
const host = isPlaceholder(siteConfig.url) ? "[DOMAIN]" : new URL(siteConfig.url).host;

// Satori cannot read CSS variables, so the Skylamp tokens are repeated here.
const NIGHT = "#0A0A12";
const IVORY = "#FBF8F2";
const MIST = "#B8B4C6";
const STARLIGHT = "#C9D2FF";
const LAMP = "#F5A524";
const GLOW = "#FFC15E";

/**
 * Brand Open Graph image (1200×630): the night sky with the horizon glow, the lamp mark and
 * wordmark, a mono label, a large title, one supporting line, then the URL and the tagline.
 */
export function renderOgImage({ eyebrow, title, subtitle, path = "/" }: OgInput) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 72px",
        color: IVORY,
        backgroundColor: NIGHT,
        backgroundImage:
          "radial-gradient(120% 80% at 50% 115%, rgba(245,165,36,0.30) 0%, rgba(46,42,79,0.55) 38%, #0A0A12 72%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <svg width="56" height="56" viewBox="0 0 40 40">
          <defs>
            <radialGradient id="lamp">
              <stop offset="0%" stopColor={GLOW} stopOpacity="0.95" />
              <stop offset="45%" stopColor={LAMP} stopOpacity="0.4" />
              <stop offset="100%" stopColor={LAMP} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="20" cy="6.5" r="7.5" fill="url(#lamp)" />
          <circle cx="20" cy="6.5" r="2.6" fill={LAMP} />
          <path d="M7.5 35 20 13.5 32.5 35" fill="none" stroke={IVORY} strokeWidth="3" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.3 }}>
            {siteConfig.brand.wordmark}
          </div>
          <div style={{ fontSize: 14, letterSpacing: 2.5, color: MIST }}>
            {siteConfig.brand.microTagline}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {eyebrow ? (
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 2, color: STARLIGHT }}>
            {`(${eyebrow.toUpperCase()})`}
          </div>
        ) : null}
        <div
          style={{
            fontSize: title.length > 48 ? 58 : 70,
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div style={{ fontSize: 27, lineHeight: 1.4, color: MIST, maxWidth: 960 }}>
            {subtitle}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 20,
          color: MIST,
          borderTop: "1px solid rgba(255,255,255,0.12)",
          paddingTop: 22,
        }}
      >
        <div style={{ display: "flex", color: GLOW }}>{`${host}${path === "/" ? "" : path}`}</div>
        <div style={{ display: "flex" }}>{siteConfig.tagline}</div>
      </div>
    </div>,
    ogSize,
  );
}
