# Skylamp — the rebrand

This document records the October 2026 rebrand: the concept, the design tokens, the type, how
every old section and route maps to the new site, and what was removed. The working rules for
day-to-day edits live in [README.md](README.md) › Design system.

## Concept

"Arshdeep" is commonly read as _Arsh_ (sky, heaven) + _Deep_ (lamp, light) — the owner still needs
to confirm this reading (`[CONFIRM NAME MEANING]` in `src/content/about.ts`). The brand is a lamp
in the night sky: a steady light that guides a product from idea to launch. Calm, warm and
precise, never loud.

- **Mark.** A geometric "A" of two strokes meeting at a peak, with a small saffron lamp in a soft
  radial glow just above the apex. `src/components/layout/Logo.tsx` exports `LogoMark` and
  `Logo` (mark only or mark + wordmark; for light, dark or tone-following backgrounds). The glow
  "breathes" on a 6-second opacity loop — the only looping motion on the site — and stops under
  reduced motion.
- **Wordmark.** "Arshdeep Singh" in Fraunces 600, letter-spacing −0.01em, with the optional
  sub-line `ENGINEER · BUILDER · AI & CLOUD` in IBM Plex Mono 10px (hidden below 420px wide).
- **Tagline.** "Engineering that lights the way from idea to launch." — in metadata, OG images and
  the footer. Inside page copy the light/sky image is used at most once per page (the About
  opening is the deliberate one).
- **Icons.** `public/icons/*`, `src/app/favicon.ico` and the manifest icons are generated from the
  mark on a night square by `pnpm icons` (`scripts/generate-icons.mjs`, using Playwright's
  Chromium). Small sizes use a bolder variant so the lamp survives at 16px. Manifest theme colour:
  `#0A0A12`.
- **Share images.** `src/lib/og.tsx`: night sky with the horizon glow, the mark and wordmark, a mono
  label, the title, and the URL beside the tagline. (Satori's default sans is used for text; adding
  Fraunces there would mean bundling a TTF.)

## Tokens

All tokens are CSS variables in `src/styles/globals.css`, mapped into Tailwind v4 with
`@theme inline`. Tailwind's default colour, radius, shadow and font scales are reset.

### Colour

| Token           | Value                    | Role                                                                         |
| --------------- | ------------------------ | ---------------------------------------------------------------------------- |
| `--night-950`   | `#0A0A12`                | Deepest sky: hero, footer, QuickStart                                        |
| `--night-900`   | `#12121F`                | Dark sections                                                                |
| `--night-800`   | `#1C1B2E`                | Cards on dark                                                                |
| `--dusk-700`    | `#2E2A4F`                | Indigo dusk in gradients                                                     |
| `--lamp-500`    | `#F5A524`                | Accent fill (buttons, dots, highlights) — never text on paper                |
| `--lamp-400`    | `#FFC15E`                | Glow, hover, accent text on night                                            |
| `--lamp-700`    | `#A65E00`                | Accent text on ivory (4.69:1)                                                |
| `--lamp-800`    | `#9A5600`                | **Added:** accent text on sand, where `--lamp-700` is only 4.27:1 (4.86:1)   |
| `--ember-500`   | `#F2683C`                | Flame gradient end                                                           |
| `--starlight`   | `#C9D2FF`                | Small labels and star dots on dark                                           |
| `--ivory-50`    | `#FBF8F2`                | Main light background                                                        |
| `--sand-100`    | `#F3EDE2`                | Alternate light section                                                      |
| `--ink-900`     | `#16141F`                | Text on light                                                                |
| `--ink-600`     | `#4A4658`                | Muted text on light                                                          |
| `--mist-300`    | `#B8B4C6`                | Muted text on dark                                                           |
| `--line`        | `#E6DFD3`                | Hairlines on light                                                           |
| `--line-dark`   | `rgb(255 255 255 / .10)` | Hairlines on dark                                                            |
| `--success`     | `#2F9E6E`                | Dots, icons, borders; text on night                                          |
| `--success-700` | `#1F7A50`                | **Added:** success text on paper (`--success` is 3.18:1 on ivory)            |
| `--danger`      | `#D64545`                | Dots, icons, borders                                                         |
| `--danger-700`  | `#B83A3A`                | **Added:** error text on paper (`--danger` is 4.13:1 on ivory)               |
| `--danger-300`  | `#FF8A7A`                | **Added:** error text on night (`--danger` is 4.50:1, too close to the line) |

The four **added** tints are the only departures from the brief's palette. They exist because the
brief asked for AA contrast to be verified, and the measured values fell short for small text.
`pnpm contrast` prints every pairing the design uses (all pass) and the banned ones.

**Contextual colours.** Sections set `.tone-night`, `.tone-ivory` or `.tone-sand`, which define
`--fg`, `--fg-muted`, `--accent`, `--rule`, `--focus`, `--danger-fg`, `--success-fg` and
`--field-bg`. Components use only these (`text-fg`, `text-accent`, `border-rule`…), so the same
component reads correctly on any surface.

### Gradients and textures

| Token                     | Value                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `--grad-flame`            | `linear-gradient(135deg, #FFC15E 0%, #F5A524 45%, #F2683C 100%)` — primary buttons, emphasis underline, progress bars            |
| `--grad-horizon`          | `radial-gradient(120% 80% at 50% 115%, rgba(245,165,36,.30) 0%, rgba(46,42,79,.55) 38%, #0A0A12 72%)` — night heroes, QuickStart |
| `--stars` (`bg-stars`)    | Two offset 1px dot layers at 6% and 4%                                                                                           |
| `--paper-grain` (`grain`) | SVG fractal noise at 2.5% over ivory sections                                                                                    |

### Shape, depth and layout

| Token            | Value                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `rounded-card`   | 4px — cards, inputs, chips                                                                                                      |
| `rounded-button` | 8px — buttons                                                                                                                   |
| `rounded-dot`    | 999px — status dots only (no pills anywhere)                                                                                    |
| `shadow-glow`    | `0 0 0 1px var(--lamp-500), 0 18px 40px -24px rgba(245,165,36,.55)` — card hover only; cards are otherwise flat with a hairline |
| Container        | 1240px max, 12 columns, 16px / 24px gutters                                                                                     |
| Section padding  | 72px mobile / 120px desktop                                                                                                     |
| Header           | 32px utility strip (desktop) + 68px bar                                                                                         |

### Motion

- **Glow-in reveal:** opacity 0→1, blur 8px→0, y 12px→0, 700ms (`[data-reveal]`).
- **Headline mask:** section titles wipe in top-down (`[data-reveal="mask"]`), so lines appear one
  after another. The hero H1 only rises — it is the LCP element and must paint on frame one.
- **Cursor glow:** a soft lamp light follows the pointer on dark heroes (desktop, fine pointer only).
- **Build log:** lines type out in pure CSS (`clip-path` steps — repaint only, no layout).
- Everything is off under `prefers-reduced-motion`.

## Type

| Role                  | Face                    | Setup (`src/app/layout.tsx`, `next/font`)                                                                                                                                                                    |
| --------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Display               | **Fraunces** (variable) | `axes: ["SOFT", "opsz"]`, `font-variation-settings: "SOFT" 50`, optical size auto, weights 500–650                                                                                                           |
| Emphasis              | **Fraunces Italic**     | Separate face (`--font-fraunces-italic`), preloaded: most hero headlines use it, and loading it late cost ~0.9s of first paint plus a layout shift. Emphasised phrases get a 2px flame underline, 6px offset |
| Body                  | **Manrope**             | 400 / 500 / 700                                                                                                                                                                                              |
| Labels, numbers, code | **IBM Plex Mono**       | 400 / 500, not preloaded                                                                                                                                                                                     |

Scale: h1 `clamp(2.75rem, 1.8rem + 4.5vw, 5rem)` / 1.02 / −0.02em · h2
`clamp(2rem, 1.4rem + 2.6vw, 3.25rem)` · h3 1.375rem · body 1.0625rem / 1.7 · label 0.75rem mono
uppercase, 0.08em.

## Routes

| Old               | New                | Redirect |
| ----------------- | ------------------ | -------- |
| `/why-me`         | `/approach`        | 308      |
| `/insights`       | `/journal`         | 308      |
| `/insights/:slug` | `/journal/:slug`   | 308      |
| `/careers`        | `/collaborate`     | 308      |
| `/rss.xml`        | `/journal/rss.xml` | 308      |

Redirects are in `next.config.ts` (also listed in `src/lib/routes.ts` › `renamedRoutes`); query
strings carry over. The sitemap, robots, navigation, footer, JSON-LD URLs, OG images, proxy
matcher, email links and Playwright tests all use the new paths. Content moved from
`content/insights/` to `content/journal/`.

## Sections: old → new

### Global

| Old                                                         | New                                                                                                                                                                           |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| White header with pill CTA, 4-column mega menu + promo card | Night utility strip (availability, local time, email) + bar that is transparent over night heroes; two-panel services menu with a live preview; full-screen night mobile menu |
| CTA band above the footer (per-page overrides)              | **QuickStart**: three-field enquiry on the horizon glow, everywhere except /contact                                                                                           |
| 5-column gradient footer                                    | Night footer with stars: 3 link columns, newsletter, contact + live clock, full-width wordmark at 8% with the glowing lamp                                                    |
| BackToTop circle                                            | `ScrollProgressRing`                                                                                                                                                          |
| Round WhatsApp bubble                                       | `ContactDock` (WhatsApp, email, book a call; hidden on /contact)                                                                                                              |
| Centred announcement modal                                  | `CornerCard` (same config, once per id, same exclusions)                                                                                                                      |
| 404 "took a wrong turn"                                     | Night sky, cursor lamp, "This page is off the map"                                                                                                                            |

### Home

| Old (in order)                                  | New (in order)                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| Split hero with illustration                    | Night hero: label, H1, sentence, two buttons, typing **BuildLog**, three mono facts |
| Tech marquee                                    | — (tools now live in the Stack map)                                                 |
| Overview + info card                            | Folded into **Principles** (sticky overview)                                        |
| Benefits (3×2 cards) + Why founders (3×2 cards) | **Principles**: six merged principles as an EditorialList                           |
| Technology (tabs + cards)                       | **Stack map** (layered bands, no tabs)                                              |
| Process (timeline)                              | **How a project runs** (StickyScrollStory with outcome, deliverables, duration)     |
| Deliverables (3×2 cards)                        | **The handover kit** (ownership text + FileTree)                                    |
| Products                                        | **From the lab** (ScrollSnapRow + two case-study links)                             |
| — (picker was on /services)                     | **What I build** bento, including the 3-question picker                             |
| Testimonials carousel (flag)                    | One pull-quote at a time (same flag), between handover kit and stack map            |
| FAQ                                             | **Questions** (sticky heading + "ask me directly" card + accordion)                 |

### Other pages

| Page                        | Old                                                                                                                | New                                                                                                                                                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| /services                   | Hero + illustration, filter tabs + card grid, group bands, picker                                                  | Ivory hero with breadcrumb label · table-of-contents index with sticky preview (accordions on mobile) · Ways to work together · Popular combinations (pre-filled `/contact?bundle=…`) · FAQ                                                            |
| /services/[slug]            | Dark hero + glass card, sticky sub-nav, stacked sections, case study, related cards                                | Two-column long-read: sticky sidebar (breadcrumb, chapters with scroll-spy, quick facts, actions) · numbered chapters · "Pairs well with" · mobile Contents dropdown + sticky bar. The case-study block was dropped (not in the brief's chapter list). |
| /approach (was /why-me)     | Hero, intro + commitments, different, benefits, comparison, differentiators, fit, tech, process, deliverables, FAQ | Manifesto · My commitments (mono term rows) · Is this a fit? · Your options, honestly (matrix / scroll-snap cards) · Why it works · links to Home's process and handover kit · FAQ                                                                     |
| /about                      | Founder hero, story, mission/vision, values, journey, pillars, products, work-together, benefits, FAQ              | Name story + ArchFrame portrait · Now · Logbook · Values manifesto · Toolbox · From the lab · Working rhythm · FAQ (mission folded into the opening, vision into the Logbook's "Next")                                                                 |
| /work                       | Card grid with chip filters                                                                                        | "Selected work": text-link filters, alternating full-width rows                                                                                                                                                                                        |
| /work/[slug]                | Hero with image, facts bar, stacked sections, CTA band, pager cards                                                | Magazine layout: night opening + full-bleed cover · sticky facts sidebar · numbered chapters · gallery as ScrollSnapRow + lightbox · text pager                                                                                                        |
| /journal (was /insights)    | Chip filters, search pill, card grid, newsletter card                                                              | Editorial index: featured post, dated rows, text-link filters, underlined search (newsletter is in the footer)                                                                                                                                         |
| /journal/[slug]             | Cover, prose, side TOC, related cards                                                                              | Serif headings on ivory, sticky margin TOC, 2px flame progress bar, text rows for related posts                                                                                                                                                        |
| /collaborate (was /careers) | Hero, openings + short version, culture, benefits, why join, tech, hiring, role types, form, FAQ                   | Promise + mono facts · audience tabs with role rows · hiring steps line · honest benefits list · 3-step FormWizard · FAQ                                                                                                                               |
| /contact                    | Diagonal hero, intro, reason cards, numbered FAQ cards, details + form, map                                        | Split screen: sticky night column (methods, what happens next, promise) + 3-step FormWizard · compact two-column FAQ. Map removed.                                                                                                                     |
| Legal                       | Gradient hero + LegalLayout                                                                                        | Ivory LegalLayout: breadcrumb, serif title, mono "Last updated", numbered margin contents, serif h2s                                                                                                                                                   |

## Components

**Added:** `SectionHeader`, `Emphasis`, `Bento`/`BentoTile`, `EditorialList`, `StickyScrollStory`,
`FileTree`, `StackMap`, `ScrollSnapRow`, `StatusDot`, `FormWizard`, `SelectableCard`,
`SegmentedControl`, `ChoiceChips`, `Toggle`, `BuildLog`, `ArchFrame`, `ScrollProgressRing`,
`CursorGlow`, `LiveClock`, `PullQuote`, `ComparisonMatrix`, `ChapterNav`, `Chip`/`ChipList`
(restyled), `ContactDock`, `CornerCard`, `QuickStart`, `ServicesMenu`, `NewsletterForm`,
`FaqSection`, `FaqJsonLd`, `Lab`, `ServiceIndex`, `WorkIndex`, `JournalIndex`.

**Restyled:** `Button` (flame / solid-ink / outline / text-link), `Section` (tones), `Container`,
`Accordion`, form controls, `Breadcrumb` (mono label), `Tabs`, `Modal`, `Toast`, `Gallery`,
`GalleryLightbox`, `FileDrop`, cookie banner and settings, `LegalLayout`, MDX `Callout` and
`CodeBlock` (shiki theme switched to the warm "vesper").

**Removed:** `SectionHeading` (centred title with underline bar), `Badge` (eyebrow pills),
`IconTile`, `NumberLabel`, `Timeline`, `Marquee`, `BackToTop`, `FloatingWhatsApp`,
`AnnouncementPopup`, `AnnouncementDialog`, `CTABand`, `SiteCTABand`, `MegaMenu`,
`TestimonialCarousel`, `AvailabilityBadge`, `ComparisonTable`, `Illustration`, every card in
`ui/cards/` (`Card`, `FeatureCard`, `GlassCard`, `NumberedCard`, `InfoCard`, `DeliverableCard`,
`ProcessStepCard`, `ProductCard`, `ServiceLinkCard`, `SkillPillar`, `TechCategoryCard`,
`CaseStudyCard`, `PostCard`), all old section components (`sections/home/*`, `services/*`,
`service/*`, `shared/CompactPageHero`, `shared/SplitHero`, `why-me/*`, `about/*`,
`InsightsBrowser`, `NewsletterCard`, `ContactSections`, `MapEmbed`, `CopyButton`,
`CareersSections`, `work/*`), `content/ctaBand.ts`, `content/ctaBandOverrides.ts`, and the
illustrations `hero-illustration.svg`, `contact-illustration.svg`, `services-hero.svg`,
`placeholder-illustration.svg`.

## Copy

All page copy, MDX, metadata, alt text, form labels, validation messages, API error messages and
email templates were rewritten with the meaning kept. Notes:

- **Legal policies were restyled but not reworded.** Rewording a policy can change its legal
  meaning, and the brief asked to keep that meaning; only route references changed. Have your
  lawyer review them as before.
- Service names, product names, technology names, timelines, `[PLACEHOLDERS]` and the phrases the
  brief prescribes ("Book a free call", "NDA on request", the handover-kit lines…) are kept as
  given.
- New typical durations on the process steps that aren't stated elsewhere are marked as
  placeholders (`[1–2 weeks]`, `[3–5 days]`, `[2–3 days]`) for the owner to confirm.
- `pnpm originality` compares the copy with `reference/*.txt`. `reference/old-site.txt` holds the
  retired labels and reports zero overlaps; paste the reference sites' text into
  `reference/arunesh.txt` and `reference/vibrona.txt` to run the full check (see
  `reference/README.md`).

## Behaviour changes worth knowing

- `/api/contact` accepts service `quick` (QuickStart). For that service only, the phone number may
  be empty (stored as `""`, so no migration) and the message minimum is 10 characters instead of 30.
- The contact form accepts `?bundle=launch-kit|ai-upgrade|growth-engine` and the picker's
  `?services=a,b`; several selected services go into the message as "Also interested in: …".
- Analytics: `generate_lead` now carries `form: "contact" | "quick-start"`; `newsletter_signup`
  carries `location: "footer"`; new `data-cta` locations include `contact-dock`, `lab-*`,
  `bundle-*`, `service-sidebar` and `service-sticky-bar`.
- The header's transparent state is decided by route (`isOverHeroRoute` in
  `src/components/layout/navTypes.ts`); a new page that opens with a night hero must be added
  there as well as using `<Section underHeader>`.

## Verification (11 October 2026)

| Check                                                                    | Result                                      |
| ------------------------------------------------------------------------ | ------------------------------------------- |
| `pnpm typecheck`, `pnpm lint`, `pnpm format:check`                       | Pass                                        |
| `pnpm test` (unit)                                                       | 43 / 43 pass                                |
| `pnpm test:e2e` (desktop + mobile, includes axe WCAG 2.2 AA on 12 pages) | 58 pass, 6 skipped (viewport-specific)      |
| `pnpm test:links`                                                        | 28 pages, 1,724 internal links, none broken |
| `pnpm contrast`                                                          | All 28 allowed pairings meet AA             |
| `pnpm originality` (retired labels)                                      | 0 overlaps                                  |

Lighthouse (mobile, simulated throttling, median of 3, local Windows machine):

| Page                                                                                     | Perf  | A11y | Best practices | SEO |
| ---------------------------------------------------------------------------------------- | ----- | ---- | -------------- | --- |
| `/`                                                                                      | 76    | 100  | 100            | 100 |
| `/services`                                                                              | 74    | 100  | 100            | 100 |
| `/about`                                                                                 | 75    | 100  | 100            | 100 |
| `/services/ai-integration`, `/approach`, `/work`, `/contact`, `/collaborate`, `/journal` | 72–77 | 100  | 100            | 100 |

The pre-rebrand build measured **64–73** for Performance on the same machine and settings, so
the Performance ≥ 95 target is not met here by either version; this machine's runs also show
~1.7s unthrottled first paint for both builds, which the mobile simulation amplifies. Confirm the
real figure in the CI Lighthouse job. The main remaining cost against the old site is LCP
(~5.4s vs ~4.2s), driven by the larger display-font payload.
