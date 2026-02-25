# OpenPaw Setup Guide

This guide will help you get OpenPaw running with Telegram in under 10 minutes.

## Prerequisites

- Node.js 22+ installed
- An Anthropic API key ([Get one here](https://console.anthropic.com/settings/keys))
- A Telegram account

---

## Step 1: Clone and Install

```bash
git clone https://github.com/Flexasaurusrex/OpenPaw.git
cd OpenPaw
pnpm install
```

---

## Step 2: Create a Telegram Bot

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Follow the prompts:
   - **Bot name**: `My Paw Bot` (or whatever you want)
   - **Username**: `MyPawBot` (must end in "bot")
4. BotFather will reply with your **bot token** - save this!
   ```
   Example: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```

---

## Step 3: Configure OpenPaw

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add:

```bash
ANTHROPIC_API_KEY=your_anthropic_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

---

## Step 4: Configure OpenPaw Settings

```bash
# Set gateway mode
pnpm openpaw config set gateway.mode local

# Enable Telegram channel
pnpm openpaw config set channels.telegram.enabled true

# Enable Telegram plugin (CRITICAL!)
pnpm openpaw plugins enable telegram
```

**Note:** The plugin enable step is separate from channel config and is required for Telegram to work!

---

## Step 5: Start OpenPaw

```bash
pnpm openpaw gateway run
```

You should see:

```
[gateway] listening on ws://0.0.0.0:18789
[telegram] [default] starting provider (@YourBotName)
[telegram] polling started
```

If you see "polling started" - you're good! ✅

---

## Step 6: Test Your Bot

1. Open Telegram
2. Search for your bot username (e.g., `@MyPawBot`)
3. Send `/start`
4. You'll get a **pairing code**
5. In your terminal, run:
   ```bash
   pnpm openpaw pairing approve telegram [PAIRING-CODE]
   ```
6. Send another message - your bot should respond!

---

## Troubleshooting

### "Plugin telegram is disabled"

Even if channel config shows enabled, the plugin might be disabled. Run:

```bash
pnpm openpaw plugins enable telegram
```

Then restart the gateway.

### "No telegram messages in logs"

Check:

1. Is `TELEGRAM_BOT_TOKEN` set in `.env`?
2. Did you enable the telegram plugin?
3. Did you restart the gateway after enabling?

Run:

```bash
pnpm openpaw plugins list | grep telegram
```

Should show "enabled", not "disabled".

### Changing the AI Model

By default, OpenPaw uses Claude Haiku 4.5 (fast and affordable).

To change models, message your bot:

```
/model
```

Pick from the list (Haiku, Sonnet, or Opus).

---

## Next Steps

- **Deploy to cloud**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for 24/7 hosting
- **Add more channels**: Discord, Slack, WhatsApp
- **Install skills**: Check out [PawHub](https://pawhub.ai) (coming soon)
- **Customize**: Edit `src/agents/defaults.ts` to change personality

---

## Need Help?

- [OpenPaw GitHub Issues](https://github.com/Flexasaurusrex/OpenPaw/issues)
- [OpenPaw Discord](https://discord.gg/openpaw) (coming soon)

---

🐾 **Welcome to OpenPaw!**
