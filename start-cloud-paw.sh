#!/bin/bash
set -e

echo "=== Cloud Paw Startup ==="
echo "PORT: $PORT"

# Set workspace path
WORKSPACE_PATH="/opt/render/.openpaw/workspace"

# Clone or update workspace from GitHub
if [ -d "$WORKSPACE_PATH/.git" ]; then
  echo "=== Updating workspace from GitHub ==="
  cd "$WORKSPACE_PATH"
  git pull origin main || echo "Warning: Could not pull workspace updates"
else
  echo "=== Cloning workspace from GitHub ==="
  mkdir -p /opt/render/.openpaw
  git clone https://github.com/Flexasaurusrex/openpaw-workspace.git "$WORKSPACE_PATH" || {
    echo "Warning: Could not clone workspace, creating empty workspace"
    mkdir -p "$WORKSPACE_PATH"
  }
fi

# Return to app directory
cd /opt/render/project/src

# Copy extensions
echo "=== Setting up extensions ==="
cp -r extensions src/ 2>/dev/null || true

# Configure gateway
echo "=== Configuring OpenPaw ==="
npx openpaw config set gateway.mode local
npx openpaw config set agent.workspace "$WORKSPACE_PATH"
npx openpaw doctor --fix

# Start gateway
echo "=== Starting Cloud Paw on port $PORT ==="
exec node --max-old-space-size=1024 dist/entry.js gateway run --bind 0.0.0.0 --port $PORT --allow-unconfigured
