# OpenPaw Quick Start Guide 🐾

## What You Have

✅ Fully rebranded OpenPaw (from OpenClaw)
✅ Custom Paw personality installed (SOUL.md)
✅ Smart model routing configured (Haiku → Sonnet)
✅ Security-hardened defaults ready

## Next Steps to Get Running

### 1. Add Your Anthropic API Key

Edit `.env` and add your API key:

```bash
# Open the .env file
nano .env

# Replace this line:
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# With your actual key:
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
```

Get your key from: https://console.anthropic.com/settings/keys

### 2. Fix npm Permissions (if needed)

```bash
sudo chown -R $(id -u):$(id -g) "$HOME/.npm"
```

### 3. Install Dependencies

```bash
cd /Users/flex/Desktop/openpaw

# Using npm
npm install

# OR using pnpm (recommended)
npm install -g pnpm@10.23.0
pnpm install
```

### 4. Build the Project

```bash
npm run build
# OR
pnpm build
```

### 5. Start OpenPaw

```bash
# Method 1: Direct gateway start
npm run openpaw gateway run --port 18789

# Method 2: Using the onboarding wizard
npm run openpaw onboard --install-daemon
```

## Testing Your Setup

Once running, test Paw:

```bash
# Quick test (uses Haiku - fast and cheap)
openpaw agent --message "Hello Paw! Tell me about yourself" --thinking low

# Complex reasoning test (uses Sonnet - slower but smarter)
openpaw agent --message "Explain the architecture of a distributed system with examples" --thinking high
```

## Model Routing Strategy

- **Haiku** (default): ~$0.25/1M input tokens - Fast routine tasks
- **Sonnet** (--thinking high): ~$3/1M input tokens - Complex reasoning

See `MODEL_ROUTING_GUIDE.md` for full details.

## Configuration Files

- `.env` - Your API keys and secrets
- `openpaw.json` - Model routing and gateway settings
- `docs/reference/templates/SOUL.md` - Paw's personality definition

## Connecting Messaging Channels

### Telegram
1. Create a bot with @BotFather
2. Add token to `.env`: `TELEGRAM_BOT_TOKEN=123456:ABCDEF...`
3. Restart gateway

### Discord
1. Create a Discord application
2. Add bot token to `.env`: `DISCORD_BOT_TOKEN=...`
3. Restart gateway

### WhatsApp
1. Scan QR code during onboarding
2. Follow instructions in terminal

Full channel docs: `docs/channels/`

## Security Notes

OpenPaw is configured with security-first defaults:

✅ **Authentication**: Token-based auth enabled by default
✅ **Binding**: Gateway bound to localhost (127.0.0.1) only
✅ **Credentials**: Environment variables (not committed to git)

⚠️ **NEVER commit `.env` to git** - it contains your API keys

## Need Help?

- **Docs**: `docs/` directory
- **Issues**: https://github.com/openpaw/openpaw/issues
- **Model Config**: `MODEL_ROUTING_GUIDE.md`
- **Rebrand Summary**: `REBRAND_SUMMARY.md`

## Troubleshooting

### "Cannot find module"
Run `npm install` or `pnpm install`

### "EACCES: permission denied"
Run: `sudo chown -R $(id -u):$(id -g) "$HOME/.npm"`

### "No API key found"
Check that `.env` has `ANTHROPIC_API_KEY=sk-ant-...`

### Gateway won't start
Check logs: `tail -f ~/.openpaw/logs/gateway.log`

---

**Paw is ready. Go to work.** 🐾
