# Launch checklist

Work through this before pointing `[DOMAIN]` at the site. Items marked ✅ were verified while
building the site (October 2026); the rest need the owner. Re-run `pnpm placeholders` at the end:
it should list nothing you intend to keep.

## 1. Fill every placeholder

`pnpm placeholders` lists all unfilled `[PLACEHOLDERS]` (57 at the last update; the full
table is in the [appendix](#appendix-every-placeholder)). Grouped by what you need to decide:

- [ ] **Business facts** (`src/content/site.ts`): `[DOMAIN]`, `[LEGAL_ENTITY]`, `[STATE]`,
      `[CALENDLY_URL]`, `[EDUCATION]`, and the social URLs (`[LINKEDIN_URL]`,
      `[GITHUB_URL]`, `[X_URL]`, `[INSTAGRAM_URL]`, `[YOUTUBE_URL]` — unused ones can stay, they're
      hidden). `[GSTIN]` only if registered (it's commented out).
- [ ] **Legal pages** (`src/content/legal/*.ts`): `[ADDRESS]`, the Grievance Officer's `[NAME]`,
      the response time `[X]` days, the providers (`[HOSTING_PROVIDER]`, `[DATABASE_PROVIDER]`,
      `[STORAGE_PROVIDER]`, `[EMAIL_PROVIDER]`), and every bracketed number (`[24]`, `[12]`, `[7]`,
      `[10]`, `[15]`, `[1.5]`, `[30]`, `[30–50]`, `[3]`, `[8]`, `[14]`) — confirm or change each.
- [ ] **Service details**: `src/content/servicesPage.ts` → `[TYPICAL_TIMELINE]`,
      `[SUPPORT_WINDOW]`; `src/content/approach.ts` → the `[30]`-day bug-fix window.
- [ ] **About page** (`src/content/about.ts`): `[CONFIRM NAME MEANING]`.
- [ ] **Case studies** (`content/work/*.mdx`): every `[ADD DETAILS — …]` and the
      "what next" lines. Confirm each `stack:` list, and the trading platform's `status` and
      `client`, match reality. Keep `results: []` until there are real, verifiable numbers. New
      client projects start from `content/templates/case-study.mdx`.
- [ ] **Journal** is switched off (`featureFlags.blog: false` hides the page, nav links, sitemap
      entries and feed items). Before turning it back on: the posts (`content/journal/*.mdx`) are
      drafts with `[TO WRITE]` sections — finish one or more and set `draft: false`.
- [ ] **Payments** (`site.ts` → `payments`): `[RAZORPAY_PAYMENT_BUTTON_ID]` or
      `[RAZORPAY_PAYMENT_LINK]` — or leave `/pay` unused (it's noindex and unlinked).
- [ ] **Testimonials** stay hidden (`featureFlags.testimonials: false`) until you have real ones,
      with permission. Never invent them.
- [ ] Set `availability` in `site.ts` (`available`, `limited` or `booked`).

## 2. Brand assets

- [x] Favicon set (16/32/48 ICO, 180 apple-touch, 192, 512, maskable 512, SVG) and a web manifest
      with theme colour `#0B2545`, generated from the "AS" monogram in `public/icons/`. Replace
      them with designer-made files if you get a logo.
- [x] Open Graph images generated per page type (default, services, service, case study, post)
      with the brand gradient, monogram, title and URL.
- [ ] A real portrait photo (add it under `public/images/`, then set `founder.photo` in `site.ts`).
- [ ] Optional: real artwork in place of the placeholder illustrations and case-study covers.

## 3. Legal and business

- [ ] **Have a lawyer review** the Privacy Policy, Terms & Conditions, Cookie Policy and Refund
      Policy. They're templates aligned with the DPDP Act 2023, the IT Act 2000 and GDPR
      principles — not legal advice.
- [ ] Business name, address and GSTIN (if any) identical in `site.ts`, the legal pages, invoices,
      the Google Business Profile, Razorpay and LinkedIn.
- [ ] Appoint and name the Grievance Officer, and set up the inbox for privacy requests.
- [x] Cookie banner: no analytics before consent; "Reject" sends no requests to Google or
      Microsoft; the footer's "Cookie settings" reopens the panel (tested).
- [ ] Schedule deletion of careers applications after 12 months and leads after 24 months, as the
      Privacy Policy promises — for example a monthly SQL job:
      `delete from leads where created_at < now() - interval '24 months';`

## 4. Services and forms in production

- [ ] Production environment variables set (see [DEPLOYMENT.md](DEPLOYMENT.md)): database,
      Resend or SMTP, real Turnstile keys, Upstash, resume storage, Sentry, GA4.
- [ ] `pnpm db:migrate` run against the production database.
- [ ] Send the **contact form** on the live site: notification at `CONTACT_TO_EMAIL`, auto-reply
      received, row in the `leads` table, `generate_lead` in GA4 DebugView (after accepting
      analytics).
- [ ] Send a **careers application** with a small PDF: notification with a working signed resume
      link, confirmation email, row in `career_applications`.
- [ ] Newsletter sign-ups reach `NEWSLETTER_WEBHOOK_URL` (or the newsletter is turned off).
- [ ] SPF, DKIM and DMARC all **PASS** in Gmail's "Show original"; mail-tester.com 9/10 or more;
      emails land in the inbox, not spam.
- [x] Contact and careers forms validated end to end in development and in Docker (Postgres row
      created, both emails rendered by the mock provider).

## 5. Domain, redirects, HTTPS

- [ ] DNS for `[DOMAIN]` and `www.[DOMAIN]`; HTTPS certificate issued.
- [ ] `www` → apex **301** and HTTP → HTTPS **301** (Vercel: make the apex the primary domain;
      self-hosted: built into Nginx and tested locally).
- [ ] `siteConfig.url` set to `https://[DOMAIN]` (or `NEXT_PUBLIC_SITE_URL`), so canonicals, the
      sitemap and Open Graph URLs use the real domain. Check `view-source:` on a page.
- [ ] Any URLs from a previous site 301-redirected (add a `redirects()` entry in
      `next.config.ts`).

## 6. Search and listings

- [ ] Search Console verified (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`) and
      `https://[DOMAIN]/sitemap.xml` submitted; the same in Bing Webmaster Tools.
- [ ] Google Business Profile created with **exactly** the same name, phone and address as the
      site (consistency matters for local search), a fitting category, service areas, the site
      link and a few real photos.
- [ ] Listed on LinkedIn (company page and profile), GitHub (profile README linking the site),
      Clutch and GoodFirms — same name, address and phone everywhere.
- [ ] Google's Rich Results Test (search.google.com/test/rich-results) on `/`, a service page and
      `/contact` once live: WebSite, ProfessionalService, Person, Service, FAQPage and
      BreadcrumbList detected without errors.
- [x] Unique titles (≤ 60 characters before the site suffix) and descriptions (≤ 155) on every
      page; canonical, Open Graph and Twitter tags; `robots.txt`; sitemap with `lastmod` (audited).

## 7. Monitoring

- [ ] UptimeRobot or Better Stack monitors on `/` and `/api/health`, alerting email and phone.
- [ ] Sentry receiving events (trigger one test error).
- [ ] GA4 receiving events after consent; key events marked (`generate_lead`, …).
- [ ] Self-hosted only: first nightly backup visible in the bucket, and one test restore done.

## 8. Quality gates (re-run before launch)

- [x] `pnpm lint` (zero warnings), `pnpm typecheck`, `pnpm format:check`
- [x] `pnpm test` — 38 unit tests
- [x] `pnpm test:e2e` — 35 Playwright tests across desktop and mobile
- [x] `pnpm test:links` — no broken internal links or anchors
- [x] axe (WCAG 2.2 AA) on every route at desktop, mobile and 200% zoom — 0 violations
- [x] `pnpm audit` — clean apart from two documented advisories with no fix that production can't
      reach
- [x] Lighthouse CI budgets pass
- [ ] Branch protection: CI required before merging to `main` (see DEPLOYMENT.md)

---

## Appendix: every placeholder

Generated by `pnpm placeholders --markdown`.

| Placeholder                                                                  | Where                                                                                                                                                        |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `[1.5]`                                                                      | `src/content/legal/terms.ts`                                                                                                                                 |
| `[10]`                                                                       | `src/content/legal/refund.ts`, `src/content/legal/terms.ts`                                                                                                  |
| `[12]`                                                                       | `src/content/legal/privacy.ts`                                                                                                                               |
| `[14]`                                                                       | `src/content/legal/privacy.ts`                                                                                                                               |
| `[15]`                                                                       | `src/content/legal/refund.ts`, `src/content/legal/terms.ts`                                                                                                  |
| `[24]`                                                                       | `src/content/legal/privacy.ts`                                                                                                                               |
| `[3]`                                                                        | `src/content/legal/refund.ts`                                                                                                                                |
| `[30–50]`                                                                    | `src/content/legal/refund.ts`, `src/content/legal/terms.ts`                                                                                                  |
| `[30]`                                                                       | `src/content/approach.ts`, `src/content/legal/privacy.ts`, `src/content/legal/terms.ts`                                                                      |
| `[7]`                                                                        | `src/content/legal/refund.ts`, `src/content/legal/terms.ts`                                                                                                  |
| `[8]`                                                                        | `src/content/legal/privacy.ts`                                                                                                                               |
| `[ADD — what you would build or change next, and why]`                       | `content/work/ima-banjara-hills.mdx`, `content/work/trading-platform.mdx`                                                                                    |
| `[ADD DETAILS — how applications reach the branch and how they're handled.]` | `content/work/ima-banjara-hills.mdx`                                                                                                                         |
| `[ADD REAL TESTIMONIAL]`                                                     | `src/content/testimonials.ts`, `src/components/sections/home/Testimonials.tsx`                                                                               |
| `[ADDRESS]`                                                                  | `src/content/legal/privacy.ts`, `src/content/legal/refund.ts`, `src/content/legal/terms.ts`                                                                  |
| `[ARCHITECTURE DIAGRAM]`                                                     | `public/images/work/architecture-placeholder.svg`                                                                                                            |
| `[CALENDLY_URL]`                                                             | `src/content/site.ts`                                                                                                                                        |
| `[CITY]`                                                                     | `src/components/ui/PlaceholderText.tsx`                                                                                                                      |
| `[CLIENT NAME — only with written permission]`                               | `content/templates/case-study.mdx`                                                                                                                           |
| `[CLIENT PROJECT — publish only with the client's written permission]`       | `content/templates/case-study.mdx`                                                                                                                           |
| `[CLIENT_COMPANY]`                                                           | `src/content/testimonials.ts`                                                                                                                                |
| `[CLIENT_NAME]`                                                              | `src/content/testimonials.ts`                                                                                                                                |
| `[CLIENT_ROLE]`                                                              | `src/content/testimonials.ts`                                                                                                                                |
| `[CONFIRM NAME MEANING]`                                                     | `src/content/about.ts`                                                                                                                                       |
| `[COVER IMAGE]`                                                              | `public/images/journal/cover-placeholder.svg`, `public/images/work/client-project-cover.svg`                                                                 |
| `[DATABASE_PROVIDER]`                                                        | `src/content/legal/privacy.ts`                                                                                                                               |
| `[DETAILS OF THE ESOP POOL]`                                                 | `src/content/collaborate.ts`                                                                                                                                 |
| `[DETAILS OF THE PLAN]`                                                      | `src/content/collaborate.ts`                                                                                                                                 |
| `[DOMAIN]`                                                                   | `src/content/site.ts`                                                                                                                                        |
| `[EDUCATION]`                                                                | `src/content/site.ts`                                                                                                                                        |
| `[EMAIL_PROVIDER]`                                                           | `src/content/legal/privacy.ts`                                                                                                                               |
| `[GITHUB_URL]`                                                               | `src/content/site.ts`                                                                                                                                        |
| `[GOAL]`                                                                     | `content/templates/case-study.mdx`                                                                                                                           |
| `[GSTIN]`                                                                    | `src/content/site.ts`                                                                                                                                        |
| `[HOSTING_PROVIDER]`                                                         | `src/content/legal/privacy.ts`                                                                                                                               |
| `[INSTAGRAM_URL]`                                                            | `src/content/site.ts`                                                                                                                                        |
| `[LEGAL_ENTITY]`                                                             | `src/content/legal/privacy.ts`, `src/content/legal/refund.ts`, `src/content/legal/terms.ts`, `src/content/site.ts`                                           |
| `[LINKEDIN_URL]`                                                             | `src/content/site.ts`                                                                                                                                        |
| `[NAME]`                                                                     | `src/content/legal/privacy.ts`                                                                                                                               |
| `[ONE-LINE OUTCOME — what the project achieved, in plain words]`             | `content/templates/case-study.mdx`                                                                                                                           |
| `[PHOTO]`                                                                    | `public/images/founder-placeholder.svg`                                                                                                                      |
| `[RAZORPAY_PAYMENT_BUTTON_ID]`                                               | `src/content/site.ts`                                                                                                                                        |
| `[RAZORPAY_PAYMENT_LINK]`                                                    | `src/content/site.ts`                                                                                                                                        |
| `[SCREENSHOT]`                                                               | `public/images/work/screen-placeholder.svg`                                                                                                                  |
| `[STATE]`                                                                    | `src/content/legal/privacy.ts`, `src/content/legal/refund.ts`, `src/content/legal/terms.ts`, `src/content/site.ts`                                           |
| `[STORAGE_PROVIDER]`                                                         | `src/content/legal/privacy.ts`                                                                                                                               |
| `[THE PROBLEM — what wasn't working, for whom]`                              | `content/templates/case-study.mdx`                                                                                                                           |
| `[TIMELINE]`                                                                 | `content/templates/case-study.mdx`                                                                                                                           |
| `[TO WRITE]`                                                                 | `content/journal/adding-ai-without-burning-your-budget.mdx`, `content/journal/how-to-scope-an-mvp.mdx`, `content/journal/nextjs-react-native-or-flutter.mdx` |
| `[TYPICAL_TIMELINE]`                                                         | `src/content/servicesPage.ts`                                                                                                                                |
| `[WHAT I'VE BUILT — real projects only]`                                     | `src/components/ui/PlaceholderText.tsx`                                                                                                                      |
| `[WHAT YOU WOULD DO NEXT]`                                                   | `content/templates/case-study.mdx`                                                                                                                           |
| `[WHATSAPP_URL]`                                                             | `src/content/site.ts`                                                                                                                                        |
| `[X_URL]`                                                                    | `src/content/site.ts`                                                                                                                                        |
| `[X]`                                                                        | `src/content/legal/privacy.ts`                                                                                                                               |
| `[YOUR ROLE]`                                                                | `content/templates/case-study.mdx`                                                                                                                           |
| `[YOUTUBE_URL]`                                                              | `src/content/site.ts`                                                                                                                                        |
