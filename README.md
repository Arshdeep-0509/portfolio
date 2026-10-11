# Arshdeep Singh — Marketing Website

Marketing site for **Arshdeep Singh**, a full-stack, AI and DevOps engineer helping founders and growing businesses build web, mobile and AI products. The site's job is to turn visitors into enquiries through the contact form and discovery-call booking, with WhatsApp and email as secondary channels.

**Stack:** Next.js 16 (App Router, Server Components, Cache Components) · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · lucide-react · react-hook-form + zod · MDX · pnpm.

## Getting started

Requires Node.js ≥ 20.9 and pnpm 10.

```bash
corepack enable pnpm   # once, if pnpm is not installed
pnpm install
cp .env.example .env.local
pnpm dev               # http://localhost:3000
```

## Scripts

| Script                | What it does                                                                         |
| --------------------- | ------------------------------------------------------------------------------------ |
| `pnpm dev`            | Start the dev server                                                                 |
| `pnpm build`          | Generate the Prisma client, then production build (also type-checks)                 |
| `pnpm start`          | Serve the production build                                                           |
| `pnpm lint`           | ESLint (Next.js core-web-vitals + TypeScript), zero warnings allowed                 |
| `pnpm test`           | Vitest unit tests (schemas, utils, consent, rate limiter)                            |
| `pnpm test:e2e`       | Playwright on desktop + mobile against the production build (run `pnpm build` first) |
| `pnpm test:links`     | Broken-link and anchor check across the built site (server on :3100)                 |
| `pnpm placeholders`   | List every unfilled `[PLACEHOLDER]` (`--markdown` for a table)                       |
| `pnpm svg:optimize`   | Run SVGO over `/public` (keeps viewBox and dimensions)                               |
| `pnpm typecheck`      | `tsc --noEmit`                                                                       |
| `pnpm format`         | Prettier, including Tailwind class sorting                                           |
| `pnpm format:check`   | Check formatting without writing (use in CI)                                         |
| `pnpm db:generate`    | Generate the Prisma client (also runs on install)                                    |
| `pnpm db:migrate`     | Apply migrations to `DATABASE_URL` (deploys)                                         |
| `pnpm db:migrate:dev` | Create a new migration after editing `prisma/schema.prisma`                          |
| `pnpm db:studio`      | Browse leads in Prisma Studio                                                        |

## Folder map

```
content/
  work/                    Case studies (.mdx)
  insights/                Blog posts (.mdx)
public/
  images/                  Illustrations and placeholder art (SVG)
  icons/                   Favicon set and app icons
prisma/                    Database schema and migrations (contact-form leads)
src/
  app/
    layout.tsx             Root layout: fonts, metadata, icons, site-wide JSON-LD
    (site)/                All public routes (the group adds no URL segment)
    api/                   Route handlers: contact, careers, newsletter, health
    sitemap.ts robots.ts manifest.ts opengraph-image.tsx rss.xml/
    global-error.tsx not-found.tsx
  components/
    ui/                    Reusable primitives (Button, Card, Modal, form fields…)
    sections/              Page sections, grouped by page
    layout/                Header, Footer, CTA band, consent, analytics, LegalLayout…
  content/                 Typed content: the single source of truth for all copy
    site.ts                Business facts, feature flags, announcement, payments
    navigation.ts          Main nav, mega menu, footer, social links
    services.ts            The 13 services in 4 groups
    legal/                 Privacy, terms, cookie and refund policies
    home.ts about.ts contact.ts careers.ts …   One file per page
  lib/
    seo.ts structuredData.ts og.tsx            Metadata, JSON-LD, share images
    schemas/               Zod schemas shared by forms and API routes
    contact/ careers/      Form back ends (storage, email templates, notifications)
    analytics.ts consent.ts                    Events and the consent store
    mdx.ts mdx-render.tsx  MDX loading and rendering
    utils.ts constants.ts routes.ts …
  instrumentation.ts       Server error reporting
  styles/globals.css       Tailwind + design tokens
tests/
  unit/                    Vitest
  e2e/                     Playwright (desktop + mobile)
scripts/                   Link checker, placeholder finder
deploy/                    Nginx, backups, Let's Encrypt and release scripts (self-hosting)
.github/                   CI, VPS deploy workflow, Dependabot
Dockerfile docker-compose.yml lighthouserc.json
```

## Editing copy

All text and business facts live in `src/content/`. Components only read from there, so you never need to edit a component to change wording.

- **Contact details, location, socials, availability:** `src/content/site.ts`
- **Show or hide sections:** `siteConfig.featureFlags`. Testimonials stay off until real ones exist. Setting `blog: false` turns `/insights` into a 404.
- **Services:** `src/content/services.ts`. The slug becomes the URL `/services/<slug>`, and the nav and footer update automatically.
- **Navigation:** `src/content/navigation.ts`. The Services mega-menu is generated from `services.ts`.
- **Case studies / blog posts:** add an `.mdx` file to `content/work/` or `content/insights/` (see below).

## Case studies and blog posts (MDX)

Each `.mdx` file in `content/work/` (case studies) or `content/insights/` (blog posts) is one page. **The file name is the URL slug.** You don't need any code change: the page, its metadata, the listing card, the sitemap entry and (for posts) the RSS item all come from the file. Files starting with `_` are ignored.

- **Frontmatter is validated** (zod, in `src/lib/mdx.ts`). A missing or mistyped field fails the build with a message naming the file and the field.
  - Case studies: `title, summary, cover, status (live | in-development | concept), client, role, timeline, stack[], categories[] (web, mobile, ai, devops, design), links {live, github}, results[], publishedAt, problem, goals[], architecture {src, alt, caption}, features[] {icon, title, text}, screens[] {src, alt, caption}, nextSteps[], draft`. The MDX body is the "Approach" section. Copy `content/work/client-project-template.mdx` to start.
  - Posts: `title, description, date, updated?, category (MVP | AI | DevOps | Design | Growth), tags[], cover, coverAlt?, featured, draft`.
- **Honesty:** `results` and `client` render only from what's in the frontmatter, and the Results section hides when `results` is empty. Name a client only with written permission.
- **Drafts** (`draft: true`) show in `pnpm dev` with a "Draft" badge. In production they're excluded from listings, the sitemap and RSS, and their URLs return 404. To preview drafts in a production build, set `SHOW_DRAFTS=true` for both `build` and `start`.
- **In MDX:** headings `##`/`###` feed the table of contents. Fenced code blocks get syntax highlighting and a copy button. `<Callout type="info|tip|warning">…</Callout>` is available. Any `[PLACEHOLDER]` text is highlighted on the page.
- **Images:** put them in `public/images/work/` or `public/images/insights/`. Raster covers and screenshots (PNG/JPG/WebP) are optimised and lazy-loaded; SVG placeholders skip optimisation. A real (non-SVG) cover also becomes the page's share image.
- **Empty collections:** with Cache Components, each `[slug]` route must prerender at least one page. If a collection has no published entries, a placeholder slug (`__none`) is prerendered as a 404, so the build still works.

### Newsletter

`POST /api/newsletter` validates the email (zod), ignores bots (honeypot) and rate-limits by IP. It then forwards the address to `NEWSLETTER_WEBHOOK_URL` if that's set (point it at your email provider or an automation). Without it, addresses are appended to `.data/newsletter-subscribers.jsonl`, which is git-ignored and only suitable locally or on a single server. Double opt-in can be added later through the provider.

### Careers

- **Roles and perks.** Roles live in `src/content/careers.ts`. A role appears on the page, in the form's role list and in JobPosting structured data only when it has `isOpen: true` and a `datePosted` date. Closed roles appear nowhere. `benefits` is the only source for perks. Unoffered perks (health insurance, ESOPs, office perks) are kept there as commented-out entries; uncomment one only once it genuinely exists.
- **The form.** It posts multipart data to `POST /api/careers`. The browser and the server validate against the same zod schema (`src/lib/schemas/careerApplication.ts`): resumes must be PDF and at most 5 MB, and the server also checks the file's PDF signature. The route then checks the honeypot, applies an IP rate limit (3 per hour) and verifies Cloudflare Turnstile.
- **Storage and email.** After those checks the route stores the resume privately, saves the application, emails the careers inbox a signed resume link and sends the applicant a confirmation.
- **Services and mocks.** Each external service is optional in development (see `.env.example`):
  - Turnstile: skipped when no keys are set.
  - Resumes: S3, R2 or Supabase Storage via S3, otherwise `.data/careers/resumes/`.
  - Applications: a Supabase table (SQL in `src/lib/careers/applications.ts`), otherwise `.data/careers/applications.jsonl`.
  - Email: Resend, otherwise a mock that writes each email to `.data/outbox/*.html`.
- **Before launch.** Configure every service before launching. Also schedule a job that deletes applications after their `delete_after` date, because the consent text promises a maximum of 12 months.

### Contact form and leads

- **The form.** The /contact form posts JSON to `POST /api/contact`. The browser and the server validate against the same strict zod schema (`src/lib/schemas/contact.ts`); fields the schema doesn't list are rejected. Links can pre-fill "How can I help?" with `?service=<service slug>` or `?topic=<topic>` (the mapping is in `serviceFromQuery`).
- **Spam protection.** Bots get a fake success and nothing is stored or sent when they fill the honeypot or submit within 3 seconds of first focusing the form. After that come Cloudflare Turnstile and a rate limit of 5 per IP per hour (Upstash Redis when configured, otherwise in memory).
- **Storage.** Leads are saved to PostgreSQL through Prisma 7 (`prisma/schema.prisma`, migration in `prisma/migrations`; status defaults to `new`). Without `DATABASE_URL` they go to `.data/leads.jsonl`. First-touch `utm_*` parameters from the landing page are written to a `utm` cookie once the visitor accepts analytics cookies, and saved with each lead.
- **Notifications.** `CONTACT_TO_EMAIL` gets a notification with reply-to set to the lead, and the lead gets an auto-reply with the booking link. Slack and Telegram are pinged if configured. Email uses Resend, then SMTP, then the mock outbox in `.data/outbox/` (shared with the careers form). Errors go to Sentry when `SENTRY_DSN` is set and never reach the browser.
- **Analytics.** `generate_lead` fires only after a successful submit. `whatsapp_click` and `book_call_click` are also sent. All three go through `trackEvent` (`src/lib/analytics.ts`), which does nothing until GA4's `gtag` is on the page — that is, until the visitor accepts analytics cookies.
- **Hidden until configured.** The floating WhatsApp button appears once a real number replaces `[PHONE_WHATSAPP]` in `site.ts`. "Book a 30-min call" opens Calendly once `[CALENDLY_URL]` is set: in a modal on desktop, in a new tab on mobile.

### Legal pages, cookie consent and announcements

> **Before launch, have a lawyer review the legal pages.** The Privacy Policy, Terms & Conditions, Cookie Policy and Refund & Cancellation Policy are starting templates written for how this site actually works (DPDP Act 2023, IT Act 2000, GDPR principles). They are not legal advice. The pages themselves don't carry this disclaimer — this README does.

- **Editing.** The documents live in `src/content/legal/` (`privacy.ts`, `terms.ts`, `cookies.ts`, `refund.ts`) as typed sections. Text supports `[label](/path)` links and `**bold**`. Update `lastUpdated` whenever a document changes. Numbers in brackets such as `[24]` or `[30–50]` are suggestions to confirm, and are marked like any other placeholder.
- **Layout.** `LegalLayout` renders the hero, a sticky table of contents with scroll-spy (generated from the sections), the last-updated date, the document and a closing contact box. Printing hides the site chrome.
- **Cookie consent.** On the first visit a bottom banner offers Accept all, Reject and Customise; the choice is stored in a first-party `consent` cookie for 180 days. Read it anywhere with `useConsent()` from `src/lib/consent.ts`. The footer's "Cookie settings" and the button on /cookie-policy reopen the panel.
- **Analytics.** Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` and/or `NEXT_PUBLIC_CLARITY_PROJECT_ID`. `AnalyticsScripts` loads GA4 and Clarity only after analytics consent, using Google Consent Mode v2 (all signals "denied" by default, then updated). After a rejection nothing is requested from Google or Microsoft; withdrawing consent later disables GA and deletes the analytics cookies. The Cookie Policy table lists GA, Clarity and Turnstile rows only when those tools are configured — keep its inventory in `cookies.ts` in sync with any tool you add.
- **Announcement popup.** Configure `announcement` in `site.ts`. It shows once per visitor per `id` (change the id to show a new announcement), after 8 seconds or 50% scroll, between `startDate` and `endDate` if set. It never appears on /contact, /pay or legal pages, while the cookie banner or settings are open, or in the first 2 seconds on mobile. Until `[CALENDLY_URL]` is set, "Book your slot" goes to the contact form.
- **Payments (/pay).** noindex and not linked in navigation. Set `payments.razorpayPaymentButtonId` in `site.ts` to embed a Razorpay Payment Button, or `paymentLinkUrl` for a Razorpay Payment Link. Card details are handled by Razorpay only.

### Honesty rules

Never invent clients, logos, testimonials, ratings, years of experience, team size, project counts, awards or perks. If proof is missing, use a marked placeholder such as `[ADD REAL TESTIMONIAL]`, or keep the section behind a feature flag.

## Layout

- **Header, mega menu and mobile menu** read from `src/content/navigation.ts`. The Services mega menu and the mobile Services accordion are generated from `services.ts`.
- **CTA band** above the footer: the default copy is in `src/content/ctaBand.ts`. Override it for a page in `ctaBandOverrides`, keyed by pathname. Set a path to `null` to hide the band; it is already hidden on `/contact`.
- **Footer** contact rows show `[PLACEHOLDERS]` as plain text until real values exist, and social icons appear only for profiles with a real URL. "Cookie settings" appears when `featureFlags.cookieConsent` is on (it is). It dispatches the `open-cookie-settings` window event, which the consent panel listens for.
- **404s:** `src/proxy.ts` answers unknown `/services/*`, `/work/*` and `/insights/*` slugs with a real HTTP 404 before rendering starts. Without it, the streamed page would return a 200 "soft 404". Add new dynamic sections to its matcher.

## Design system

Tokens live in `src/styles/globals.css`. Tailwind v4 is configured there with `@theme`; there is no `tailwind.config.ts`. Tailwind's default colour, radius, shadow and font scales are reset, so only the brand tokens exist and a stray `bg-red-500` generates no CSS. Browse every component at `/dev/ui` (dev only).

**Tone.** `<Section background="dark">` adds `.tone-dark` and `background="gradient"` adds `.tone-gradient`. These switch the `tone-*` colours (`text-tone-fg`, `text-tone-muted`, `text-tone-highlight`, `text-tone-accent-text`, `bg-tone-accent`) and the focus-ring colour. Components that use them adapt automatically, and white cards reset to `.tone-light`. The values come from measured contrast:

| Background    | Body / muted text    | Small accent text | Large highlight             | Focus ring  |
| ------------- | -------------------- | ----------------- | --------------------------- | ----------- |
| White / tint  | `--text` / `--muted` | `--primary`       | `--primary`                 | `--primary` |
| Navy (`dark`) | white / `--sky-200`  | `--sky-400`       | `--sky-400`                 | `--sky-400` |
| Hero gradient | white / white        | white             | `--sky-200` (headings only) | white       |

The hero gradient passes through `#1D5FD1`, where `--sky-400` is only 2.7:1 and `--sky-200` is 4.4:1. That is why `--sky-200` is used only for large highlighted words there.

**Rules that keep contrast AA:**

- Don't use `--subtle` text on `--tint` or `--soft` (4.3–4.5:1). Use `--muted`.
- `--success` is for icons and borders only (3.3:1 on white). Status text uses `--success-strong` on `--success-soft`.
- Add any new font-size, radius, shadow or spacing token to the `extendTailwindMerge` config in `src/lib/utils.ts`. Otherwise `cn()` reads e.g. `text-small` as a colour and drops `text-white`.

**Icons.** Content files store lucide icon names (`"Rocket"`). `IconTile`, cards and `Icon` resolve them on the server only (`server-only`). In client components, import icons from `lucide-react` directly.

**Motion.** `MotionConfig reducedMotion="user"` (in `Providers`) plus a global CSS rule turn off movement when the OS asks for reduced motion. Marquee becomes a static wrapped row, and Timeline connectors draw full.

**Keeping JavaScript light.** First-load JavaScript is the main thing holding back the mobile Lighthouse score, so:

- Framer Motion runs through `LazyMotion`. Use `m.*` elements, never `motion.*` (`strict` mode throws if you do). The animation engine loads after first paint.
- `<Reveal>`, `<RevealGroup>` and `<RevealItem index={i}>` render plain HTML with a `data-reveal` attribute. One global `RevealObserver` and CSS do the animation, so reveals add no per-card JavaScript.
- `Timeline` drives its connector fill with a `--progress` CSS variable from a single scroll listener.
- `Tabs` can render a single shared panel (`children` with `value`/`onValueChange`) when tabs only filter one list. This avoids a hidden copy of the content per tab.
- The hero animates in CSS only, and the H1 slides without fading so it counts as painted on the first frame (it's the LCP element).

## SEO, analytics and monitoring

- **Metadata.** Every page calls `buildMetadata()` (`src/lib/seo.ts`) with a unique title (≤ 60 characters; the root layout appends " | Arshdeep Singh — Full-Stack, AI & DevOps Engineer") and description (≤ 155), which also sets the canonical URL and Open Graph/Twitter cards. Share images are generated with `next/og` (`src/lib/og.tsx`): a default plus templates for the services overview, each service, case studies and posts.
- **Structured data.** The root layout outputs one `@graph` with WebSite, ProfessionalService and Person (`src/lib/structuredData.ts`). Placeholder values are left out until they're real. Pages add Service, FAQPage, BreadcrumbList, BlogPosting (posts) and JobPosting (open roles only).
- **Crawling.** `sitemap.xml` (with `lastModified`; bump `CONTENT_UPDATED` in `src/lib/routes.ts` after copy changes), `robots.txt` (blocks `/dev`, `/api`, `/pay`), `manifest.webmanifest` and the icon set in `public/icons/`.
- **Internal links.** Service pages link to three related services, a case study (the newest one whose frontmatter `services:` lists that page, otherwise the most recent under "Recent work") and the contact form. Posts list their `services:` as related services. Unknown slugs fail the build.
- **Analytics events** (GA4 after consent, or Plausible): `cta_click {location, label}` for anything with `data-cta="…"`, `generate_lead {service, budget}`, `whatsapp_click`, `calendly_open`, `service_view {slug}`, `career_apply {role}`, `newsletter_signup` and `outbound_click {url, domain}`. Link clicks are tracked by one listener (`ClickTracking`); call `trackEvent()` from `src/lib/analytics.ts` for anything else. Never put personal data in event parameters.
- **Errors and uptime.** Browser errors, error boundaries, server errors (`src/instrumentation.ts`) and API failures go to Sentry when a DSN is set. `/api/health` reports app and database status for uptime monitors and the Docker health check.
- **Off-site.** Create a **Google Business Profile** with exactly the same business name, phone and address as `site.ts`, and list the site on **LinkedIn, GitHub, Clutch and GoodFirms** with the same details — consistent name, address and phone helps local search. Verify the site in Search Console and submit the sitemap (see DEPLOYMENT.md).

## Security

- Headers in `next.config.ts`: a Content-Security-Policy that allows only the services in use (GA4, Clarity, Turnstile, Calendly, the Google Maps embed, Razorpay, and Sentry/Plausible when configured), HSTS, `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` and `frame-ancestors 'none'`. Scripts need `'unsafe-inline'` because statically generated Next.js pages inline their bootstrap scripts; nonces would make every page dynamic.
- Every API route validates its input with zod on the server. Schema files import `z` from `"zod"` directly, plus `@/lib/schemas/zodJitless` (which turns off zod's eval-based JIT, blocked by the CSP). Don't re-export `z` from a shared module: it defeats tree-shaking and triples zod's client bundle.
- Only `NEXT_PUBLIC_*` variables reach the browser. `pnpm audit` runs in CI; overrides and the two documented exceptions live in `pnpm-workspace.yaml`. Dependabot opens weekly update PRs.

## Testing and CI

- **Unit** (`tests/unit`, Vitest): contact, careers and newsletter schemas; utilities; consent cookie logic; rate limiter.
- **End to end** (`tests/e2e`, Playwright, desktop + mobile): every route returns 200 with one H1, 404s, robots/sitemap/manifest/health, header nav and mega menu, mobile menu, services filter, FAQ accordion, contact form (API mocked) and validation, careers file validation, cookie banner accept/reject, and axe on key pages. Specs use `tests/e2e/fixtures.ts`, which pre-answers the cookie banner and hides the announcement popup.
- **Links and performance:** `pnpm test:links` crawls the built site; `lighthouserc.json` sets the Lighthouse CI budgets for `/`, `/services` and `/contact`.
- **CI** (`.github/workflows/ci.yml`) runs all of it on every pull request. Make "CI / verify" a required check to block merging on failure.

## Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)**: Vercel (Option 1) or a self-hosted VPS with Docker, PostgreSQL, Nginx and Let's Encrypt, deployed from GitHub Actions with zero downtime (Option 2). It also covers email deliverability (SPF/DKIM/DMARC), monitoring, backups and branch protection. Before launch, work through **[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)**.

## Placeholders to replace before launch

Run `pnpm placeholders` to list every unfilled `[PLACEHOLDER]` with the files it appears in. The grouped to-do list is in [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md). Also set `NEXT_PUBLIC_SITE_URL` in the hosting environment until `siteConfig.url` holds the real domain.

## Notes for contributors

- Server Components by default. Add `"use client"` only where interactivity needs it.
- `/pay` and `/dev/ui` are `noindex`. `/dev/ui` returns 404 in production.
- The `[slug]` pages export `instant = false`. They await `params` at the top so unknown slugs return a real HTTP 404, and every valid slug is prerendered at build time.
- This Next.js version differs from older docs. Check `node_modules/next/dist/docs/` (see `AGENTS.md`).
