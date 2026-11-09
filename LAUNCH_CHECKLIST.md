# Launch checklist

Moving from `portfolio-4xrz.vercel.app` to `https://polestride.com`. Every step here is one you do by
hand in Vercel, your registrar, Search Console or another dashboard. Dashboard labels change, so if
one doesn't match, go by the meaning.

> **Work through this in order.** The code redirects `portfolio-4xrz.vercel.app` to polestride.com.
> If that code reaches production before polestride.com resolves with a valid certificate, the site
> goes offline. Sections 1 to 5 all come before section 6, the merge.

## 0. Blockers

Read these first. Each one breaks something on the live site.

- [ ] **The contact form returns an error without a database.** With no `DATABASE_URL`, leads are
      written to a local file, and Vercel's filesystem is read-only. Set `DATABASE_URL` (section 5).
- [ ] **Enquiries can vanish silently without real email.** With no provider, emails go to the same
      read-only local folder. Once a lead is stored, the visitor still sees "Sent", but nobody is
      notified. Set up email (sections 4 and 5).
- [ ] **The application form and newsletter have the same problem.** See the table in section 5.

## 1. Vercel: add the domains

- [ ] Open the project, then **Settings → Domains → Add Domain**.
- [ ] Add `polestride.com`. Vercel offers to add `www.polestride.com` too: accept.
- [ ] Make `polestride.com` the primary domain: it serves **Production**. Vercel recommends `www` as
      primary, but the apex is fully supported, and it's what the site's canonical URLs use.
- [ ] Click **Edit** on `www.polestride.com` and leave **Redirect to** empty, with the domain assigned
      to Production. `next.config.ts` then answers with the 301. A dashboard redirect runs first
      and its status code may differ. If you prefer one, choose 301 if it's offered.
- [ ] Keep `portfolio-4xrz.vercel.app` on the project. Don't remove it, or the redirect to the new
      domain stops working.

## 2. Registrar: DNS records

Copy the values from the Vercel **Domains** page. **Don't reuse values from a guide or another
project**: the CNAME is unique to each project.

- [ ] Remove any existing `A`, `AAAA` or `CNAME` records for `@` and `www`, including the registrar's
      parking page. Leave `MX` and `TXT` records alone.
- [ ] Add the **A** record for the apex:

      | Type | Name | Value                      |
      | ---- | ---- | -------------------------- |
      | A    | `@`  | the IP shown in Vercel     |

- [ ] Add the **CNAME** record for `www`:

      | Type  | Name  | Value                         |
      | ----- | ----- | ----------------------------- |
      | CNAME | `www` | the target shown in Vercel    |

- [ ] If Vercel asks you to verify the domain, add the `TXT` record it shows at `_vercel`.
- [ ] Wait for both domains to show a valid configuration in Vercel. It's often minutes, but allow
      up to a day or two.

## 3. Confirm SSL

Vercel issues the certificate by itself once DNS is correct. There's nothing to install.

- [ ] Both domains show as valid in **Settings → Domains**, with no certificate warning.
- [ ] `https://polestride.com` opens with a padlock. It shows the **old** site for now, which is
      expected: the domain attaches to your latest production deployment.
- [ ] Check it from a terminal. Expect `HTTP/2 200` and no certificate error:

      ```sh
      curl -sI https://polestride.com | head -1
      curl -sI https://www.polestride.com | head -1
      ```

**Stop here until both work.**

## 4. Email: SPF, DKIM and DMARC

You need this **even if your public address stays on Gmail**. The site's forms send from
`EMAIL_FROM`, and Resend only sends from a domain you've verified.

- [ ] In Resend, add `polestride.com` and copy the records it shows into your registrar.
- [ ] **SPF:** a `TXT` record. A domain can have only one SPF record, so merge any sending services
      into it rather than adding a second.
- [ ] **DKIM:** the `TXT` or `CNAME` records from your provider.
- [ ] **DMARC:** a `TXT` record at `_dmarc`. Start in monitoring mode, then tighten it after a few
      weeks of clean reports:

      ```
      v=DMARC1; p=none; rua=mailto:YOUR_ADDRESS
      ```

- [ ] If you move to `hello@polestride.com`: set up the mailbox (Google Workspace, Zoho or similar)
      with its `MX` records and its own SPF and DKIM entries, then change `contact.email` in
      `src/content/site.ts`. The TODO is there.
- [ ] Send a real message and open **Show original** in Gmail: SPF, DKIM and DMARC should all say
      **PASS**. Aim for 9/10 or better on mail-tester.com.

## 5. Vercel: environment variables

**Settings → Environment Variables.** `NEXT_PUBLIC_*` values are baked in at build time, so a change
needs a new deployment.

- [ ] `NEXT_PUBLIC_SITE_URL` = `https://polestride.com`, ticked for **Production only**. If it already
      exists for all environments, change that: previews take their URL from `VERCEL_URL`.
- [ ] **Enable access to System Environment Variables** is ticked. Previews and Speed Insights need
      it.

| Variable                                                                                           | Needed for                              | Without it                               |
| -------------------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------------------- |
| `DATABASE_URL`                                                                                     | Contact form                            | **Form returns an error**                |
| `EMAIL_FROM`, `RESEND_API_KEY`                                                                     | All form emails                         | **No emails, no warning to the visitor** |
| `CONTACT_TO_EMAIL`, `CAREERS_INBOX_EMAIL`                                                          | Inboxes (optional)                      | Uses `contact.email`                     |
| `RESUME_S3_ENDPOINT`, `RESUME_S3_BUCKET`, `RESUME_S3_ACCESS_KEY_ID`, `RESUME_S3_SECRET_ACCESS_KEY` | Application form resumes                | **Form fails**                           |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`                                                        | Application form records                | **Form fails**                           |
| `NEWSLETTER_WEBHOOK_URL`                                                                           | Newsletter                              | **Sign-up fails**                        |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`                                           | Spam protection                         | Forms are open to bots                   |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`                                               | Rate limits across serverless instances | Limits apply per instance only           |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_PROJECT_ID`                                  | Analytics                               | No analytics                             |
| `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`                                                             | Error reports                           | Errors only reach the logs               |

- [ ] Run `pnpm db:migrate` against the production database.

Forms on preview deployments fail unless you also give the Preview environment these values. Use a
separate database if you do.

## 6. Deploy

- [ ] Sections 1 to 5 are done, and `https://polestride.com` works with a valid certificate.
- [ ] Merge `rebrand/skylamp` into the production branch, or deploy it to production.
- [ ] Wait for the production deployment to go green.

## 7. Check the live site

```sh
curl -sI https://www.polestride.com/about            # 301 → https://polestride.com/about
curl -sI https://portfolio-4xrz.vercel.app/about     # 301 → https://polestride.com/about
curl -sI http://polestride.com                       # redirects to https
curl -sI https://polestride.com/about/               # 308 → /about
curl -sI https://polestride.com | grep -iE "strict-transport|content-security|referrer|permissions|x-content"
```

- [ ] All of the above behave as noted.
- [ ] `https://polestride.com` has no `x-robots-tag` header. **If it does, Google won't index the site.**
- [ ] A preview deployment's URL still opens, and sends `x-robots-tag: noindex`. Run `curl -sI` on it.
      If Deployment Protection is on, you'll get a login page instead: check in the browser's
      network panel.
- [ ] `view-source:https://polestride.com/about`: canonical and `og:url` are polestride.com URLs.
- [ ] Send the **contact form**: notification received, auto-reply received, row in `leads`.
- [ ] Send an **application** with a small PDF: notification with a working resume link, confirmation
      email, row in `career_applications`.
- [ ] Sign up to the **newsletter**: it reaches `NEWSLETTER_WEBHOOK_URL`.
- [ ] Accept cookies, open the browser console, and check for `Content-Security-Policy` errors on
      `/`, `/contact` and `/pay`. The Vercel toolbar on previews may be blocked by the policy; that
      doesn't affect visitors.
- [ ] On a real phone, check the home page, the menu and a form in **Safari on an iPhone** and in
      **Samsung Internet**. Neither can run on the development machine.
- [ ] Share a link in WhatsApp, LinkedIn, X and Slack. Use LinkedIn Post Inspector to clear old
      previews.

## 8. Google Search Console

- [ ] Add a **Domain** property for `polestride.com`. It covers `www` and every subdomain.
- [ ] Verify it with the `TXT` record Google shows, at your registrar.
- [ ] **Sitemaps:** submit `https://polestride.com/sitemap.xml`.
- [ ] **URL Inspection:** test `https://polestride.com/`, then request indexing for the home page and
      a main service page.
- [ ] **If `portfolio-4xrz.vercel.app` is a verified property on the same account:** use **Settings →
      Change of Address** from it. The tool needs both properties verified under your account. If
      it isn't verified, or the tool refuses a `vercel.app` subdomain, the 301s still do the job.
- [ ] Keep the redirects and the old address for **at least 180 days**, as Google advises.
- [ ] Add the site to Bing Webmaster Tools. It can import from Search Console.
- [ ] Run the Rich Results Test on `/`, a service page and `/contact`.
- [ ] Check **Pages** and **Page indexing** after a week or two.

## 9. Analytics

The code needs no change: GA4 and Clarity read their IDs from the environment.

- [ ] **GA4:** Admin → Data streams → your web stream: set the stream URL to `https://polestride.com`.
- [ ] **GA4:** Admin → Data streams → Configure tag settings → List unwanted referrals: add
      `portfolio-4xrz.vercel.app` if traffic from the old address shows as a referral.
- [ ] **GA4:** check DebugView after accepting cookies, and mark `generate_lead` as a key event.
- [ ] **Clarity:** Settings → Overview: set the site URL to `https://polestride.com`.
- [ ] **Speed Insights:** open it from the project sidebar in Vercel, and enable it if asked. It waits
      for analytics consent, like GA4, so it only counts visitors who accept. Data takes a few days.

## 10. Other dashboards

- [ ] **Cloudflare Turnstile:** add `polestride.com` to the widget's hostnames. Without it, forms
      fail the bot check on the live site.
- [ ] **Razorpay:** add `polestride.com` wherever the account lists a website, and fill in the button
      or link in `src/content/site.ts`. Or leave `/pay` unused: it's noindex and unlinked.
- [ ] **Calendly:** set `calendlyUrl` in `src/content/site.ts`, then redeploy.
- [ ] **Uptime monitor:** `https://polestride.com` and `https://polestride.com/api/health`.
- [ ] **Sentry:** trigger one test error.
- [ ] **Email signature:** paste it into Gmail now that the logo loads:
      open `https://polestride.com/brand/polestride-email-signature.html`, copy, and paste into
      Settings → Signature.
- [ ] Update the address on LinkedIn, GitHub, Clutch, GoodFirms and your Google Business Profile.

**Later, not now:** the site sends HSTS with `includeSubDomains; preload`. Browsers will then insist
on HTTPS for every polestride.com subdomain, so keep any new subdomain on HTTPS. Only submit to
hstspreload.org once you're certain, because leaving the list takes months.

## 11. Content and legal

`pnpm placeholders` lists every unfilled `[PLACEHOLDER]`; the full table is in the appendix.

- [ ] **Business facts** (`src/content/site.ts`): legal entity, `[CALENDLY_URL]`, `[EDUCATION]`,
      social URLs (empty ones stay hidden), `[GSTIN]` if registered, and `availability`.
- [ ] **About** (`src/content/about.ts`): `[CONFIRM NAME MEANING]`.
- [ ] **Case studies** (`content/work/*.mdx`): every `[ADD DETAILS — …]` and "what next" line. These
      show on public pages. Keep `results: []` until you have real numbers.
- [ ] **Service details:** `[TYPICAL_TIMELINE]`, the `[30]`-day bug-fix window and the bracketed
      durations.
- [ ] **Legal pages** (`src/content/legal/*.ts`): `[ADDRESS]`, the Grievance Officer's `[NAME]`, `[X]`
      days, the providers (`[HOSTING_PROVIDER]` is Vercel) and every bracketed number.
- [ ] **Cookie and Privacy policies:** add Vercel Speed Insights, the `theme` setting and the
      `sky-seen` session key.
- [ ] **Have a lawyer review** all four legal pages, including the removal of "trading as". They're
      templates aligned with the DPDP Act 2023, the IT Act 2000 and GDPR principles, not legal advice.
- [ ] Business name, address and GSTIN identical everywhere: site, invoices, Razorpay, Google Business
      Profile, LinkedIn.
- [ ] Appoint the Grievance Officer and set up the inbox for privacy requests.
- [ ] Schedule deletion as the Privacy Policy promises: applications after 12 months, leads after 24.
      For example, monthly: `delete from leads where created_at < now() - interval '24 months';`
- [ ] Journal stays off (`featureFlags.blog: false`) until a post is finished. Testimonials stay
      hidden until you have real ones, with permission.

## 12. Quality gates

Run these again on the final code. Verified on 7 November 2026 unless unticked:

- [x] `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm contrast`
- [x] `pnpm test` and `pnpm test:e2e`, including axe in both themes
- [x] `pnpm build`, and builds with Vercel's preview and production variables simulated
- [x] `pnpm audit --prod`: no known vulnerabilities
- [x] `pnpm test:links`: no broken links or anchors
- [ ] Lighthouse on the real host: run PageSpeed Insights on `https://polestride.com` (mobile). Lab
      runs on a development machine can't confirm LCP under 2.0s or INP under 200ms
- [ ] Branch protection: CI required before merging (see DEPLOYMENT.md)

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
| `[ASP.NET, IIS]`                                                             | `content/work/avior-convent-school.mdx`                                                                                                                      |
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
| `[EDUCATION]`                                                                | `src/content/site.ts`                                                                                                                                        |
| `[EMAIL_PROVIDER]`                                                           | `src/content/legal/privacy.ts`                                                                                                                               |
| `[GOAL]`                                                                     | `content/templates/case-study.mdx`                                                                                                                           |
| `[GSTIN]`                                                                    | `src/content/site.ts`                                                                                                                                        |
| `[HOSTING_PROVIDER]`                                                         | `src/content/legal/privacy.ts`                                                                                                                               |
| `[NAME]`                                                                     | `src/content/legal/privacy.ts`                                                                                                                               |
| `[ONE-LINE OUTCOME — what the project achieved, in plain words]`             | `content/templates/case-study.mdx`                                                                                                                           |
| `[PHOTO]`                                                                    | `public/images/founder-placeholder.svg`                                                                                                                      |
| `[RAZORPAY_PAYMENT_BUTTON_ID]`                                               | `src/content/site.ts`                                                                                                                                        |
| `[RAZORPAY_PAYMENT_LINK]`                                                    | `src/content/site.ts`                                                                                                                                        |
| `[SCREENSHOT]`                                                               | `public/images/work/screen-placeholder.svg`                                                                                                                  |
| `[STORAGE_PROVIDER]`                                                         | `src/content/legal/privacy.ts`                                                                                                                               |
| `[THE PROBLEM — what wasn't working, for whom]`                              | `content/templates/case-study.mdx`                                                                                                                           |
| `[TIMELINE]`                                                                 | `content/templates/case-study.mdx`                                                                                                                           |
| `[TO WRITE]`                                                                 | `content/journal/adding-ai-without-burning-your-budget.mdx`, `content/journal/how-to-scope-an-mvp.mdx`, `content/journal/nextjs-react-native-or-flutter.mdx` |
| `[TYPICAL_TIMELINE]`                                                         | `src/content/servicesPage.ts`                                                                                                                                |
| `[WHAT I'VE BUILT — real projects only]`                                     | `src/components/ui/PlaceholderText.tsx`                                                                                                                      |
| `[WHAT YOU WOULD DO NEXT]`                                                   | `content/templates/case-study.mdx`                                                                                                                           |
| `[WHATSAPP_URL]`                                                             | `src/content/site.ts`                                                                                                                                        |
| `[X]`                                                                        | `src/content/legal/privacy.ts`                                                                                                                               |
| `[YOUR ROLE]`                                                                | `content/templates/case-study.mdx`                                                                                                                           |
