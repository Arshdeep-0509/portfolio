import { JetBrains_Mono, Manrope, Sora } from "next/font/google";

// adjustFontFallback sizes a local fallback to match each face, so the swap doesn't shift layout.
const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  adjustFontFallback: true,
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: true,
  // Only the instrument panels use it; don't let it compete with the hero for bandwidth.
  preload: false,
});

/** The three font variables, for the root element of the layout and the global error page. */
export const fontVariables = `${sora.variable} ${manrope.variable} ${jetbrainsMono.variable}`;
