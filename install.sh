#!/bin/bash
# OpenPaw Installation Script
# Run with: bash install.sh

set -e

echo "🐾 OpenPaw Installation Script"
echo "================================"
echo ""

# Check we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this from the openpaw directory"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    echo "❌ Error: Node.js 22+ required (you have: $(node --version))"
    exit 1
fi
echo "✓ Node.js version OK: $(node --version)"

# Check for API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo ""
    echo "⚠️  Anthropic API key not found in environment"
    echo ""
    read -p "Enter your Anthropic API key (sk-ant-...): " API_KEY
    if [ -z "$API_KEY" ]; then
        echo "❌ API key required. Get one from: https://console.anthropic.com/settings/keys"
        exit 1
    fi
    # Add to .env
    sed -i '' "s/ANTHROPIC_API_KEY=.*/ANTHROPIC_API_KEY=$API_KEY/" .env
    echo "✓ API key added to .env"
else
    echo "✓ Found ANTHROPIC_API_KEY in environment"
fi

# Fix npm permissions (requires sudo)
echo ""
echo "Fixing npm permissions (will ask for password)..."
sudo chown -R $(id -u):$(id -g) "$HOME/.npm" || {
    echo "⚠️  Could not fix npm permissions. Try running manually:"
    echo "    sudo chown -R $(id -u):$(id -g) \"$HOME/.npm\""
}

# Install dependencies
echo ""
echo "Installing dependencies (this may take a few minutes)..."
npm install || {
    echo "❌ npm install failed. Check the error above."
    exit 1
}
echo "✓ Dependencies installed"

# Build the project
echo ""
echo "Building OpenPaw..."
npm run build || {
    echo "❌ Build failed. Check the error above."
    exit 1
}
echo "✓ Build complete"

# Success!
echo ""
echo "================================"
echo "🎉 OpenPaw is ready!"
echo ""
echo "To start the gateway:"
echo "  npm run openpaw gateway run --port 18789"
echo ""
echo "To test Paw:"
echo "  npm run openpaw agent --message \"Hello Paw!\" --thinking low"
echo ""
echo "Configuration files:"
echo "  - .env (your API keys)"
echo "  - openpaw.json (model routing)"
echo ""
echo "Paw is waiting. Go to work. 🐾"
