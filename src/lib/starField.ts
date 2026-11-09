/**
 * The hero's night sky. Positions come from a seeded generator, so every render, on the server and
 * anywhere else, produces exactly the same field. Coordinates are percentages of the hero unless
 * a set says otherwise.
 */

export type Star = {
  x: number;
  y: number;
  /** Radius in pixels: 0.5 to 1. */
  r: number;
  /** Brightness from 0 to 1, mapped onto the theme's opacity range in globals.css. */
  brightness: number;
};

/** A small, fast seeded generator (mulberry32). */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (value: number) => Math.round(value * 100) / 100;

function scatter({
  seed,
  count,
  gap,
  area,
  allowed,
}: {
  seed: number;
  count: number;
  /** Minimum distance between stars. */
  gap: number;
  area: { x: [number, number]; y: [number, number] };
  allowed: (x: number, y: number) => boolean;
}): Star[] {
  const random = seededRandom(seed);
  const stars: Star[] = [];
  while (stars.length < count) {
    const x = area.x[0] + random() * (area.x[1] - area.x[0]);
    const y = area.y[0] + random() * (area.y[1] - area.y[0]);
    const r = 0.5 + random() * 0.5;
    const brightness = random();
    if (!allowed(x, y)) continue;
    if (stars.some((star) => Math.hypot(star.x - x, star.y - y) < gap)) continue;
    stars.push({ x: round(x), y: round(y), r: round(r), brightness: round(brightness) });
  }
  return stars;
}

/**
 * Two columns from 1024px: nothing behind the text on the left, under the header, or under the
 * build log, which would hide it anyway.
 */
export const wideStars = scatter({
  seed: 1907,
  count: 46,
  gap: 3.5,
  area: { x: [2, 98], y: [14, 96] },
  allowed: (x, y) => {
    const behindText = x < 61 && y > 17;
    const behindCard = x > 59 && y > 34 && y < 80;
    const behindFacts = y > 86 && x < 70;
    return !behindText && !behindCard && !behindFacts;
  },
});

/**
 * One column below 1024px: only the strip between the 68px header and the first line of text.
 * That gap is a fixed height whatever the hero's height, so y here is in pixels, not percent.
 */
export const narrowStars = scatter({
  seed: 2024,
  count: 10,
  gap: 6,
  area: { x: [3, 97], y: [76, 114] },
  allowed: () => true,
});

/**
 * Runs in <head>. The hero's default render is its final state; this opts in to the animation for
 * the first view of the home page in a session, then steps aside so that coming back to the page
 * by link can't replay it.
 */
export const skyScript = `(function(){try{if(location.pathname!=="/"||sessionStorage.getItem("sky-seen"))return;sessionStorage.setItem("sky-seen","1");var r=document.documentElement;r.setAttribute("data-sky","play");setTimeout(function(){r.removeAttribute("data-sky")},6000)}catch(e){}})()`;
