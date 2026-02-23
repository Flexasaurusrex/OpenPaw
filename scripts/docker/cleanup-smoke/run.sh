#!/usr/bin/env bash
set -euo pipefail

cd /repo

export OPENPAW_STATE_DIR="/tmp/openpaw-test"
export OPENPAW_CONFIG_PATH="${OPENPAW_STATE_DIR}/openpaw.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${OPENPAW_STATE_DIR}/credentials"
mkdir -p "${OPENPAW_STATE_DIR}/agents/main/sessions"
echo '{}' >"${OPENPAW_CONFIG_PATH}"
echo 'creds' >"${OPENPAW_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${OPENPAW_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm openpaw reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${OPENPAW_CONFIG_PATH}"
test ! -d "${OPENPAW_STATE_DIR}/credentials"
test ! -d "${OPENPAW_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${OPENPAW_STATE_DIR}/credentials"
echo '{}' >"${OPENPAW_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm openpaw uninstall --state --yes --non-interactive

test ! -d "${OPENPAW_STATE_DIR}"

echo "OK"
