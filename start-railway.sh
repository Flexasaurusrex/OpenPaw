#!/bin/bash
set -e

echo "===== Railway Startup Debug ====="
echo "PORT env var: '${PORT}'"
echo "All env vars:"
env | grep -i port || echo "No PORT-related vars found"
echo "================================="

# Use Railway's PORT or default to 18789
GATEWAY_PORT="${PORT:-18789}"
echo "Starting gateway on port: $GATEWAY_PORT"

exec node dist/entry.js gateway run --bind 0.0.0.0 --port "$GATEWAY_PORT"
