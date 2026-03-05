#!/bin/bash
set -e

echo "=== OpenPaw Render Startup ==="

# Use persistent disk for OpenPaw data
export OPENPAW_WORKSPACE="/data/.openpaw"
mkdir -p "$OPENPAW_WORKSPACE"

# Create symlink from default location to persistent disk
ln -sf "$OPENPAW_WORKSPACE" /opt/render/.openpaw || true

# Ensure bundled skills directory is found by the gateway
# Must use absolute path — relative paths break when cwd changes at runtime
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
for SKILLS_PATH in "$SCRIPT_DIR/skills" "/opt/render/project/src/skills" "$(pwd)/skills"; do
  if [ -d "$SKILLS_PATH" ]; then
    export OPENPAW_BUNDLED_SKILLS_DIR="$(cd "$SKILLS_PATH" && pwd)"
    echo "Bundled skills dir: $OPENPAW_BUNDLED_SKILLS_DIR"
    echo "Skills found: $(ls "$OPENPAW_BUNDLED_SKILLS_DIR" | head -20)"
    break
  fi
done

# Sync PawHub skills directly into managed skills dir (one level deep, not nested under pawhub/)
echo "Syncing PawHub skills to managed dir..."
mkdir -p "$OPENPAW_WORKSPACE/skills"

for REPO_PATH in "$SCRIPT_DIR/skills/pawhub" "/opt/render/project/src/skills/pawhub" "$(pwd)/skills/pawhub"; do
  if [ -d "$REPO_PATH" ]; then
    echo "Found pawhub skills at: $REPO_PATH"
    # Copy each skill dir directly into managed skills (not nested under pawhub/)
    for SKILL_DIR in "$REPO_PATH"/*/; do
      if [ -f "$SKILL_DIR/SKILL.md" ]; then
        SKILL_NAME=$(basename "$SKILL_DIR")
        cp -r "$SKILL_DIR" "$OPENPAW_WORKSPACE/skills/$SKILL_NAME"
        echo "  Synced: $SKILL_NAME"
      fi
    done
    break
  fi
done

echo "Skills sync complete"
echo "Managed skills: $(ls "$OPENPAW_WORKSPACE/skills/" 2>/dev/null | tr '\n' ' ')"

# Setup Uber credentials for RandomRide skill
if [ -f "./skills/pawhub/randomride/setup-credentials.sh" ]; then
  echo "Setting up Uber API credentials..."
  bash ./skills/pawhub/randomride/setup-credentials.sh
fi

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
