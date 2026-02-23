#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_NAME="${OPENPAW_IMAGE:-${PAWBOT_IMAGE:-openpaw:local}}"
CONFIG_DIR="${OPENPAW_CONFIG_DIR:-${PAWBOT_CONFIG_DIR:-$HOME/.openpaw}}"
WORKSPACE_DIR="${OPENPAW_WORKSPACE_DIR:-${PAWBOT_WORKSPACE_DIR:-$HOME/.openpaw/workspace}}"
PROFILE_FILE="${OPENPAW_PROFILE_FILE:-${PAWBOT_PROFILE_FILE:-$HOME/.profile}}"

PROFILE_MOUNT=()
if [[ -f "$PROFILE_FILE" ]]; then
  PROFILE_MOUNT=(-v "$PROFILE_FILE":/home/node/.profile:ro)
fi

echo "==> Build image: $IMAGE_NAME"
docker build -t "$IMAGE_NAME" -f "$ROOT_DIR/Dockerfile" "$ROOT_DIR"

echo "==> Run live model tests (profile keys)"
docker run --rm -t \
  --entrypoint bash \
  -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  -e HOME=/home/node \
  -e NODE_OPTIONS=--disable-warning=ExperimentalWarning \
  -e OPENPAW_LIVE_TEST=1 \
  -e OPENPAW_LIVE_MODELS="${OPENPAW_LIVE_MODELS:-${PAWBOT_LIVE_MODELS:-all}}" \
  -e OPENPAW_LIVE_PROVIDERS="${OPENPAW_LIVE_PROVIDERS:-${PAWBOT_LIVE_PROVIDERS:-}}" \
  -e OPENPAW_LIVE_MODEL_TIMEOUT_MS="${OPENPAW_LIVE_MODEL_TIMEOUT_MS:-${PAWBOT_LIVE_MODEL_TIMEOUT_MS:-}}" \
  -e OPENPAW_LIVE_REQUIRE_PROFILE_KEYS="${OPENPAW_LIVE_REQUIRE_PROFILE_KEYS:-${PAWBOT_LIVE_REQUIRE_PROFILE_KEYS:-}}" \
  -v "$CONFIG_DIR":/home/node/.openpaw \
  -v "$WORKSPACE_DIR":/home/node/.openpaw/workspace \
  "${PROFILE_MOUNT[@]}" \
  "$IMAGE_NAME" \
  -lc "set -euo pipefail; [ -f \"$HOME/.profile\" ] && source \"$HOME/.profile\" || true; cd /app && pnpm test:live"
