#!/bin/bash
set -e

echo "=== OpenPaw Render Startup ==="

# Use persistent disk for OpenPaw data
export OPENPAW_WORKSPACE="/data/.openpaw"
mkdir -p "$OPENPAW_WORKSPACE"

# Create symlink from default location to persistent disk
ln -sf "$OPENPAW_WORKSPACE" /opt/render/.openpaw || true

# Set config
echo "Setting gateway config..."
pnpm openpaw config set gateway.mode local
pnpm openpaw config set channels.telegram.enabled true

# Enable telegram plugin
echo "Enabling telegram plugin..."
pnpm openpaw plugins enable telegram

# Verify plugin is enabled
echo "Verifying telegram plugin status..."
PLUGIN_STATUS=$(pnpm openpaw plugins list 2>&1 | grep -A 1 "telegram" | grep -o "enabled\|disabled" | head -1)

if [ "$PLUGIN_STATUS" = "disabled" ]; then
  echo "ERROR: Telegram plugin is still disabled after enable command!"
  echo "Attempting direct config modification..."

  # Try to enable via config file directly
  node -e "
    const fs = require('fs');
    const path = '/opt/render/.openpaw/openpaw.json';
    const config = JSON.parse(fs.readFileSync(path, 'utf8'));
    config.plugins = config.plugins || {};
    config.plugins.entries = config.plugins.entries || {};
    config.plugins.entries.telegram = { enabled: true };
    fs.writeFileSync(path, JSON.stringify(config, null, 2));
    console.log('Telegram plugin enabled in config');
  "
fi

echo "Starting gateway..."
exec pnpm openpaw gateway run --bind lan --port $PORT
