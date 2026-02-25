#!/bin/bash
set -e

echo "=== Cloud Paw Startup ==="
echo "PORT: $PORT"

# Set workspace path
export OPENPAW_WORKSPACE="/opt/render/.openpaw/workspace"

# Clone or update workspace from GitHub
if [ -d "$OPENPAW_WORKSPACE/.git" ]; then
  echo "=== Updating workspace from GitHub ==="
  cd "$OPENPAW_WORKSPACE"
  git pull origin main || echo "Warning: Could not pull workspace updates"
else
  echo "=== Cloning workspace from GitHub ==="
  mkdir -p /opt/render/.openpaw
  git clone https://github.com/Flexasaurusrex/openpaw-workspace.git "$OPENPAW_WORKSPACE" || {
    echo "Warning: Could not clone workspace, will use default"
  }
fi

# Return to app directory
cd /opt/render/project/src

# Copy extensions
echo "=== Setting up extensions ==="
cp -r extensions src/ 2>/dev/null || true

# Start gateway (skip config commands that might fail)
echo "=== Starting Cloud Paw on port $PORT ==="
exec node --max-old-space-size=1024 dist/entry.js gateway run --bind 0.0.0.0 --port $PORT --allow-unconfigured
