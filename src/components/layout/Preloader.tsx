import { Fragment, type CSSProperties } from "react";
import { siteConfig } from "@/content/site";

/**
 * Runs in <head> before the body is painted. The preloader plays on every full page load
 * (moving between pages by link doesn't reload the layout, so it doesn't replay); setting
 * sessionStorage "preloader-off" turns it off, which the E2E fixture uses. Everything else is
 * CSS (globals.css → PRELOADER), so it works without JavaScript too.
 */
export const preloaderScript = `try{if(sessionStorage.getItem("preloader-off")){document.documentElement.setAttribute("data-preloader","off")}}catch(e){}`;

/**
 * The opening sequence, about 3.4 seconds on night sky: the "A" of the mark draws itself, the
 * lamp ignites and lights the sky around it, the name rises letter by letter, an amber rule
 * sweeps out, the tagline arrives word by word, and the whole sky rolls up like a curtain.
 *
 * It's decorative (aria-hidden) and never takes clicks (pointer-events: none), so the page
 * underneath is usable — and readable by screen readers — from the first moment.
 */
export function Preloader() {
  const name = siteConfig.brand.wordmark;
  const words = siteConfig.tagline.split(" ");

  return (
    <div className="preloader bg-night-950 bg-stars" aria-hidden="true">
      <div className="preloader-sky" />
      <div className="preloader-stage">
        <svg viewBox="0 0 40 40" className="preloader-mark" focusable="false">
          <defs>
            <radialGradient id="preloader-glow">
              <stop offset="0%" stopColor="var(--lamp-400)" stopOpacity="0.95" />
              <stop offset="45%" stopColor="var(--lamp-500)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--lamp-500)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle className="preloader-glow" cx="20" cy="6.5" r="7.5" fill="url(#preloader-glow)" />
          <circle className="preloader-flame" cx="20" cy="6.5" r="2.6" fill="var(--lamp-500)" />
          <path
            className="preloader-stroke"
            d="M7.5 35 20 13.5 32.5 35"
            pathLength={1}
            fill="none"
            stroke="var(--ivory-50)"
            strokeWidth="3"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
          />
        </svg>

        <p className="preloader-name font-display-soft">
          {[...name].map((char, index) => (
            <span key={index} style={{ "--i": index } as CSSProperties}>
              {char === " " ? " " : char}
            </span>
          ))}
        </p>

        <span className="preloader-rule" />

        <p className="preloader-tagline">
          {/* The spaces between words keep the text readable when copied; the flex gap spaces them. */}
          {words.map((word, index) => (
            <Fragment key={index}>
              {index > 0 ? " " : null}
              <span style={{ "--i": index } as CSSProperties}>{word}</span>
            </Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}
