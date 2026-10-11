#!/usr/bin/env bash
# Zero-downtime release on the VPS. Usage: deploy/deploy.sh <image-tag>
#   1. pull the new app + migrator images
#   2. apply database migrations
#   3. start a second app container on the new image and wait until it's healthy
#   4. retire the old container (Nginx re-resolves "app" every 10s and retries on the other
#      container, so no request is dropped), then scale back to one
# If the new container never becomes healthy, it's removed and the old one keeps serving.
set -euo pipefail
cd "$(dirname "$0")/.."

TAG="${1:?usage: deploy/deploy.sh <image-tag>}"
REGISTRY="${REGISTRY:-ghcr.io/arshdeep-0509/arshdeep-site}"
export APP_IMAGE="${REGISTRY}:${TAG}"
export MIGRATE_IMAGE="${REGISTRY}-migrate:${TAG}"

echo "→ Pulling ${APP_IMAGE}"
docker compose pull app
docker compose --profile tools pull migrate

echo "→ Migrating the database"
docker compose --profile tools run --rm migrate

old_ids="$(docker compose ps -q app)"

echo "→ Starting the new container alongside the old one"
docker compose up -d --no-deps --no-recreate --scale app=2 app

new_id=""
for id in $(docker compose ps -q app); do
  if ! grep -q "$id" <<<"$old_ids"; then new_id="$id"; fi
done
# First deploy (nothing running yet): the only container is the new one.
if [ -z "$new_id" ]; then new_id="$(docker compose ps -q app | head -n1)"; old_ids=""; fi

echo "→ Waiting for ${new_id:0:12} to become healthy"
for _ in $(seq 1 60); do
  status="$(docker inspect -f '{{.State.Health.Status}}' "$new_id")"
  if [ "$status" = "healthy" ]; then break; fi
  if [ "$status" = "unhealthy" ]; then break; fi
  sleep 2
done

if [ "$status" != "healthy" ]; then
  echo "✗ New container is ${status}; rolling back"
  docker logs --tail 50 "$new_id" || true
  docker rm -f "$new_id"
  exit 1
fi

for id in $old_ids; do
  echo "→ Retiring ${id:0:12}"
  # Give Nginx's resolver time to see the new container, then stop the old one gracefully.
  sleep 12
  docker stop --time 20 "$id"
  docker rm "$id"
done

docker compose up -d --no-deps --no-recreate --scale app=1 app
docker image prune -f > /dev/null
echo "✓ Released ${TAG}"
