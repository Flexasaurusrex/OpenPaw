#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_NAME="${OPENPAW_CLEANUP_SMOKE_IMAGE:-${PAWBOT_CLEANUP_SMOKE_IMAGE:-openpaw-cleanup-smoke:local}}"

echo "==> Build image: $IMAGE_NAME"
docker build \
  -t "$IMAGE_NAME" \
  -f "$ROOT_DIR/scripts/docker/cleanup-smoke/Dockerfile" \
  "$ROOT_DIR"

echo "==> Run cleanup smoke test"
docker run --rm -t "$IMAGE_NAME"
