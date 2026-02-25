# Deploying OpenPaw to the Cloud

Get your OpenPaw bot running 24/7 in the cloud with Render (free tier available).

---

## Why Deploy to Cloud?

- 🌍 **24/7 availability** - Bot never sleeps
- 📱 **Always accessible** - Use from anywhere
- 💰 **Affordable** - Free tier or ~$7-25/month
- 🔄 **Auto-updates** - Push to GitHub, auto-deploys

---

## Deploy to Render (Recommended)

### Prerequisites

- GitHub account
- Render account ([Sign up free](https://render.com))
- Anthropic API key
- Telegram bot token ([Get one from @BotFather](../docs/setup.md))

---

### Step 1: Push to GitHub

```bash
# Fork or push OpenPaw to your GitHub account
git remote add origin https://github.com/YOUR-USERNAME/OpenPaw.git
git push -u origin main
```

---

### Step 2: Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account
4. Select your **OpenPaw** repository
5. Branch: `main`

Render will detect `render.yaml` and show:

- Service: `openpaw-live`
- Runtime: **Node** ✅ (CRITICAL: Must be Node, not Python!)
- Type: Web Service

---

### Step 3: Configure Environment Variables

Render will prompt for these values:

**Required:**

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

**Optional:**

```
TELEGRAM_CHAT_ID=your_telegram_user_id
```

To get your Telegram user ID:

1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. It will reply with your ID (e.g., `123456789`)

---

### Step 4: Deploy

Click **"Apply"** or **"Create"**

Render will:

1. ✅ Clone your repo
2. ✅ Install dependencies (`pnpm install`)
3. ✅ Build OpenPaw (`pnpm build`)
4. ✅ Configure gateway and channels
5. ✅ Enable Telegram plugin
6. ✅ Start the gateway

---

### Step 5: Verify Deployment

Watch the deploy logs. Look for:

```
✔ Build complete
[gateway] listening on ws://0.0.0.0:10000
[telegram] [default] starting provider (@YourBotName)
[telegram] polling started
```

**If you see "polling started" - YOU'RE LIVE!** 🎉

---

### Step 6: Test Your Cloud Bot

1. Open Telegram
2. Message your bot (e.g., `@MyCloudPawBot`)
3. You'll get a **pairing code**
4. Go to **Render → Shell** tab
5. Run:
   ```bash
   cd /opt/render/project/src
   pnpm openpaw pairing approve telegram [CODE]
   ```
6. Message your bot again - it should respond!

---

## Troubleshooting

### "Service shows Python 3 runtime"

❌ **CRITICAL ERROR** - OpenPaw is a Node.js app!

**Fix:**

1. Delete the service
2. Create new service using **Blueprint** method (not manual)
3. Ensure it shows **Runtime: Node**

### "Telegram plugin disabled"

The startup script should handle this, but if it fails:

1. Go to Render → Shell
2. Run:
   ```bash
   pnpm openpaw plugins enable telegram
   pkill -f openpaw-gateway
   ```
3. Render will auto-restart

### "Gateway won't start"

Check Render logs for errors. Common issues:

- Missing `TELEGRAM_BOT_TOKEN` env var
- Missing `ANTHROPIC_API_KEY` env var
- Wrong runtime (should be Node, not Python)

---

## Updating Your Deployment

Any push to your GitHub `main` branch auto-deploys:

```bash
git add .
git commit -m "Update bot configuration"
git push
```

Render will automatically:

1. Pull latest code
2. Rebuild
3. Redeploy

**Zero downtime!**

---

## Cost Breakdown

### Render Pricing

**Free Tier:**

- ❌ Sleeps after 15 min inactivity
- ❌ 750 hours/month limit
- ❌ Not suitable for 24/7 bots

**Starter ($7/month):**

- ✅ Always on
- ✅ 512MB RAM
- ✅ Good for personal use

**Standard ($25/month):**

- ✅ Always on
- ✅ 2GB RAM
- ✅ Better performance

### Claude API Costs

**Haiku 4.5 (default):**

- $0.80 per million input tokens
- $4 per million output tokens
- ~$10-20/month for moderate use

**Sonnet 4.6 (premium):**

- $3 per million input tokens
- $15 per million output tokens
- ~$40-80/month for moderate use

**Total: ~$20-50/month** for 24/7 personal AI assistant

---

## Advanced: Multiple Environments

Run separate bots for dev/prod:

**Production:**

```yaml
# render.yaml
name: openpaw-prod
```

**Development:**

```yaml
# render-dev.yaml
name: openpaw-dev
```

Use different Telegram bots for each environment.

---

## Next Steps

- **Monitor logs**: Bookmark your Render logs page
- **Set up alerts**: Render can notify you of failures
- **Scale up**: Upgrade to Standard if you get heavy usage
- **Add channels**: Discord, Slack, WhatsApp ([docs](./setup.md))

---

🐾 **Your Paw is now in the cloud!**
