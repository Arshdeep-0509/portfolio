import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import {
  MARK_BODY,
  MARK_STAR,
  MARK_STAR_VIEW_BOX,
  MARK_TIGHT_RATIO,
  MARK_TIGHT_VIEW_BOX,
  MARK_TRANSFORM,
} from "@/components/brand/mark";
import { siteConfig } from "@/content/site";
import { brandColors } from "@/lib/brandColors";
import { wideStars } from "@/lib/starField";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** The alt text of a page's share image. */
export const ogAlt = (title: string) => `${title} — ${siteConfig.name}`;

// ImageResponse can't read woff2 or variable fonts, so these are static woff files, not next/font.
const sora = await readFile(join(process.cwd(), "src/assets/fonts/sora-latin-600.woff"));
const manrope = await readFile(join(process.cwd(), "src/assets/fonts/manrope-latin-500.woff"));

const footer = `${new URL(siteConfig.url).host} · ${siteConfig.location.city}, ${siteConfig.location.countryName}`;

// Satori can't read CSS variables.
const { bg: NIGHT, ink: INK, inkMuted: MUTED, accent: GOLD, border: BORDER } = brandColors.dark;

/** The hero's opacity range in the dark theme (--star-min and --star-span in globals.css). */
const starOpacity = (brightness: number) => 0.2 + brightness * 0.4;

/** The hero's stars, minus any beside the logo: one right after the wordmark reads as a full stop. */
const cardStars = wideStars.filter((star) => star.x > 36 || star.y > 26);

const MARK_HEIGHT = 68;

function titleSize(title: string) {
  if (title.length <= 28) return 84;
  if (title.length <= 48) return 72;
  if (title.length <= 72) return 60;
  return 50;
}

/**
 * The brand share image (1200×630): Polar Night, the hero's seeded star field, a gold Polaris, the
 * logo, the page title, the tagline and a footer strip. The field's keep-outs clear the title too.
 */
export function renderOgImage({ title }: { title: string }) {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 72px 44px",
        color: INK,
        backgroundColor: NIGHT,
        fontFamily: "Sora",
      }}
    >
      <svg
        width={ogSize.width}
        height={ogSize.height}
        viewBox={`0 0 ${ogSize.width} ${ogSize.height}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {cardStars.map((star) => (
          <circle
            key={`${star.x}-${star.y}`}
            cx={(star.x / 100) * ogSize.width}
            cy={(star.y / 100) * ogSize.height}
            r={star.r}
            fill={INK}
            fillOpacity={starOpacity(star.brightness)}
          />
        ))}
      </svg>

      {/* Polaris */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 36,
          width: 144,
          height: 144,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `radial-gradient(circle, ${GOLD}40 0%, ${GOLD}00 62%)`,
        }}
      >
        <svg width="46" height="46" viewBox={MARK_STAR_VIEW_BOX}>
          <path d={MARK_STAR} fill={GOLD} />
        </svg>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <svg
          width={MARK_HEIGHT * MARK_TIGHT_RATIO}
          height={MARK_HEIGHT}
          viewBox={MARK_TIGHT_VIEW_BOX}
        >
          <g transform={MARK_TRANSFORM}>
            <path d={MARK_BODY} fill={INK} fillRule="evenodd" />
            <path d={MARK_STAR} fill={GOLD} />
          </g>
        </svg>
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: -0.6 }}>
          {siteConfig.brand.wordmark}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            fontSize: titleSize(title),
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: -1.6,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>
        <div style={{ fontFamily: "Manrope", fontSize: 30, fontWeight: 500, color: MUTED }}>
          {siteConfig.tagline}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontFamily: "Manrope",
          fontSize: 22,
          fontWeight: 500,
          color: MUTED,
          borderTop: `1px solid ${BORDER}`,
          paddingTop: 20,
        }}
      >
        {footer}
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Sora", data: sora, weight: 600, style: "normal" },
        { name: "Manrope", data: manrope, weight: 500, style: "normal" },
      ],
    },
  );
}
