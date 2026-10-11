#!/bin/sh
# Renders the site config for $DOMAIN, makes sure a certificate exists (a short-lived self-signed
# one until Certbot has issued the real one), then runs Nginx in the foreground and reloads it
# every 6 hours so renewed certificates are picked up.
set -eu

: "${DOMAIN:?Set DOMAIN in deploy/production.env}"
envsubst '${DOMAIN}' < /etc/nginx/templates/site.conf.template > /etc/nginx/http.d/site.conf
rm -f /etc/nginx/http.d/default.conf

live="/etc/letsencrypt/live/${DOMAIN}"
if [ ! -f "${live}/fullchain.pem" ]; then
  echo "No certificate for ${DOMAIN} yet — using a temporary self-signed one."
  live="/etc/nginx/selfsigned"
  mkdir -p "${live}"
  openssl req -x509 -nodes -newkey rsa:2048 -days 2 -subj "/CN=${DOMAIN}" \
    -keyout "${live}/privkey.pem" -out "${live}/fullchain.pem" 2>/dev/null
  sed -i "s#/etc/letsencrypt/live/${DOMAIN}#${live}#g" /etc/nginx/http.d/site.conf
fi

nginx -t
(while :; do sleep 6h; nginx -s reload; done) &
exec nginx -g 'daemon off;'
