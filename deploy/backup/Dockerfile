# Nightly PostgreSQL backups to S3-compatible object storage (AWS S3, Cloudflare R2, Backblaze B2…).
FROM postgres:16-alpine
RUN apk add --no-cache aws-cli tzdata
# Cron times below are India time.
ENV TZ=Asia/Kolkata
COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh \
  && echo "30 2 * * * /usr/local/bin/backup.sh >> /proc/1/fd/1 2>&1" > /etc/crontabs/root
# One backup at start-up (so a misconfiguration shows up immediately), then cron in the foreground.
CMD ["/bin/sh", "-c", "/usr/local/bin/backup.sh; exec crond -f -l 8"]
