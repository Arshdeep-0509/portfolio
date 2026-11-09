import type { CSSProperties } from "react";
import { Star as StarMark } from "@/components/brand/Star";
import { narrowStars, wideStars, type Star } from "@/lib/starField";

function Stars({
  stars,
  yUnit,
  className,
}: {
  stars: Star[];
  yUnit: "%" | "px";
  className: string;
}) {
  return (
    <g className={className}>
      {stars.map((star) => (
        <circle
          key={`${star.x}-${star.y}`}
          cx={`${star.x}%`}
          cy={`${star.y}${yUnit}`}
          r={star.r}
          fill="var(--ink)"
          className="hero-star"
          style={{ "--brightness": star.brightness } as CSSProperties}
        />
      ))}
    </g>
  );
}

/** The faint star field, behind everything in the hero. Rendered once, on the server. */
export function HeroSky() {
  return (
    <svg aria-hidden="true" className="hero-sky absolute inset-0 -z-10 size-full">
      <Stars stars={wideStars} yUnit="%" className="max-lg:hidden" />
      <Stars stars={narrowStars} yUnit="px" className="lg:hidden" />
    </svg>
  );
}

/**
 * Polaris and its bearing line, placed inside the text column so they track the layout at every
 * width. The line runs down the gutter beside the text, then turns in below the paragraph to end
 * next to the buttons, so it never crosses any words.
 *
 * Dotted lines can't be drawn with dashoffset directly, because the dots are the dashes. A solid
 * line draws itself inside a mask instead, and uncovers the dots as it goes.
 */
export function HeroPolaris() {
  return (
    <>
      <StarMark className="hero-polaris absolute size-3.5 max-lg:-top-9 max-lg:right-1 lg:top-10 lg:-right-[35px]" />
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute top-[60px] -right-7 bottom-[26px] left-0 hidden h-[calc(100%-86px)] w-[calc(100%+1.75rem)] overflow-visible lg:block"
      >
        <defs>
          <mask
            id="bearing-reveal"
            maskUnits="userSpaceOnUse"
            x="0"
            y="-2"
            width="104"
            height="104"
          >
            <path
              className="hero-bearing-draw"
              d="M100 0 V84 Q100 100 86 100 H72"
              pathLength={1}
              fill="none"
              stroke="white"
              strokeWidth="6"
            />
          </mask>
        </defs>
        <path
          d="M100 0 V84 Q100 100 86 100 H72"
          mask="url(#bearing-reveal)"
          fill="none"
          stroke="var(--polaris)"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="0.1 7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </>
  );
}
