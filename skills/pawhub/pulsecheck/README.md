# PulseCheck 📊

Query Google Analytics via Telegram. Get your site stats in plain English, right in your chat.

## Quick Start

```bash
npm install -g @pawhub/pulsecheck

# Setup
pulsecheck setup

# Configure (or use setup wizard)
pulsecheck config:set gaPropertyId YOUR_PROPERTY_ID
pulsecheck config:set gaCredentials ~/.pulsecheck/creds.json
pulsecheck config:set telegramToken YOUR_BOT_TOKEN
pulsecheck config:set telegramChatId YOUR_CHAT_ID

# Start bot
pulsecheck bot
```

## Telegram Commands

Once the bot is running, message it:

- `/pulse` - Quick stats (live users + top pages)
- `/top [period]` - Top pages (today, yesterday, 7d, 30d)
- `/sources [period]` - Traffic sources
- `/realtime` - Live users by city

## CLI Usage

```bash
# Query from command line
pulsecheck query "top pages today"
pulsecheck query "traffic sources" --period 7d
pulsecheck query "realtime"

# Check config
pulsecheck config
```

## Google Analytics Setup

1. Go to Google Cloud Console
2. Create a service account
3. Download JSON key file
4. Enable Google Analytics Data API
5. Add service account email to GA4 property (Viewer role)
6. Get your GA4 Property ID from Admin > Property > Property Details

## Telegram Setup

1. Message @BotFather on Telegram
2. Create a new bot with `/newbot`
3. Save the bot token
4. Message @userinfobot to get your chat ID
5. Configure PulseCheck with both values

## Example

```bash
# Start the bot
pulsecheck bot

# Then in Telegram:
You: /pulse

Bot: 📊 PulseCheck

Right now: 47 users online

Today's top pages:
1. /blog/post-1 (1,234 views)
2. / (987 views)
3. /about (456 views)

Total today: 5,432 views
```

## License

MIT
