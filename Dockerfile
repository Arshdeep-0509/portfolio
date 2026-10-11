# syntax=docker/dockerfile:1.7
#
# Multi-stage build for self-hosting (see DEPLOYMENT.md).
#   docker build -t arshdeep-site .                       → the web app (target: runner)
#   docker build --target migrator -t arshdeep-migrate .  → runs `prisma migrate deploy`
#
# NEXT_PUBLIC_* values are compiled into the browser bundle, so they are build arguments.

ARG NODE_VERSION=22-alpine

# ---------------------------------------------------------------------------- base
FROM node:${NODE_VERSION} AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat && corepack enable
WORKDIR /app

# ---------------------------------------------------------------------------- deps
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# `postinstall` runs `prisma generate`, which needs the schema and config.
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ---------------------------------------------------------------------------- builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_CLARITY_PROJECT_ID
ARG NEXT_PUBLIC_PLAUSIBLE_DOMAIN
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
ENV BUILD_STANDALONE=true \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID \
    NEXT_PUBLIC_CLARITY_PROJECT_ID=$NEXT_PUBLIC_CLARITY_PROJECT_ID \
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$NEXT_PUBLIC_PLAUSIBLE_DOMAIN \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY \
    NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
RUN pnpm build

# ---------------------------------------------------------------------------- migrator
# One-off container that applies database migrations before a new release goes live.
FROM base AS migrator
COPY --from=deps /app/node_modules ./node_modules
COPY package.json prisma.config.ts ./
COPY prisma ./prisma
USER node
CMD ["node_modules/.bin/prisma", "migrate", "deploy"]

# ---------------------------------------------------------------------------- runner
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# MDX case studies and posts are also read at request time (the proxy checks slugs).
COPY --from=builder --chown=nextjs:nodejs /app/content ./content
# Local fallbacks (.data/) when no database or object storage is configured — mount a volume.
RUN mkdir -p .data && chown nextjs:nodejs .data

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health > /dev/null || exit 1

CMD ["node", "server.js"]
