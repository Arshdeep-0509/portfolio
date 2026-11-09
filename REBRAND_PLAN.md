# Polestride rebrand plan

Audit of the repo before any code changes. Nothing in this step changed code; this file is the only addition.

- **Audited:** branch `rebrand/skylamp` at `c2373c6`, 2026-11-07
- **From / to:** "Arshdeep Singh" (the Skylamp identity) to "Polestride", per the brand brief
- **Rule in force:** page copy, services, steps, FAQs, stack, legal text and structure stay. Only the name, theme, logo and technical SEO change unless a prompt says otherwise.

## Read this first

Findings that change how the rebrand should be done:

1. **The canonical bug has one root cause and a one-line fix.** `siteConfig.url` is still `https://[DOMAIN]`, so `SITE_URL` falls back to localhost (section 3).
2. **The brief's light-mode colours fail the repo's contrast rule.** `#C4881A` on Glacier is 2.68:1 and Slate Mist on Glacier is 2.48:1. Both fail for text (section 4).
3. **"Mono only in build.log and file-tree" touches 144 places.** `label-mono` is used 97 times in 49 files and `font-mono` 47 times in 28 files (section 5).
4. **Sora has no italic.** Headline emphasis currently depends on Fraunces Italic and needs a new treatment (section 5).
5. **A find-and-replace on the name would produce wrong sentences.** Some strings use the name as a person ("Polestride, a full-stack … engineer"), and the default title and manifest name pair the brand with `founder.role` (section 2, risk R3).
6. **The logo files don't exist yet.** There is no `public/brand/` folder.
7. **Do not rename the Docker Compose project.** It would orphan the Postgres volume (risk R6).

## Decisions needed from you

Each has a recommendation, which the plan assumes unless you say otherwise.

| #   | Decision                                                                                                                                                  | Recommendation                                                                                                                                                                                                                                                        | Needed by |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| D1  | Light-mode accent and muted text fail AA at the brief's values.                                                                                           | Keep the brief's colours for dark surfaces and decoration. Add AA tints for text on Glacier: gold `#916513` (4.53:1), muted `#626E83` (4.53:1), link teal `#35776D` (4.61:1). The Skylamp rebrand set the same precedent.                                             | Prompt 1  |
| D2  | `label-mono` labels (97 uses) conflict with "mono only in build.log and file-tree".                                                                       | Follow the brief: move `label-mono` to Manrope, keeping its uppercase and tracking. Allow one exception: real code in MDX (`.prose code`, `.prose pre`) stays mono.                                                                                                   | Prompt 2  |
| D3  | Headline `<em>` has no Sora italic.                                                                                                                       | Upright Sora with a thin gold underline, and `font-style: normal` so the browser doesn't fake a slant.                                                                                                                                                                | Prompt 2  |
| D4  | Logo SVG and PNG files: will you supply them, or should I draw them from the brief?                                                                       | If you have them, add them to `public/brand/`. Otherwise I draw the SVGs and you approve them before anything depends on them.                                                                                                                                        | Prompt 3  |
| D5  | What fills `[LEGAL_ENTITY]`? It appears in the footer copyright, legal pages and JSON-LD. I won't guess this.                                             | If there is no registered company, "Polestride" reads correctly as "Arshdeep Singh, trading as Polestride". If there is one, use its exact registered name. Razorpay, GST and invoices should match.                                                                  | Prompt 4  |
| D6  | First-person voice stays under a company brand: about 280 lines in `src/content` use I/me/my.                                                             | Keep it, as your rule says. A founder-led brand can speak as "I" if the founder is named near the top, which D7 does.                                                                                                                                                 | Prompt 4  |
| D7  | Hero label `Arshdeep Singh — engineer for founders & growing teams` (`src/content/home.ts:31`).                                                           | Keep it as is. The brand is in the header above it, and it explains who "I" is in the headline below.                                                                                                                                                                 | Prompt 4  |
| D8  | About headline "Arsh means sky. Deep means lamp." (`src/content/about.ts:18`) is the Skylamp concept, and `[CONFIRM NAME MEANING]` still shows beside it. | Keep it as the founder's story, since your rule protects copy. Confirm the meaning so the placeholder can go. Only you can confirm it.                                                                                                                                | Prompt 11 |
| D9  | Which branch, and where does the live site deploy from?                                                                                                   | Create `rebrand/polestride` from this branch. `main` still sits at the first commit (280 files differ), so tell me whether production builds from `main`, this branch or elsewhere, and whether it is Vercel or the VPS. That decides where the env changes are made. | Prompt 1  |

## 1. Stack inventory

| Area             | What's in the repo                                                                                                                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework        | Next.js 16.4.0, React 19.3.0, TypeScript 5, pnpm 10.18, Node ≥ 20.9                                                                                                                                                                   |
| Router           | App Router in `src/app`, with a `(site)` route group. `cacheComponents` and `partialPrefetching` on. `src/proxy.ts` returns real 404s for unknown slugs                                                                               |
| Styling          | Tailwind CSS v4, configured in CSS. **There is no `tailwind.config`**: tokens are CSS variables in `src/styles/globals.css`, mapped with `@theme inline`. Typography plugin. No CSS modules. `cva`, `clsx`, extended `tailwind-merge` |
| Surfaces         | No light/dark toggle. Sections set `.tone-night`, `.tone-ivory` or `.tone-sand`, which define `--fg`, `--accent` and similar. `viewport.colorScheme` is `light`                                                                       |
| Fonts            | `next/font/google` in `src/app/layout.tsx`, self-hosted at build, exposed as CSS variables                                                                                                                                            |
| Animation        | `framer-motion` ^14 through `LazyMotion` (3 files import it), CSS reveals (`[data-reveal]`, `RevealObserver`), CSS preloader and build log                                                                                            |
| Forms            | `react-hook-form`, `zod` 4, `@hookform/resolvers`, Cloudflare Turnstile. Route handlers: `/api/contact`, `/api/careers`, `/api/newsletter`                                                                                            |
| Data and email   | Prisma 7 + Postgres for leads. Resend, then SMTP (nodemailer), then a local mock outbox. Upstash rate limiting. S3-compatible resume storage. Slack and Telegram pings                                                                |
| Analytics        | GA4 with Consent Mode v2 and Microsoft Clarity after consent, optional Plausible, Sentry via a custom envelope. All env-driven; no IDs in the repo                                                                                    |
| Content          | No CMS. Page copy is TypeScript in `src/content/*`. Case studies and journal posts are MDX in `content/` (`gray-matter`, `@mdx-js/mdx`, `rehype-pretty-code`, `shiki`). `featureFlags.blog` is `false`                                |
| Tests and checks | Vitest, Playwright, axe. CI runs lint, typecheck, format check, unit, audit, build, e2e and links. `pnpm contrast` and `pnpm originality` are **not** in CI                                                                           |
| Deployment       | Documented two ways: Vercel, or Docker Compose + Nginx on a VPS (`deploy/`, `.github/workflows/deploy-vps.yml`)                                                                                                                       |

## 2. Every place the brand name appears

Searched all tracked text files, case-insensitively (the lockfile and binary files are excluded). Tables are generated from the repo at `c2373c6`.

| Term                 | Matching lines | Files |
| -------------------- | -------------- | ----- |
| `Arshdeep`           | 53             | 27    |
| `Singh`              | 37             | 21    |
| `ENGINEER · BUILDER` | 3              | 3     |
| `portfolio`          | 26             | 9     |
| `[LEGAL_ENTITY]`     | 9              | 5     |
| `vercel.app`         | 0              | 0     |
| `localhost`          | 13             | 8     |

A line matching two terms can appear in two buckets. ⚠ marks a string where a straight swap would read wrong, so it needs a rewrite or a decision.

### (a) Brand name: becomes Polestride

| File:line                                              | Exact string                                                                                           | Action                                                                                                                                                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.env.example:67`                                      | `…in you've verified with your provider, e.g. "Arshdeep Singh <hello@[DOMAIN]>"`                       | Example sender → `Polestride <hello@polestride.com>`                                                                                                                                               |
| `public/icons/icon.svg:1`                              | `…0 0 512 512" width="512" height="512"><title>Arshdeep Singh</title>`                                 | Regenerated by `pnpm icons`                                                                                                                                                                        |
| `README.md:1`                                          | `# Arshdeep Singh — Marketing Website`                                                                 | Docs                                                                                                                                                                                               |
| `README.md:3`                                          | `Marketing site for **Arshdeep Singh**, a full-stack, AI and DevOps enginee…`                          | Docs                                                                                                                                                                                               |
| `README.md:185`                                        | `…≤ 60 characters; the root layout appends " \| Arshdeep Singh") and description (≤ 155), which also…` | Docs: suffix becomes ` \| Polestride`                                                                                                                                                              |
| `scripts/generate-icons.mjs:33`                        | `title ? "<title>Arshdeep Singh</title>" : ""`                                                         | SVG `<title>` → Polestride                                                                                                                                                                         |
| `src/app/(site)/journal/[slug]/opengraph-image.tsx:7`  | `export const alt = "A journal post by Arshdeep Singh";`                                               | `A journal post from Polestride`                                                                                                                                                                   |
| `src/app/(site)/services/[slug]/opengraph-image.tsx:6` | `export const alt = "A service offered by Arshdeep Singh";`                                            | `A service offered by Polestride`                                                                                                                                                                  |
| `src/app/(site)/services/opengraph-image.tsx:6`        | `export const alt = "Services from Arshdeep Singh, engineer in India";`                                | `Services from Polestride, in Bengaluru, India`                                                                                                                                                    |
| `src/app/(site)/work/[slug]/opengraph-image.tsx:7`     | `export const alt = "A case study by Arshdeep Singh";`                                                 | `A case study by Polestride`                                                                                                                                                                       |
| `src/components/layout/Logo.tsx:68`                    | `/** Show "ENGINEER · BUILDER · AI & CLOUD" under the wordmark. */`                                    | Remove with the `subline` prop                                                                                                                                                                     |
| `src/components/layout/Logo.tsx:74`                    | `/** Home link: the mark plus "Arshdeep Singh" in Fraunces 600. The accessible name…`                  | Comment; goes with the Logo rewrite                                                                                                                                                                |
| `src/content/collaborate.ts:207`                       | `…Freelance, contract and internship work with Arshdeep Singh, plus partnerships for agencies: remot…` | ⚠ `… work with Polestride, plus partnerships for agencies …`                                                                                                                                       |
| `src/content/home.ts:27`                               | `…e apps and AI integration for startups, from Arshdeep Singh — full-stack, AI and DevOps.",`          | ⚠ Rewrite so it still names who builds it: `… from Polestride, led by Arshdeep Singh — full-stack, AI and DevOps.`                                                                                 |
| `src/content/pay.ts:9`                                 | `"Settle an invoice or an advance with Arshdeep Singh via Razorpay's secure checkout.",`               | ⚠ `… with Polestride …`, if invoices and Razorpay carry that name (D5)                                                                                                                             |
| `src/content/site.ts:74`                               | `name: "Arshdeep Singh",`                                                                              | `siteConfig.name` → `Polestride`                                                                                                                                                                   |
| `src/content/site.ts:78`                               | `"Arshdeep Singh, a full-stack, AI and DevOps engineer…`                                               | ⚠ Rewrite: `Polestride builds web apps, mobile apps and AI features for founders and small teams in India, led by full-stack, AI and DevOps engineer Arshdeep Singh — tidy code, steady releases.` |
| `src/content/site.ts:97`                               | `wordmark: "Arshdeep Singh",`                                                                          | `brand.wordmark` → `Polestride`                                                                                                                                                                    |
| `src/content/site.ts:98`                               | `microTagline: "ENGINEER · BUILDER · AI & CLOUD",`                                                     | Remove with the `subline` prop; the tagline replaces it                                                                                                                                            |
| `src/lib/email.ts:10`                                  | `*    domain verified in Resend, e.g. "Arshdeep Singh <hello@yourdomain>".`                            | Comment example, same change                                                                                                                                                                       |
| `tests/e2e/preloader.spec.ts:10`                       | `…ader.locator(".preloader-name")).toHaveText("Arshdeep Singh");`                                      | Test: update with the preloader (R1)                                                                                                                                                               |

### (b) Founder references: stay as Arshdeep Singh

| File:line                         | Exact string                                                                                           | Why it stays                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `src/content/about.ts:13`         | `"Arshdeep Singh is a full-stack developer in Bengaluru…`                                              | About page text about the person                             |
| `src/content/about.ts:24`         | `…cv: { label: "Download my CV", href: "/cv/arshdeep-singh.pdf" },`                                    | CV path. The file doesn't exist yet, so the button is hidden |
| `src/content/about.ts:25`         | `photoAlt: "Arshdeep Singh, photographed for this page",`                                              | Founder photo alt text                                       |
| `src/content/home.ts:31`          | `label: "Arshdeep Singh — engineer for founders & growing team…`                                       | ⚠ Hero label: keep, per D7                                   |
| `src/content/legal/privacy.ts:20` | `text: 'This website is run by Arshdeep Singh, trading as [LEGAL_ENTITY], an IT serv…`                 | Legal identity of the operator (D5 fills the rest)           |
| `src/content/legal/terms.ts:30`   | `…this website and to the services provided by Arshdeep Singh, trading as [LEGAL_ENTITY], [ADDRESS],…` | Legal identity of the operator (D5 fills the rest)           |
| `src/content/site.ts:101`         | `name: "Arshdeep Singh",`                                                                              | `founder.name`                                               |
| `src/content/site.ts:103`         | `photo: "/images/arshdeep-singh.jpg",`                                                                 | Founder photo path                                           |

**Contact email: keep exactly, as the brief says.** It contains the founder's name but isn't a brand use.

| File:line                          | Exact string                                                                                           | Action |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ | ------ |
| `src/content/legal/cookies.ts:216` | `…: "p", text: "Questions about cookies? Email arshdeepsinghdev96@gmail.com." }],`                     | Keep   |
| `src/content/legal/privacy.ts:129` | `…"**Forms and applications:** email arshdeepsinghdev96@gmail.com and ask me to stop using…`           | Keep   |
| `src/content/legal/privacy.ts:262` | `…text: "**How to exercise them:** email arshdeepsinghdev96@gmail.com with the subject \"Priva…`       | Keep   |
| `src/content/legal/privacy.ts:272` | `…elieve a child has sent me their data, email arshdeepsinghdev96@gmail.com and I'll delete it. Appl…` | Keep   |
| `src/content/legal/privacy.ts:322` | `"**Email:** arshdeepsinghdev96@gmail.com",`                                                           | Keep   |
| `src/content/legal/refund.ts:101`  | `'Email arshdeepsinghdev96@gmail.com with the subject "Refund…`                                        | Keep   |
| `src/content/legal/refund.ts:118`  | `…"Questions about payments or refunds? Email arshdeepsinghdev96@gmail.com or write to [LEGAL_ENTIT…`  | Keep   |
| `src/content/legal/terms.ts:253`   | `…text: "Questions about these terms? Email arshdeepsinghdev96@gmail.com or write to [LEGAL_ENTIT…`    | Keep   |
| `src/content/site.ts:82`           | `email: "arshdeepsinghdev96@gmail.com",`                                                               | Keep   |

### (c) URLs and domains

There are no `vercel.app` strings anywhere in the repo. `localhost` hits:

| File:line                     | Exact string                                                                           | Action                                                                         |
| ----------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `.env.example:2`              | `NEXT_PUBLIC_SITE_URL=http://localhost:3000`                                           | Keep for local development. Overrides `site.ts`, so never use it in production |
| `.github/workflows/ci.yml:21` | `NEXT_PUBLIC_SITE_URL: http://localhost:3100`                                          | CI, keep                                                                       |
| `.github/workflows/ci.yml:67` | `npx --yes wait-on@8 http://localhost:3100/api/health`                                 | CI, keep                                                                       |
| `lighthouserc.json:8`         | `"http://localhost:3100/",`                                                            | CI, keep                                                                       |
| `lighthouserc.json:9`         | `"http://localhost:3100/services",`                                                    | CI, keep                                                                       |
| `lighthouserc.json:10`        | `"http://localhost:3100/contact"`                                                      | CI, keep                                                                       |
| `next.config.ts:77`           | `…uld break local production testing on http://localhost.`                             | Comment, keep                                                                  |
| `playwright.config.ts:17`     | ``baseURL: `http://localhost:${PORT}`,``                                               | Test config, keep                                                              |
| `playwright.config.ts:26`     | ``url: `http://localhost:${PORT}/api/health`,``                                        | Test config, keep                                                              |
| `README.md:15`                | `pnpm dev               # http://localhost:3000`                                       | Docs, keep                                                                     |
| `scripts/check-links.mjs:10`  | `…onst BASE = (process.env.BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");`   | Test tool, keep                                                                |
| `src/lib/constants.ts:11`     | `* NEXT_PUBLIC_SITE_URL, then localhost. That keeps metadataBase and canonicals from…` | Comment, keep                                                                  |
| `src/lib/constants.ts:16`     | `…process.env.NEXT_PUBLIC_SITE_URL \|\| "http://localhost:3000"`                       | **Source of the bug.** Removed in the brand config step (section 3)            |

Outside your search terms, these also hold the domain:

| Where                                  | Value               | Action                                                        |
| -------------------------------------- | ------------------- | ------------------------------------------------------------- |
| `src/content/site.ts:81`               | `https://[DOMAIN]`  | Set to `https://polestride.com`. This is the fix in section 3 |
| `src/lib/og.tsx:18`                    | `[DOMAIN]` fallback | Resolves itself once `site.ts` is real                        |
| `deploy/production.env.example:6-8`    | `example.com`       | Update the example; set real values on the server             |
| `DEPLOYMENT.md`, `LAUNCH_CHECKLIST.md` | `[DOMAIN]`          | Docs, prompt 12                                               |

### (d) Placeholders

`[LEGAL_ENTITY]` hits:

| File:line                          | Exact string                                                                                                 | Action                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `LAUNCH_CHECKLIST.md:12`           | ``…acts** (`src/content/site.ts`): `[DOMAIN]`, `[LEGAL_ENTITY]`, `[STATE]`,``                                | Docs; updates when filled                          |
| `LAUNCH_CHECKLIST.md:164`          | ``\| `[LEGAL_ENTITY]`…``                                                                                     | Docs; updates when filled                          |
| `src/content/legal/privacy.ts:20`  | `…website is run by Arshdeep Singh, trading as [LEGAL_ENTITY], an IT services business based in Bengaluru,…` | Fill from D5                                       |
| `src/content/legal/privacy.ts:45`  | `…a is processed. For this website, that's me, [LEGAL_ENTITY].",`                                            | Fill from D5                                       |
| `src/content/legal/privacy.ts:323` | `"**Address:** [LEGAL_ENTITY], [ADDRESS], Bengaluru, [STATE], India",`                                       | Fill from D5                                       |
| `src/content/legal/refund.ts:118`  | `…ail arshdeepsinghdev96@gmail.com or write to [LEGAL_ENTITY], [ADDRESS], Bengaluru, [STATE], India.",`      | Fill from D5                                       |
| `src/content/legal/terms.ts:30`    | `…vices provided by Arshdeep Singh, trading as [LEGAL_ENTITY], [ADDRESS], Bengaluru, [STATE], India ("I",…`  | Fill from D5                                       |
| `src/content/legal/terms.ts:253`   | `…ail arshdeepsinghdev96@gmail.com or write to [LEGAL_ENTITY], [ADDRESS], Bengaluru, [STATE], India.",`      | Fill from D5                                       |
| `src/content/site.ts:75`           | `legalName: "[LEGAL_ENTITY]",`                                                                               | Source value (D5). Drives the footer © and JSON-LD |

The other placeholders that relate to this work:

| Placeholder                                                  | Where                                          | Status                             |
| ------------------------------------------------------------ | ---------------------------------------------- | ---------------------------------- |
| `[DOMAIN]`                                                   | `src/content/site.ts:81`, plus deployment docs | Brief answers it: `polestride.com` |
| `[STATE]`                                                    | `src/content/site.ts`, legal files (7 uses)    | Brief answers it: `Karnataka`      |
| `[ADDRESS]`                                                  | Legal files (4 uses)                           | Not in the brief; still open       |
| `[CONFIRM NAME MEANING]`                                     | `src/content/about.ts:20`                      | See D8                             |
| `[CALENDLY_URL]`, social URLs, `[EDUCATION]`, `[RAZORPAY_*]` | `src/content/site.ts`                          | Not in the brief; left alone       |

`pnpm placeholders` prints the full inventory, including legal figures and `[TO WRITE]` journal stubs. Those are outside the rebrand.

### (e) Matches that are none of the above: no change

The search terms also hit these. They are listed so the search is complete.

| File:line                                                     | Exact string                                                                                           | Why no change                      |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `.github/workflows/deploy-vps.yml:6`                          | ``…f `ssh-keyscan <host>`), VPS_PATH (e.g. /opt/arshdeep-site).``                                      | Infra identifier: leave alone (R6) |
| `.github/workflows/deploy-vps.yml:38`                         | `…age names must be lowercase (the account is "Arshdeep-0509").`                                       | GitHub account name                |
| `.github/workflows/deploy-vps.yml:40`                         | `…"IMAGE=ghcr.io/${GITHUB_REPOSITORY_OWNER,,}/arshdeep-site" >> "$GITHUB_ENV"`                         | Infra identifier: leave alone (R6) |
| `deploy/deploy.sh:13`                                         | `REGISTRY="${REGISTRY:-ghcr.io/arshdeep-0509/arshdeep-site}"`                                          | Infra identifier: leave alone (R6) |
| `DEPLOYMENT.md:69`                                            | `sudo mkdir -p /opt/arshdeep-site && sudo chown deploy: /opt/arshdeep-sit…`                            | Infra identifier: leave alone (R6) |
| `DEPLOYMENT.md:70`                                            | `…one https://github.com/<you>/<repo>.git /opt/arshdeep-site`                                          | Infra identifier: leave alone (R6) |
| `DEPLOYMENT.md:71`                                            | `cd /opt/arshdeep-site`                                                                                | Infra identifier: leave alone (R6) |
| `DEPLOYMENT.md:95`                                            | ``…h-keyscan <host>` output), `VPS_PATH` (`/opt/arshdeep-site`).``                                     | Infra identifier: leave alone (R6) |
| `DEPLOYMENT.md:100`                                           | ``**Rollback:** `ssh deploy@server 'cd /opt/arshdeep-site && ./deploy/deploy.sh <previous-commit-…``   | Infra identifier: leave alone (R6) |
| `docker-compose.yml:9`                                        | `name: arshdeep-site`                                                                                  | Infra identifier: leave alone (R6) |
| `docker-compose.yml:17`                                       | `image: ${APP_IMAGE:-arshdeep-site:latest}`                                                            | Infra identifier: leave alone (R6) |
| `docker-compose.yml:40`                                       | `image: ${MIGRATE_IMAGE:-arshdeep-migrate:latest}`                                                     | Infra identifier: leave alone (R6) |
| `Dockerfile:4`                                                | `#   docker build -t arshdeep-site .                       → the web app (…`                           | Infra identifier: leave alone (R6) |
| `Dockerfile:5`                                                | `` #   docker build --target migrator -t arshdeep-migrate .  → runs `prisma migrate deploy` ``         | Infra identifier: leave alone (R6) |
| `package.json:2`                                              | `"name": "arshdeep-site",`                                                                             | Infra identifier: leave alone (R6) |
| `REBRAND.md:9`                                                | `"Arshdeep" is commonly read as _Arsh_ (sky, heaven) +…`                                               | Historical record of Skylamp       |
| `REBRAND.md:19`                                               | `- **Wordmark.** "Arshdeep Singh" in Fraunces 600, letter-spacing −0.01…`                              | Historical record of Skylamp       |
| `REBRAND.md:20`                                               | ``sub-line `ENGINEER · BUILDER · AI & CLOUD` in IBM Plex Mono 10px (hidden…``                          | Historical record of Skylamp       |
| `src/app/api/careers/route.ts:69`                             | `portfolio: text(form, "portfolio"),`                                                                  | Generic word or form field         |
| `src/app/api/careers/route.ts:129`                            | `portfolio: normalizeUrl(data.portfolio),`                                                             | Generic word or form field         |
| `src/components/sections/collaborate/ApplicationForm.tsx:42`  | `["name", "email", "phone", "role", "portfolio", "linkedin"],`                                         | Generic word or form field         |
| `src/components/sections/collaborate/ApplicationForm.tsx:85`  | `portfolio: "",`                                                                                       | Generic word or form field         |
| `src/components/sections/collaborate/ApplicationForm.tsx:212` | `[labels.portfolio, values.portfolio],`                                                                | Generic word or form field         |
| `src/components/sections/collaborate/ApplicationForm.tsx:333` | `<Label htmlFor="apply-portfolio" required>`                                                           | Generic word or form field         |
| `src/components/sections/collaborate/ApplicationForm.tsx:334` | `{labels.portfolio}`                                                                                   | Generic word or form field         |
| `src/components/sections/collaborate/ApplicationForm.tsx:337` | `id="apply-portfolio"`                                                                                 | Generic word or form field         |
| `src/components/sections/collaborate/ApplicationForm.tsx:342` | `invalid={Boolean(errors.portfolio)}`                                                                  | Generic word or form field         |
| `src/components/sections/collaborate/ApplicationForm.tsx:343` | `…aria-describedby={describe("portfolio")}`                                                            | Generic word or form field         |
| `src/components/sections/collaborate/ApplicationForm.tsx:344` | `{...field("portfolio")}`                                                                              | Generic word or form field         |
| `src/components/sections/collaborate/ApplicationForm.tsx:346` | `<FieldError id="apply-portfolio-error">{errors.portfolio?.message}</FieldErr…`                        | Generic word or form field         |
| `src/content/collaborate.ts:127`                              | `"A portfolio that shows your process, not only final scre…`                                           | Generic word or form field         |
| `src/content/collaborate.ts:176`                              | `…ith the client's permission, belongs in your portfolio.",`                                           | Generic word or form field         |
| `src/content/collaborate.ts:338`                              | `portfolio: "Portfolio or GitHub link",`                                                               | Generic word or form field         |
| `src/content/legal/privacy.ts:62`                             | `…number, the role, experience, availability, portfolio and LinkedIn links, your resume (PDF) and yo…` | Generic word or form field         |
| `src/content/legal/terms.ts:144`                              | `"**Portfolio:** I may show non-confidential parts of the…`                                            | Generic word or form field         |
| `src/lib/careers/applications.ts:18`                          | `*        portfolio text not null, linkedin text,`                                                     | Generic word or form field         |
| `src/lib/careers/applications.ts:42`                          | `portfolio: string;`                                                                                   | Generic word or form field         |
| `src/lib/careers/emailTemplates.ts:48`                        | `${row("Portfolio / GitHub", application.portfolio, applicatio…`                                       | Generic word or form field         |
| `src/lib/careers/emailTemplates.ts:68`                        | `` `Portfolio / GitHub: ${application.portfolio}`, ``                                                  | Generic word or form field         |
| `src/lib/schemas/careerApplication.ts:57`                     | `portfolio: z`                                                                                         | Generic word or form field         |
| `src/lib/schemas/careerApplication.ts:60`                     | `.min(1, "Add a link to your portfolio or GitHub.")`                                                   | Generic word or form field         |
| `tests/unit/careers-newsletter-schema.test.ts:18`             | `portfolio: "github.com/rahul",`                                                                       | Generic word or form field         |
| `tests/unit/careers-newsletter-schema.test.ts:28`             | `it("accepts a valid application (portfolio link without https://)", () => {`                          | Generic word or form field         |
| `tests/unit/careers-newsletter-schema.test.ts:60`             | `…areerApplicationSchema.safeParse({ ...valid, portfolio: "not a link" }).success).toBe(`              | Generic word or form field         |

Also: the filename `public/images/arshdeep-singh.jpg` (founder photo, stays) and the git remote `Arshdeep-0509/portfolio.git`, which isn't site content.

## 3. Metadata map

Almost everything flows through one helper, `buildMetadata()` in `src/lib/seo.ts`, so changing the name and URL at the source updates every page.

| Item            | Defined in                                                                                                                                                | Notes                                                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `metadataBase`  | `src/app/layout.tsx:47`                                                                                                                                   | `new URL(SITE_URL)`                                                                                                                 |
| Title           | `src/app/layout.tsx:48-52`                                                                                                                                | Default is `name — founder.role`; template is `%s \| name`. **The default must change** to use the tagline                          |
| Description     | `src/lib/seo.ts:27`, default from `siteConfig.description`                                                                                                | Home overrides it from `src/content/home.ts:26-27`                                                                                  |
| Canonical       | `src/lib/seo.ts:46`                                                                                                                                       | `alternates.canonical = absoluteUrl(path)`                                                                                          |
| Open Graph      | `src/lib/seo.ts:47-55`                                                                                                                                    | `url`, `title`, `siteName`, `locale` `en_IN`. On home, `og:title` is the bare name with no tagline                                  |
| Twitter         | `src/lib/seo.ts:56-61`                                                                                                                                    | `summary_large_image`, no `site` or `creator` handle. Routes with `image: false` still get a `twitter:image` (checked in the build) |
| Icons           | `src/app/layout.tsx:56-66`, `src/app/favicon.ico`, `public/icons/*`                                                                                       | Generated by `pnpm icons` from a hardcoded "A" mark                                                                                 |
| Manifest        | `src/app/manifest.ts`                                                                                                                                     | Name uses `founder.role`. Colours at lines 12-13                                                                                    |
| Theme colour    | `src/app/layout.tsx:74` (`viewport`) and `src/app/manifest.ts:12-13`                                                                                      | Correct API for this Next version. `metadata.themeColor` is deprecated and unused                                                   |
| OG images       | `src/app/opengraph-image.tsx`, plus `services`, `services/[slug]`, `work/[slug]` and `journal/[slug]` under `(site)`. All render through `src/lib/og.tsx` | No `twitter-image` files                                                                                                            |
| JSON-LD         | `src/lib/structuredData.ts`, injected in `src/app/layout.tsx`. Page-level data in `collaborate/page.tsx:244-251` and `journal/[slug]/page.tsx:301-302`    | Business entity name uses `legalName` first. Journal `publisher` is a Person; it should become the business                         |
| robots, sitemap | `src/app/robots.ts`, `src/app/sitemap.ts`                                                                                                                 | Both use `absoluteUrl()`. `CONTENT_UPDATED` in `src/lib/routes.ts` drives `lastmod`                                                 |
| RSS             | `src/app/(site)/journal/rss.xml/route.ts:38`                                                                                                              | Uses `siteConfig.name`                                                                                                              |

**Page-level metadata.** Every route calls `buildMetadata()`. Paths are under `src/app/(site)/` unless noted:

| Type               | Routes                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `metadata` export  | `page.tsx:13`, `about/page.tsx:24`, `approach/page.tsx:15`, `collaborate/page.tsx:25`, `contact/page.tsx:13`, `services/page.tsx:15`, `work/page.tsx:8`, `journal/page.tsx:11-19`, `pay/page.tsx:14`, `privacy-policy/page.tsx:5`, `terms-and-conditions/page.tsx:5`, `refund-policy/page.tsx:5`, `cookie-policy/page.tsx:7`, `dev/ui/page.tsx:31`, and `src/app/not-found.tsx:5` |
| `generateMetadata` | `services/[slug]/page.tsx:37`, `work/[slug]/page.tsx:30`, `journal/[slug]/page.tsx:38`                                                                                                                                                                                                                                                                                            |

### Why canonical and og:url output `http://localhost:3000`

The cause is in `src/lib/constants.ts:13-18`:

```ts
export const SITE_URL: string = (
  isPlaceholder(siteConfig.url)
    ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    : siteConfig.url
).replace(/\/+$/, "");
```

1. `siteConfig.url` is still `"https://[DOMAIN]"` (`src/content/site.ts:81`), so `isPlaceholder()` is true.
2. The code then uses `NEXT_PUBLIC_SITE_URL`. That value is read at **build** time, so if it was missing, or copied from `.env.example:2`, the result is localhost.
3. Everything URL-shaped comes from `SITE_URL`: `metadataBase`, canonical, `og:url`, `og:image`, `twitter:image`, sitemap, robots, RSS and JSON-LD `@id`s. All of them are wrong together.

**Verified locally:** the existing build at `.next/server/app/index.html` contains `<link rel="canonical" href="http://localhost:3000"/>` and the matching `og:url`, and its `og:image` is on localhost too. There's no `.env` file in the repo.

**Not verified:** I didn't fetch the live site, because no live URL is in the repo. Whether its env var is unset or set to localhost can only be seen in the host's settings. The fix below works either way.

**Fix (done in the brand config step):** `siteConfig.url` is now `NEXT_PUBLIC_SITE_URL || "https://polestride.com"`. The env var takes priority, so the host must have it unset or set to `https://polestride.com`. If the host has it set to localhost, canonicals stay on localhost until that is changed and the site is rebuilt.

**Related leak:** three places read `siteConfig.url` directly, so they currently output the literal text `https://[DOMAIN]`: JSON-LD `sameAs` at `src/app/(site)/collaborate/page.tsx:251`, and the footers of the confirmation emails at `src/lib/contact/emailTemplates.ts:135` and `src/lib/careers/emailTemplates.ts:101,114`. The same fix clears them.

## 4. Theme map

Colours are defined in `src/styles/globals.css`. There is no `tailwind.config`. Components under `src/components` contain no hex values, but several `rgb()` literals and some non-CSS files repeat the palette because they can't read CSS variables.

### Contrast check of the brief's palette

Measured with the same WCAG formula as `scripts/contrast-check.mjs`. Text needs 4.5:1; large text and UI parts need 3:1.

| Pairing                       | Ratio | Result                                               |
| ----------------------------- | ----- | ---------------------------------------------------- |
| Glacier on Polar Night        | 15.77 | Pass                                                 |
| Glacier on Deep Meridian      | 13.28 | Pass                                                 |
| Polaris Gold on Polar Night   | 9.72  | Pass                                                 |
| Polaris Gold on Deep Meridian | 8.18  | Pass                                                 |
| Aurora on Polar Night         | 9.97  | Pass                                                 |
| Aurora on Deep Meridian       | 8.40  | Pass                                                 |
| Slate Mist on Polar Night     | 6.37  | Pass                                                 |
| Slate Mist on Deep Meridian   | 5.36  | Pass                                                 |
| Polar Night on Polaris Gold   | 9.72  | Pass (button text)                                   |
| Polar Night on Glacier        | 15.77 | Pass                                                 |
| **`#C4881A` on Glacier**      | 2.68  | **Fail**, even at 3:1. Use `#916513` for text (4.53) |
| **`#C4881A` on white**        | 3.05  | **Fail** for text; passes 3:1 only                   |
| **Slate Mist on Glacier**     | 2.48  | **Fail**. Use `#626E83` for muted text (4.53)        |
| **Aurora on Glacier**         | 1.58  | **Fail**. Use `#35776D` for links (4.61)             |

See D1. The tints are the same hues darkened to the first passing value.

### Proposed token mapping

The brief has 6 colours and the site has 22 colour tokens, so some tokens have no direct match. The names are also Skylamp-specific ("lamp", "night", "ivory"). Renaming is mechanical: about 360 class uses, plus `globals.css`, `src/lib/utils.ts`, `tests/unit/utils.test.ts` and `scripts/contrast-check.mjs`. I recommend doing it in prompt 1 so the code doesn't keep talking about lamps.

| Current token                 | Uses in `src`       | Becomes                                                                     |
| ----------------------------- | ------------------- | --------------------------------------------------------------------------- |
| `--night-950` `#0A0A12`       | 43 across `night-*` | Polar Night `#0B1630`                                                       |
| `--night-900` `#12121F`       | (counted above)     | No match. Polar Night, or a tint between the two navies                     |
| `--night-800` `#1C1B2E`       | (counted above)     | Deep Meridian `#13254A`                                                     |
| `--dusk-700` `#2E2A4F`        | 2                   | Deep Meridian                                                               |
| `--lamp-500` `#F5A524`        | 142 across `lamp-*` | Polaris Gold `#E8B84A`                                                      |
| `--lamp-400` `#FFC15E`        | (counted above)     | Polaris Gold                                                                |
| `--lamp-700`, `--lamp-800`    | (counted above)     | AA gold tint (D1)                                                           |
| `--ember-500` `#F2683C`       | 3                   | Remove. The brief has one accent                                            |
| `--starlight` `#C9D2FF`       | 5                   | Slate Mist                                                                  |
| `--ivory-50` `#FBF8F2`        | 52                  | Glacier `#EAF1FB`                                                           |
| `--sand-100` `#F3EDE2`        | 12                  | No match. Needs a second light surface, such as a Glacier tint              |
| `--ink-900` `#16141F`         | 61 across `ink-*`   | Polar Night                                                                 |
| `--ink-600` `#4A4658`         | (counted above)     | AA muted tint (D1)                                                          |
| `--mist-300` `#B8B4C6`        | 39                  | Slate Mist                                                                  |
| `--line`, `--line-dark`       |                     | Slate Mist tint on light; Deep Meridian on dark                             |
| `--success`, `--success-700`  |                     | Aurora on dark; `#35776D` on light                                          |
| `--danger`, `-700`, `-300`    |                     | Not in the brief. Keep, then re-measure on the new surfaces                 |
| `--grad-flame`                | 4                   | Solid Polaris Gold; "one memorable thing" rules out a flame                 |
| `--grad-horizon`              | 3                   | Quiet navy gradient with no warm glow                                       |
| `--stars`, `--paper-grain`    | 14, 7               | Keep stars, retinted. Paper grain is a warm-paper effect; drop or soften it |
| `--glow-card` (`shadow-glow`) | 7                   | Retint to gold, or use a plain border, to keep things quiet                 |
| `--field-bg` `#FFFDF9`        |                     | White or a Glacier tint                                                     |

`.tone-ivory` and `.tone-sand` should be renamed with the tokens: `tone-*` classes and `tone=` props appear 67 times.

Motion that belongs to the lamp concept also needs handling in prompt 1: `animate-lamp-breathe`, `CursorGlow` and the warm glows in `ArchFrame`, `Bento` and `ServicesMenu`.

### Every hardcoded hex value

Occurrence counts are in brackets. `#9679` in `src/lib/emailLayout.ts` is a false match: it's the HTML entity `&#9679;`, the bullet before the brand name. That glyph should become a star.

| File                                              | Values                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/icons/icon.svg`                           | `#0a0a12` (2), `#2e2a4f` (1), `#f5a524` (4), `#fbf8f2` (1), `#ffc15e` (1)                                                                                                                                                                                                                                                                            |
| `public/images/founder-placeholder.svg`           | `#0a0a12` (1), `#12121f` (2), `#2e2a4f` (3), `#f5a524` (2), `#ffc15e` (1)                                                                                                                                                                                                                                                                            |
| `public/images/journal/cover-placeholder.svg`     | `#0a0a12` (1), `#1c1b2e` (1), `#2e2a4f` (1), `#c9d2ff` (4), `#f5a524` (1), `#fff` (9)                                                                                                                                                                                                                                                                |
| `public/images/work/architecture-placeholder.svg` | `#0a0a12` (1), `#1c1b2e` (1), `#2e2a4f` (1), `#c9d2ff` (4), `#ffc15e` (1), `#fff` (9)                                                                                                                                                                                                                                                                |
| `public/images/work/client-project-cover.svg`     | `#0a0a12` (1), `#1c1b2e` (1), `#2e2a4f` (1), `#c9d2ff` (4), `#f59e0b` (1), `#fff` (9)                                                                                                                                                                                                                                                                |
| `public/images/work/screen-placeholder.svg`       | `#0a0a12` (1), `#1c1b2e` (1), `#2e2a4f` (1), `#c9d2ff` (4), `#f5a524` (1), `#fff` (9)                                                                                                                                                                                                                                                                |
| `scripts/generate-icons.mjs`                      | `#0a0a12` (1), `#2e2a4f` (1), `#f5a524` (1), `#fbf8f2` (1), `#ffc15e` (1)                                                                                                                                                                                                                                                                            |
| `src/app/global-error.tsx`                        | `#0a0a12` (1), `#16141f` (1), `#b8b4c6` (1), `#f2683c` (1), `#f5a524` (1), `#fbf8f2` (1), `#ffc15e` (1)                                                                                                                                                                                                                                              |
| `src/app/layout.tsx`                              | `#0a0a12` (1)                                                                                                                                                                                                                                                                                                                                        |
| `src/app/manifest.ts`                             | `#0a0a12` (2)                                                                                                                                                                                                                                                                                                                                        |
| `src/lib/contact/emailTemplates.ts`               | `#f3ede2` (1), `#f5a524` (1)                                                                                                                                                                                                                                                                                                                         |
| `src/lib/emailLayout.ts`                          | `#0a0a12` (1), `#16141f` (1), `#4a4658` (1), `#9679` (1), `#a65e00` (1), `#e6dfd3` (1), `#f5a524` (1), `#fbf8f2` (2), `#ffffff` (1)                                                                                                                                                                                                                  |
| `src/lib/og.tsx`                                  | `#0a0a12` (2), `#b8b4c6` (1), `#c9d2ff` (1), `#f5a524` (1), `#fbf8f2` (1), `#ffc15e` (1)                                                                                                                                                                                                                                                             |
| `src/styles/globals.css`                          | `#0a0a12` (2), `#12121f` (1), `#16141f` (1), `#1c1b2e` (1), `#1f7a50` (1), `#2e2a4f` (1), `#2f9e6e` (1), `#4a4658` (1), `#9a5600` (1), `#a65e00` (1), `#b83a3a` (1), `#b8b4c6` (1), `#c9d2ff` (1), `#d64545` (1), `#e6dfd3` (1), `#f2683c` (2), `#f3ede2` (1), `#f5a524` (2), `#fbf8f2` (1), `#ff8a7a` (1), `#ffc15e` (2), `#fff` (1), `#fffdf9` (1) |
| `tests/e2e/routes.spec.ts`                        | `#0a0a12` (1)                                                                                                                                                                                                                                                                                                                                        |

Files that can't use CSS variables and must be updated by hand: `src/app/global-error.tsx`, `src/lib/og.tsx`, `src/lib/emailLayout.ts`, `src/lib/contact/emailTemplates.ts`, `scripts/generate-icons.mjs`, `src/app/layout.tsx`, `src/app/manifest.ts` and the SVGs in `public/`. The test at `tests/e2e/routes.spec.ts:61` must change with the manifest.

### Hardcoded `rgb()` colours

These sit in Tailwind arbitrary values or inline styles, so token changes won't reach them.

| File                                              | Line(s)  | Value                                                                    |
| ------------------------------------------------- | -------- | ------------------------------------------------------------------------ |
| `src/components/layout/HeaderClient.tsx`          | 106      | `rgb(245_165_36/0.7)`                                                    |
| `src/components/layout/ServicesMenu.tsx`          | 148, 214 | `rgb(10_10_18/0.35)`, `rgb(245_165_36/0.3)`                              |
| `src/components/layout/CornerCard.tsx`            | 122      | `rgb(245_165_36/0.6)`                                                    |
| `src/components/layout/consent/CookieConsent.tsx` | 47       | `rgb(10_10_18/0.5)`                                                      |
| `src/components/ui/ArchFrame.tsx`                 | 32, 45   | `rgb(245_165_36/0.06)`, `rgb(245_165_36/0.45)`, `rgb(255_193_94/0.18)`   |
| `src/components/ui/Bento.tsx`                     | 84       | `rgb(245_165_36/0.32)`, `rgb(46_42_79/0.35)`                             |
| `src/components/ui/CursorGlow.tsx`                | 56       | `rgb(255 193 94 / …)`                                                    |
| `src/components/ui/StickyScrollStory.tsx`         | 79       | `rgb(245_165_36/0.55)`                                                   |
| `src/components/ui/Toast.tsx`                     | 80       | `rgb(10_10_18_/_0.45)`                                                   |
| `src/lib/og.tsx`                                  | 45, 102  | `rgba(245,165,36,0.30)`, `rgba(46,42,79,0.55)`, `rgba(255,255,255,0.12)` |
| `src/styles/globals.css`                          | 10 lines | Gradients, stars, hairlines, glows                                       |

## 5. Typography map

All faces load in `src/app/layout.tsx` through `next/font/google` and are self-hosted at build, so the Content-Security-Policy needs no font change. Sora, Manrope and JetBrains Mono are all in this Next version's font data.

| Role      | Now                                                                       | Becomes                       | Notes                                                                                  |
| --------- | ------------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
| Display   | Fraunces variable, `--font-fraunces` (`layout.tsx:13-18`)                 | Sora 600/700                  | Drop `axes`. Variable font, so one file covers both weights                            |
| Emphasis  | Fraunces Italic, `--font-fraunces-italic` (`layout.tsx:22-28`), preloaded | Removed                       | **Sora has no italic** (`styles: ["normal"]` in the font data). See D3                 |
| Body      | Manrope, `--font-manrope` (`layout.tsx:30-34`)                            | Manrope 400/500/600           | Already loaded. It has no italic either, so body `<em>` is synthesised, as it is today |
| Mono      | IBM Plex Mono, `--font-plex-mono` (`layout.tsx:36-43`), not preloaded     | JetBrains Mono, not preloaded | Limited to the build log and file tree, plus any D2 exception                          |
| OG images | Satori's default sans (`src/lib/og.tsx`)                                  | Sora, if a TTF is added       | See R5                                                                                 |
| Email     | Georgia header (`src/lib/emailLayout.ts:36`), system sans body            | System sans                   | Web fonts aren't reliable in email                                                     |

**Where they apply** (`src/styles/globals.css`):

| Line(s) | Rule                                                              |
| ------- | ----------------------------------------------------------------- |
| 167-169 | `--font-display`, `--font-sans`, `--font-mono` theme mapping      |
| 346     | `@utility label-mono` (97 uses, 49 files)                         |
| 355-359 | `@utility font-display-soft` with `"SOFT" 50` (34 uses, 22 files) |
| 405-407 | `h1-h4`: display font, `"SOFT" 50`, weight 560. Sora needs 600    |
| 412-417 | `h1/h2/.headline em`: Fraunces italic and flame underline         |
| 497-502 | `.prose h2, h3`: display font, `"SOFT" 50`, weight 560            |

`font-mono` appears directly 47 times in 28 files. `BuildLog.tsx` and `FileTree.tsx` keep it. The other 26 files move to Manrope under D2, including `Accordion`, `Footer`, `HeaderClient`, `MobileMenu`, `ServicesMenu`, `LegalLayout` and `ContactForm`.

The `font` key in `src/lib/utils.ts` (`tailwind-merge`) needs updating if utility names change. Remove `font-variation-settings: "SOFT"` throughout, since it has no effect on Sora.

## 6. Component list

| Component               | Files                                                                                                                                  | Rebrand impact                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Header                  | `src/components/layout/Header.tsx`, `HeaderClient.tsx`                                                                                 | Logo, `rgb()` dot at line 106                                                                      |
| Logo                    | `src/components/layout/Logo.tsx`                                                                                                       | Full rewrite to inline SVG. Used by the header, mobile menu and `/dev/ui`                          |
| Mega menu               | `src/components/layout/ServicesMenu.tsx`                                                                                               | Tokens, 2 `rgb()` values, mono labels                                                              |
| Mobile menu             | `src/components/layout/MobileMenu.tsx`                                                                                                 | Logo, tokens, stars                                                                                |
| Hero                    | `src/components/sections/home/HomeHero.tsx`, copy in `src/content/home.ts`                                                             | Horizon gradient, `CursorGlow`, hero label (D7)                                                    |
| build.log card          | `src/components/ui/BuildLog.tsx`                                                                                                       | **Keeps mono.** Retint; typing animation is in `globals.css`                                       |
| Service groups          | `src/components/sections/home/WhatIBuild.tsx`, `sections/home/ServicePicker.tsx`, `ui/Bento.tsx`, `sections/services/ServiceIndex.tsx` | Tokens, warm gradient in `Bento`                                                                   |
| Principles              | `src/components/sections/home/Principles.tsx`                                                                                          | Tokens, labels                                                                                     |
| Process steps           | `src/components/sections/home/ProcessStory.tsx`, `ui/StickyScrollStory.tsx`, `src/content/process.ts`                                  | Tokens, `rgb()` at line 79                                                                         |
| Handover kit tree       | `src/components/sections/home/HandoverKit.tsx`, `ui/FileTree.tsx`, `src/content/deliverables.ts`                                       | **Keeps mono.** Retint                                                                             |
| Stack map               | `src/components/sections/home/StackSection.tsx`, `ui/StackMap.tsx`, `src/content/techStack.ts`                                         | Labels leave mono                                                                                  |
| FAQ accordion           | `src/components/sections/home/Questions.tsx`, `sections/shared/FaqSection.tsx`, `sections/shared/FaqJsonLd.tsx`, `ui/Accordion.tsx`    | Tokens, mono marker in `Accordion`                                                                 |
| Contact form            | `src/components/sections/contact/ContactForm.tsx` (618 lines), `ui/FormWizard.tsx`, `ui/form/*`, `/api/contact`                        | Tokens, focus rings to Aurora. No logic changes                                                    |
| Newsletter form         | `src/components/layout/NewsletterForm.tsx`, `/api/newsletter`                                                                          | Tokens                                                                                             |
| Footer                  | `src/components/layout/Footer.tsx`                                                                                                     | Renders the wordmark as **text** at line 125, not through `Logo`. Tagline; `legalName` at line 132 |
| Cookie banner           | `src/components/layout/consent/CookieConsent.tsx`, `ConsentSettingsDialog.tsx`, `src/components/layout/CookieSettingsButton.tsx`       | Tokens, 1 `rgb()` value                                                                            |
| Legal pages             | `src/components/layout/LegalLayout.tsx`, 4 pages under `src/app/(site)`, `src/content/legal/*`                                         | Layout tokens. Text stays, apart from placeholders                                                 |
| Service detail template | `src/app/(site)/services/[slug]/page.tsx` (413 lines), its `opengraph-image.tsx`, `src/content/services.ts`, `servicesPart2.ts`        | Tokens, font classes                                                                               |

Not on your list, but also affected:

| Component                  | Files                                                                                              | Rebrand impact                                                     |
| -------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Preloader                  | `src/components/layout/Preloader.tsx`, PRELOADER block in `globals.css`                            | Draws the "A" and ignites the lamp. Needs a new mark and animation |
| 404 page                   | `src/components/layout/NotFoundContent.tsx`                                                        | "A night sky, one lamp" visual                                     |
| Global error page          | `src/app/global-error.tsx`                                                                         | Hardcoded colours and flame button                                 |
| Corner card, contact dock  | `src/components/layout/CornerCard.tsx`, `ContactDock.tsx`                                          | Tokens, `rgb()` value                                              |
| QuickStart, Lab, ArchFrame | `src/components/layout/QuickStart.tsx`, `sections/shared/Lab.tsx`, `ui/ArchFrame.tsx`              | Tokens, warm gradients                                             |
| UI showcase                | `src/app/(site)/dev/ui/page.tsx`                                                                   | "Skylamp UI" label, `Logo subline` prop                            |
| Emails                     | `src/lib/emailLayout.ts`, `src/lib/contact/emailTemplates.ts`, `src/lib/careers/emailTemplates.ts` | Colours, header, sign-off (R4)                                     |

## 7. Risks

| #   | Risk                                                                                                                                                                                                                                                                         | What to do                                                                                                                                                                           |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1  | **Tests with hardcoded strings.** `tests/e2e/preloader.spec.ts:10` expects `Arshdeep Singh`. `tests/e2e/routes.spec.ts:61` expects `#0A0A12`. `tests/unit/utils.test.ts:23` covers token names.                                                                              | Change them in the same prompt as the code they test. The tagline assertion at `preloader.spec.ts:11-13` already matches the brief.                                                  |
| R2  | **`NEXT_PUBLIC_SITE_URL` overrides the default in `siteConfig.url`.** A host value of localhost keeps the canonical bug alive. CI's `http://localhost:3100` still applies there, which is fine: `tests/e2e/fixtures.ts` and `scripts/check-links.mjs` use only the pathname. | Check the host's value before launch (D9). Preview deployments canonicalise to whatever their env var says.                                                                          |
| R3  | **`name` is paired with a person's role** at `layout.tsx:49`, `manifest.ts:7` and `opengraph-image.tsx:7,11`.                                                                                                                                                                | Rewrite to `Polestride — Business automation that frees you to grow.` (56 characters). Keep `founder.role` for the person only.                                                      |
| R4  | **Form emails.** Confirmation emails say "your message is with me" and sign off with `siteConfig.name`, which would become "— Polestride". `EMAIL_FROM` lives on the host, not in the repo. Subject lines contain no brand name.                                             | Sign off as `Arshdeep Singh, Polestride`. Update `EMAIL_FROM` on the host only after `polestride.com` has SPF, DKIM and DMARC, or mail will fail. The inbox stays the Gmail address. |
| R5  | **OG image route.** `src/lib/og.tsx` has the "A" mark, 6 colours, the micro-tagline and a host fallback. Satori can't read CSS variables or `next/font` output, so Sora needs a TTF committed to the repo and loaded with `readFile`, as the Next docs show.                 | Add a static Sora TTF for the OG route, or stay on the default sans as Skylamp did. Social platforms cache old images, so re-scrape after launch.                                    |
| R6  | **Docker Compose project name.** `docker-compose.yml:9` sets `name: arshdeep-site`, and the volumes (`pg-data`, `app-data`, `letsencrypt`) have no fixed names, so they're prefixed with it. Renaming would start a fresh empty database and lose certificates.              | **Leave all infra identifiers alone:** Compose project, image names, `/opt/arshdeep-site`, GHCR path. Visitors never see them.                                                       |
| R7  | **`public/brand/` has no cache header.** `next.config.ts` covers `/images` and `/icons` only.                                                                                                                                                                                | Add `/brand/:path*`. CSP needs no change for same-origin SVGs or fonts.                                                                                                              |
| R8  | **Logo accessibility.** The link's name comes from wordmark text today, and an inline SVG removes it. `Logo subline` is passed at `dev/ui/page.tsx:91`.                                                                                                                      | Add an accessible name such as `aria-label="Polestride home"`. Remove `subline` and `brand.microTagline` with their uses in `Logo`, `og.tsx` and the demo page.                      |
| R9  | **Preloader wordmark.** It splits `brand.wordmark` into letters, and the test reads that text. The brief's wordmark is lowercase drawn paths.                                                                                                                                | Keep DOM text `Polestride` in Sora for the letter animation, or update the test if it becomes paths.                                                                                 |
| R10 | **Layout shift from wider type.** Sora is a wide face. `--text-h1`, `--text-h2`, the header bar and the preloader name were tuned for Fraunces.                                                                                                                              | Check at 320, 768 and 1280px. Re-tune the clamp values if headlines wrap badly. Remove the Fraunces Italic preload.                                                                  |
| R11 | **Settings outside the repo:** `NEXT_PUBLIC_SITE_URL`, `EMAIL_FROM`, `DOMAIN`, `CERTBOT_EMAIL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, the Turnstile hostname list, a new Search Console token, Razorpay business name and allowed domain, Calendly branding.                       | List them in prompt 12. Forms can fail if Turnstile doesn't allow `polestride.com`. `NEXT_PUBLIC_*` values need a rebuild.                                                           |
| R12 | **`www` to apex isn't in Next config.** Nginx already does it (`deploy/nginx/site.conf.template:27-38`). On Vercel it's a dashboard setting.                                                                                                                                 | Confirm the host (D9). HSTS with `includeSubDomains; preload` is already sent, so keep every subdomain on HTTPS.                                                                     |
| R13 | **Old domain.** The repo records no earlier production domain, but a site is live somewhere.                                                                                                                                                                                 | If it's on another domain, it needs 301s to `polestride.com` and a Search Console change of address.                                                                                 |
| R14 | **Checks not in CI.** `pnpm contrast` isn't enforced, and its pairing list uses token names, so renames must update it.                                                                                                                                                      | Update it in prompt 1, and add it to CI if you agree.                                                                                                                                |
| R15 | **Legal and sitemap dates.** Any legal edit requires bumping `lastUpdated` in that file, and copy edits should bump `CONTENT_UPDATED` in `src/lib/routes.ts`.                                                                                                                | Bump both when placeholders are filled. The legal files also say to have a lawyer review them before launch.                                                                         |
| R16 | **Docs go stale.** `REBRAND.md`, the README design system section, `reference/README.md` and code comments all say Skylamp.                                                                                                                                                  | Keep `REBRAND.md` as history and add a Polestride identity doc in prompt 12.                                                                                                         |

Checked and safe: cookie and storage keys (`consent`, `utm`, `announcement-seen:*`, `preloader-off`) contain no brand name. The tagline at `src/content/site.ts:76` already matches the brief exactly. Email, phone and WhatsApp stay as they are.

Not part of this audit: whether you control `polestride.com`, and trademark clearance for the name.

## Checklist for the next 12 prompts

**I haven't seen your next 12 prompts.** This order is inferred from the brief and the dependencies above, so renumber it when you send them. Each step ends with `pnpm lint`, `pnpm typecheck` and `pnpm test`.

- [ ] **1. Theme tokens.** New palette in `globals.css`, tone classes, token rename, AA tints (D1), remove flame and ember, fix `rgb()` literals, update `utils.ts`, `contrast-check.mjs` and tests. Gate: `pnpm contrast`.
- [ ] **2. Typography.** Sora, Manrope and JetBrains Mono in `layout.tsx`. Remove Fraunces and `SOFT`. Headline `<em>` (D3). Move labels off mono (D2). Check at 320px.
- [ ] **3. Logo and icons.** Add `public/brand/*` (D4), rewrite `Logo.tsx`, footer wordmark, `generate-icons.mjs`, run `pnpm icons`, favicon, cache header.
- [ ] **4. Name and business facts.** `site.ts` (name, wordmark, description, state, legal name, remove micro-tagline), all (a) strings with the ⚠ rewrites, `preloader.spec.ts`. Needs D5 to D7.
- [ ] **5. Technical SEO.** `siteConfig.url` and canonical fix verified in build output, title default, `og:title`, manifest, theme colour, robots, sitemap, RSS, `routes.spec.ts`.
- [ ] **6. Structured data.** Organization and founder entities, logo URL, journal `publisher`, `sameAs`, validation.
- [ ] **7. OG images.** `og.tsx` redesign, star mark, Sora TTF decision (R5), alt text, all 5 routes.
- [ ] **8. Site chrome.** Header, mega menu, mobile menu, footer, preloader (new animation), corner card, contact dock.
- [ ] **9. Home page.** Hero, build.log, service groups, principles, process, handover tree, stack map, FAQ. Quiet the glows.
- [ ] **10. Forms, email, consent.** Contact, newsletter and careers styling, email colours and sign-off (R4), cookie banner, global error and 404 pages.
- [ ] **11. Inner pages.** Services index and detail template, work, about (D8), approach, collaborate, pay, legal layout and placeholders. Bump dates (R15).
- [ ] **12. Docs, QA, launch.** Update docs (R16), SVG placeholders, `pnpm test:e2e`, `test:links`, `contrast`, `originality`, Lighthouse, a final search for old strings, host and third-party list (R11), DNS and redirects.
