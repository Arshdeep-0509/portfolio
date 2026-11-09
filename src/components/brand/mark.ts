/**
 * Geometry of the mark, from public/brand/polestride-mark.svg. Shared by every place that has to
 * draw it inline: the logo, the preloader and the share images.
 */
export const MARK_VIEW_BOX = "0 0 104 104";
export const MARK_TRANSFORM = "translate(11 2)";

/** The box around the ink alone, for lining the mark up with text and page edges. */
export const MARK_TIGHT_VIEW_BOX = "21 8 62 92";
export const MARK_TIGHT_RATIO = 62 / 92;

/** The solid "P" with its star-shaped counter. Needs fill-rule="evenodd". */
export const MARK_BODY =
  "M10 6 H44 A28 28 0 0 1 44 62 H29 V82 L10 98 Z M44.00 17.50 Q46.80 31.20 60.50 34.00 Q46.80 36.80 44.00 50.50 Q41.20 36.80 27.50 34.00 Q41.20 31.20 44.00 17.50Z";

/**
 * The "P" with no counter. It looks the same under the star at rest, and stops the page showing
 * through the star-shaped hole when the star turns.
 */
export const MARK_BODY_SOLID = "M10 6 H44 A28 28 0 0 1 44 62 H29 V82 L10 98 Z";

/** The four-point Polaris star that fills the counter. */
export const MARK_STAR_VIEW_BOX = "27 17 34 34";
export const MARK_STAR =
  "M44.00 17.10 Q46.87 31.13 60.90 34.00 Q46.87 36.87 44.00 50.90 Q41.13 36.87 27.10 34.00 Q41.13 31.13 44.00 17.10Z";
