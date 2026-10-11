import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type OgInput = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Site-relative path shown at the bottom, e.g. "/services/mvp-development". */
  path?: string;
};

// The real domain once set in site.ts; until then the placeholder stays visible on the image.
const host = isPlaceholder(siteConfig.url) ? "[DOMAIN]" : new URL(siteConfig.url).host;

/**
 * Brand Open Graph image (1200×630): the hero gradient, monogram + wordmark, an eyebrow, a large
 * title, one supporting line and the page URL. Colours mirror the design tokens (satori cannot read CSS vars).
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
        padding: "64px 72px",
        color: "#FFFFFF",
        backgroundImage: "radial-gradient(circle at 0% 0%, #16447F 0%, #1D5FD1 55%, #0B2545 100%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0B2545",
            border: "2px solid rgba(255,255,255,0.25)",
            fontSize: 26,
            fontWeight: 800,
          }}
        >
          {siteConfig.brand.monogram}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, fontWeight: 700 }}>{siteConfig.brand.wordmark}</div>
          <div style={{ fontSize: 16, letterSpacing: 3, color: "#B9E6FF" }}>
            {siteConfig.brand.microTagline}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div style={{ fontSize: title.length > 40 ? 60 : 72, fontWeight: 800, lineHeight: 1.08 }}>
          {title}
        </div>
        {subtitle ? (
          <div style={{ fontSize: 28, lineHeight: 1.35, color: "#FFFFFF", maxWidth: 980 }}>
            {subtitle}
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", fontSize: 22, fontWeight: 600, color: "#B9E6FF" }}>
        {`${host}${path === "/" ? "" : path}`}
      </div>
    </div>,
    ogSize,
  );
}
