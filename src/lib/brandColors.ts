/**
 * The colour tokens as TypeScript, for places that can't read CSS variables: Open Graph images,
 * emails, the manifest, viewport metadata and the last-resort error page. Components use the
 * Tailwind utilities instead. tests/unit/brand-colors.test.ts keeps this in step with globals.css.
 */
export const brandColors = {
  dark: {
    bg: "#0B1630",
    surface: "#13254A",
    surfaceRaised: "#1A3160",
    ink: "#EAF1FB",
    inkMuted: "#8A9BB8",
    border: "#24406F",
    accent: "#E8B84A",
    polaris: "#E8B84A",
    accentInk: "#0B1630",
    link: "#5FD4C2",
    focus: "#5FD4C2",
    success: "#5FD4C2",
    danger: "#FF8A7A",
  },
  light: {
    bg: "#EAF1FB",
    surface: "#FFFFFF",
    surfaceRaised: "#F4F7FC",
    ink: "#0B1630",
    inkMuted: "#4A5B7A",
    border: "#CBD7E8",
    accent: "#B88018",
    polaris: "#C4881A",
    accentInk: "#0B1630",
    link: "#0E7B6D",
    focus: "#0E7B6D",
    success: "#0E7B6D",
    danger: "#B3261E",
  },
} as const;

export type Theme = keyof typeof brandColors;
