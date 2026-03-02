# OpenPaw Quick Start Guide 🐾

## Prerequisites

- **Node.js 22+** — [Download](https://nodejs.org/) or `nvm install 22`
- **pnpm** — `npm install -g pnpm`

## What You Get

✅ Security-hardened AI agent gateway
✅ Custom Paw personality (SOUL.md)
✅ Smart model routing (Haiku → Sonnet)
✅ Multi-channel messaging (Telegram, Discord, WhatsApp, and more)

## Setup

### 1. Clone and install

```bash
git clone https://github.com/Flexasaurusrex/OpenPaw.git
cd OpenPaw
pnpm install
```

### 2. Configure your API key

```bash
cp .env.example .env
```

Edit `.env` and set your API key:

```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
```

Get your key from: https://console.anthropic.com/settings/keys

### 3. Build the project

```bash
pnpm build
```

### 4. Start OpenPaw

```bash
# Option 1: Guided onboarding wizard (recommended for first run)
pnpm openpaw onboard

# Option 2: Direct gateway start
pnpm openpaw gateway run --port 18789
```

## Testing Your Setup

Once running, test Paw:

```bash
# Quick test (uses Haiku - fast and cheap)
pnpm openpaw agent --message "Hello Paw! Tell me about yourself" --thinking low

# Complex reasoning test (uses Sonnet - slower but smarter)
pnpm openpaw agent --message "Explain the architecture of a distributed system with examples" --thinking high
```

## Model Routing Strategy

- **Haiku** (default): ~$0.25/1M input tokens — Fast routine tasks
- **Sonnet** (--thinking high): ~$3/1M input tokens — Complex reasoning

See `MODEL_ROUTING_GUIDE.md` for full details.

## Configuration Files

- `.env` — Your API keys and secrets
- `openpaw.json` — Model routing and gateway settings
- `docs/reference/templates/SOUL.md` — Paw's personality definition

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

⚠️ **NEVER commit `.env` to git** — it contains your API keys

## Need Help?

- **Docs**: `docs/` directory
- **Issues**: https://github.com/Flexasaurusrex/OpenPaw/issues
- **Model Config**: `MODEL_ROUTING_GUIDE.md`

## Troubleshooting

### "Cannot find module"

Run `pnpm install` then `pnpm build`

### "No API key found"

Check that `.env` has `ANTHROPIC_API_KEY=sk-ant-...`

### Gateway won't start

Check logs: `tail -f ~/.openpaw/logs/gateway.log`

---

**Paw is ready. Go to work.** 🐾
