import { Fragment, type CSSProperties } from "react";
import { MARK_BODY, MARK_STAR, MARK_TRANSFORM, MARK_VIEW_BOX } from "@/components/brand/mark";
import { siteConfig } from "@/content/site";

/**
 * Runs in <head> before the body is painted. The preloader plays on every full page load
 * (moving between pages by link doesn't reload the layout, so it doesn't replay); setting
 * sessionStorage "preloader-off" turns it off, which the E2E fixture uses. Everything else is
 * CSS (globals.css → PRELOADER), so it works without JavaScript too.
 */
export const preloaderScript = `try{if(sessionStorage.getItem("preloader-off")){document.documentElement.setAttribute("data-preloader","off")}}catch(e){}`;

/**
 * The opening sequence, about 3.4 seconds on night sky: the "P" rises, the star ignites and
 * lights the sky around it, the name rises letter by letter, a gold rule sweeps out, the tagline
 * arrives word by word, and the whole sky rolls up like a curtain.
 *
 * It's decorative (aria-hidden) and never takes clicks (pointer-events: none), so the page
 * underneath is usable — and readable by screen readers — from the first moment.
 */
export function Preloader() {
  const name = siteConfig.brand.wordmark;
  const words = siteConfig.tagline.split(" ");

  return (
    <div data-theme="dark" className="preloader bg-bg bg-stars" aria-hidden="true">
      <div className="preloader-sky" />
      <div className="preloader-stage">
        <svg viewBox={MARK_VIEW_BOX} className="preloader-mark" focusable="false">
          <defs>
            <radialGradient id="preloader-glow">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.95" />
              <stop offset="45%" stopColor="var(--accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g transform={MARK_TRANSFORM}>
            <circle className="preloader-glow" cx="44" cy="34" r="26" fill="url(#preloader-glow)" />
            <path className="preloader-body" d={MARK_BODY} fill="var(--ink)" fillRule="evenodd" />
            <path className="preloader-flame" d={MARK_STAR} fill="var(--accent)" />
          </g>
        </svg>

        <p className="preloader-name font-display font-semibold">
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
