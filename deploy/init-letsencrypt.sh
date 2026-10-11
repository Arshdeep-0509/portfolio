#!/usr/bin/env bash
# One-time TLS setup on the server. Nginx starts with a temporary self-signed certificate,
# Certbot answers Let's Encrypt's HTTP challenge through it, then Nginx is restarted with the
# real certificate. Renewal afterwards is automatic (certbot service + Nginx reloads).
#
# Requires DNS A/AAAA records for DOMAIN and www.DOMAIN pointing at this server.
set -euo pipefail
cd "$(dirname "$0")/.."

set -a
# shellcheck disable=SC1091
source deploy/production.env
set +a
: "${DOMAIN:?Set DOMAIN in deploy/production.env}"
: "${CERTBOT_EMAIL:?Set CERTBOT_EMAIL in deploy/production.env}"
STAGING="${CERTBOT_STAGING:-0}" # 1 = Let's Encrypt staging (no rate limits) while testing

docker compose up -d --build nginx

staging_flag=""
if [ "$STAGING" = "1" ]; then staging_flag="--staging"; fi

docker compose run --rm --entrypoint certbot certbot certonly --webroot -w /var/www/certbot \
  $staging_flag --email "$CERTBOT_EMAIL" --agree-tos --no-eff-email \
  -d "$DOMAIN" -d "www.$DOMAIN"

# Restart so the entrypoint picks up the real certificate instead of the self-signed one.
docker compose restart nginx
docker compose up -d certbot
echo "TLS ready for https://$DOMAIN"
