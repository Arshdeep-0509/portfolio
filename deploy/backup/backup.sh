#!/bin/sh
# Dumps the database (custom format, compressed) and uploads it to object storage.
# Retention: set a lifecycle rule on the bucket (e.g. delete after 30 days) — see DEPLOYMENT.md.
set -eu

: "${POSTGRES_USER:?}" "${POSTGRES_PASSWORD:?}" "${POSTGRES_DB:?}"
if [ -z "${BACKUP_S3_BUCKET:-}" ]; then
  echo "[backup] BACKUP_S3_BUCKET is not set — skipping. Configure it in deploy/production.env."
  exit 0
fi
: "${AWS_ACCESS_KEY_ID:?}" "${AWS_SECRET_ACCESS_KEY:?}"

stamp="$(TZ=Asia/Kolkata date +%Y-%m-%dT%H%M)"
file="/tmp/${POSTGRES_DB}-${stamp}.dump"

PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump -h db -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -Fc -f "${file}"

endpoint=""
if [ -n "${BACKUP_S3_ENDPOINT:-}" ]; then endpoint="--endpoint-url ${BACKUP_S3_ENDPOINT}"; fi
# shellcheck disable=SC2086
aws s3 cp "${file}" "s3://${BACKUP_S3_BUCKET}/postgres/${stamp}.dump" ${endpoint} --only-show-errors

echo "[backup] $(date -Iseconds) uploaded ${stamp}.dump ($(du -h "${file}" | cut -f1))"
rm -f "${file}"
