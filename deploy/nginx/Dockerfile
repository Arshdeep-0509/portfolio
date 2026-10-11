# Nginx from Alpine's packages, which ship a matching brotli module (the official nginx image
# doesn't include brotli). envsubst fills ${DOMAIN} into the site config at start-up.
FROM alpine:3.21
RUN apk add --no-cache nginx nginx-mod-http-brotli gettext openssl \
  && mkdir -p /var/www/certbot /run/nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY site.conf.template /etc/nginx/templates/site.conf.template
COPY tls.inc /etc/nginx/http.d/tls.inc
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 80 443
ENTRYPOINT ["/entrypoint.sh"]
