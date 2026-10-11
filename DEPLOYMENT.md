# Deployment & operations

Two supported ways to run the site:

- **Option 1 — Vercel.** Least work: push to GitHub, Vercel builds and hosts it, preview deployments for every pull request.
- **Option 2 — Self-hosted VPS.** Docker + PostgreSQL + Nginx on your own server (AWS Lightsail, DigitalOcean, Hetzner…), deployed from GitHub Actions with zero downtime. More moving parts, full control, and a good showcase of DevOps work.

Whichever you choose, also work through [Email deliverability](#email-deliverability), [Monitoring](#monitoring) and [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).

---

## Environment variables

Every variable is documented in [`.env.example`](.env.example). In short:

| Purpose                            | Variables                                                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Site URL (canonicals, sitemap, OG) | `NEXT_PUBLIC_SITE_URL` — until `siteConfig.url` in `src/content/site.ts` holds the real domain                   |
| Contact leads database             | `DATABASE_URL` (PostgreSQL), then `pnpm db:migrate`                                                              |
| Email                              | `EMAIL_FROM` + `RESEND_API_KEY` (or `SMTP_*`), `CONTACT_TO_EMAIL`, `CAREERS_INBOX_EMAIL`                         |
| Bot protection                     | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`                                                         |
| Rate limiting across instances     | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`                                                             |
| Careers resumes / applications     | `RESUME_S3_*`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`                                                       |
| Analytics (after consent)          | `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_PROJECT_ID` (or cookieless `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`) |
| Errors & search                    | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`                                   |
| Optional pings                     | `SLACK_WEBHOOK_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`                                                    |

`NEXT_PUBLIC_*` values are compiled into the browser bundle at **build** time: after changing one, rebuild and redeploy. Everything else is read at runtime. Never put a secret in a `NEXT_PUBLIC_*` variable.

Without the optional services the site still works: forms fall back to local files and a mock email outbox. That's fine for testing, **not** for production on Vercel (its filesystem is temporary), so configure the database, email and storage before launch.

---

## Option 1 — Vercel

1. **Import the repository** at vercel.com → _Add New → Project_. Framework preset: Next.js. The defaults (install `pnpm install`, build `pnpm build`) are right — `pnpm build` also generates the Prisma client.
2. **Environment variables:** add the production values from the table above under _Settings → Environment Variables_ (Production, and Preview where useful — e.g. Turnstile test keys and a separate database for previews).
3. **Database:** create a PostgreSQL database (Vercel Postgres/Neon, Supabase, RDS…), set `DATABASE_URL`, then apply the schema once from your machine: `DATABASE_URL=… pnpm db:migrate`. Repeat after any new migration (or add `pnpm db:migrate &&` in front of the build command).
4. **Domain:** _Settings → Domains_ → add `[DOMAIN]` and `www.[DOMAIN]`. Make the apex the primary domain so `www` 301-redirects to it. Point DNS as Vercel shows (A record `76.76.21.21` for the apex, CNAME `cname.vercel-dns.com` for `www`). HTTPS certificates are issued automatically.
5. **Preview deployments** are created for every pull request automatically; production deploys on merges to `main`. Keep the GitHub Actions CI as a required check (see [CI](#ci-and-branch-protection)) so nothing broken reaches `main`.
6. Leave the repository variable `DEPLOY_TARGET` unset so the self-hosted workflow stays off.

---

## Option 2 — Self-hosted VPS

**What runs** (`docker-compose.yml`):

| Service   | What it does                                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `app`     | The Next.js standalone server (`Dockerfile`, Node 22 Alpine, runs as a non-root user, health-checked via `/api/health`) |
| `db`      | PostgreSQL 16 with a persistent volume                                                                                  |
| `migrate` | One-off `prisma migrate deploy`, run before each release                                                                |
| `nginx`   | Reverse proxy: HTTP→HTTPS and www→apex redirects, TLS, brotli/gzip, long cache for build assets                         |
| `certbot` | Let's Encrypt certificates, renewed automatically                                                                       |
| `backup`  | Nightly `pg_dump` to S3-compatible object storage (02:30 IST)                                                           |

### 1. Prepare the server (once)

A 2 GB RAM Ubuntu 24.04 VPS is plenty.

```bash
# As root
adduser deploy && usermod -aG sudo deploy
curl -fsSL https://get.docker.com | sh && usermod -aG docker deploy
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw enable

# As deploy
sudo mkdir -p /opt/arshdeep-site && sudo chown deploy: /opt/arshdeep-site
git clone https://github.com/<you>/<repo>.git /opt/arshdeep-site
cd /opt/arshdeep-site
cp deploy/production.env.example deploy/production.env   # fill it in
chmod 600 deploy/production.env
```

Disable password SSH logins (`PasswordAuthentication no` in `/etc/ssh/sshd_config`) once your key works, and turn on unattended security upgrades (`sudo apt install unattended-upgrades`).

### 2. DNS and TLS

Create `A` (and `AAAA` if you have IPv6) records for `[DOMAIN]` and `www.[DOMAIN]` pointing at the server. Once they resolve:

```bash
./deploy/init-letsencrypt.sh        # CERTBOT_STAGING=1 ./deploy/init-letsencrypt.sh to test first
```

Nginx starts with a temporary self-signed certificate, Certbot completes the HTTP challenge, and Nginx restarts with the real certificate. Renewal is automatic: the `certbot` service checks twice a day, and Nginx reloads its certificates every 6 hours.

### 3. Deploy from GitHub Actions

`.github/workflows/deploy-vps.yml` runs after CI passes on `main`: it builds the app and migration images, pushes them to GitHub Container Registry, then runs `deploy/deploy.sh <commit>` on the server over SSH.

In the GitHub repository settings:

- **Variables:** `DEPLOY_TARGET=vps`, `NEXT_PUBLIC_SITE_URL=https://[DOMAIN]`, plus any other `NEXT_PUBLIC_*` values (GA, Clarity, Turnstile site key, Sentry DSN, Search Console token).
- **Secrets:** `VPS_HOST`, `VPS_USER` (`deploy`), `VPS_SSH_KEY` (a private key whose public half is in `~deploy/.ssh/authorized_keys`), `VPS_KNOWN_HOSTS` (`ssh-keyscan <host>` output), `VPS_PATH` (`/opt/arshdeep-site`).
- On the server, let Docker pull from GHCR: `echo <token> | docker login ghcr.io -u <github-user> --password-stdin` with a token that has `read:packages` (or make the package public).

**Zero-downtime release** (`deploy/deploy.sh`): pull the new images → run migrations → start a second `app` container on the new image alongside the old one → wait until Docker reports it healthy → stop the old container gracefully → scale back to one. Nginx re-resolves the `app` service every 10 seconds and retries a failed connection on the other container, so requests keep flowing. If the new container never becomes healthy, it's removed and the old one keeps serving. Tested locally: 382 requests during a swap, 0 failed.

**Rollback:** `ssh deploy@server 'cd /opt/arshdeep-site && ./deploy/deploy.sh <previous-commit-sha>'` (any previously built tag in GHCR). Database migrations are forward-only — write a new migration rather than editing an applied one.

**Without GitHub Actions** (manual): `docker compose --env-file deploy/production.env build && docker compose --profile tools run --rm migrate && docker compose --env-file deploy/production.env up -d`.

### 4. Backups and restore

Set `BACKUP_S3_BUCKET`, the endpoint (for R2/B2) and keys in `deploy/production.env`. The `backup` service dumps the database nightly (and once at start-up, so mistakes show up immediately) to `s3://<bucket>/postgres/<timestamp>.dump`. Add a **lifecycle rule** on the bucket to delete dumps after, say, 30 days.

Restore a dump:

```bash
aws s3 cp s3://<bucket>/postgres/<timestamp>.dump ./restore.dump --endpoint-url <endpoint>
docker compose cp ./restore.dump db:/tmp/restore.dump
docker compose exec db pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists /tmp/restore.dump
```

Test a restore once before launch — a backup you've never restored isn't a backup yet.

### 5. Day-to-day

```bash
docker compose ps                         # health of every service
docker compose logs -f app nginx          # logs
docker compose exec db psql -U site site  # SQL shell (e.g. select * from leads order by created_at desc;)
```

Uploaded resumes, the local outbox and other fallbacks live in the `app-data` volume; with S3 storage and Resend configured they aren't used.

---

## Email deliverability

Contact and careers emails are sent from `EMAIL_FROM` on `[DOMAIN]`. To keep them out of spam, the domain needs three DNS records. Your provider's dashboard shows the exact values — with **Resend**: _Domains → Add domain_.

| Record | Name                                   | Typical value                                                                                                                                        |
| ------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| SPF    | `send.[DOMAIN]` (Resend) or `[DOMAIN]` | `v=spf1 include:amazonses.com ~all` (Resend) — merge into one SPF record if you already have one (e.g. Google Workspace's `include:_spf.google.com`) |
| DKIM   | `resend._domainkey.[DOMAIN]`           | The `p=…` public key Resend gives you                                                                                                                |
| DMARC  | `_dmarc.[DOMAIN]`                      | Start with `v=DMARC1; p=none; rua=mailto:dmarc@[DOMAIN]; adkim=s; aspf=s`, move to `p=quarantine` after two clean weeks of reports                   |

Resend also asks for an MX record on the `send` subdomain (bounce handling). With SMTP providers (Google Workspace, Zoho, Brevo, SES), use their SPF include and DKIM selector instead.

**Check it:** send a test from the contact form to a Gmail address → _Show original_ should say `SPF: PASS`, `DKIM: PASS`, `DMARC: PASS`. Also run [mail-tester.com](https://www.mail-tester.com) (aim for 9/10+) and confirm both the notification and the auto-reply arrive in the inbox, not spam.

---

## Monitoring

- **Uptime:** in [UptimeRobot](https://uptimerobot.com) or [Better Stack](https://betterstack.com), add two HTTPS monitors at a 5-minute interval: `https://[DOMAIN]/` (expect 200) and `https://[DOMAIN]/api/health` (keyword `"status":"ok"` — it also checks the database). Send alerts to your email and phone.
- **Errors:** create a Sentry project (platform: Next.js / JavaScript), copy its DSN into `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_DSN`. Browser errors, React error boundaries, Server Component/route errors (`src/instrumentation.ts`) and API failures are reported — no SDK is bundled, and IP addresses aren't stored. In Sentry, enable _Security & Privacy → Prevent storing of IP addresses_ too.
- **Analytics:** create a GA4 property and set `NEXT_PUBLIC_GA_MEASUREMENT_ID`. It loads only after a visitor accepts analytics cookies, with Consent Mode v2. Mark `generate_lead` (and optionally `career_apply`, `calendly_open`, `whatsapp_click`) as **key events** in GA4 → Admin → Events. Optional: Microsoft Clarity (`NEXT_PUBLIC_CLARITY_PROJECT_ID`, also consent-gated) or Plausible (cookieless).
- **Search Console:** add the property for `https://[DOMAIN]`, choose _HTML tag_, put the token in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, redeploy, verify — then submit `https://[DOMAIN]/sitemap.xml`. Do the same in Bing Webmaster Tools (it can import from Search Console).

---

## CI and branch protection

`.github/workflows/ci.yml` runs on every pull request and push to `main`: install → lint (zero warnings) → typecheck → format check → unit tests → `pnpm audit` → build → Playwright (desktop + mobile) → broken-link check → Lighthouse CI.

To **block merging on failure**: _Settings → Branches → Add rule_ for `main` → _Require a pull request before merging_ and _Require status checks to pass_ → select **CI / verify**.

Lighthouse CI fails the build on accessibility, best-practices or SEO below 100, layout shift above 0.1, more than 350 KB of JavaScript or 700 KB in total, or any third-party request before consent. Performance score, LCP and TBT are reported as warnings: they depend on the CI machine's CPU, so they're tracked rather than enforced.

Dependabot (`.github/dependabot.yml`) opens weekly update PRs for npm packages, GitHub Actions and Docker base images.
