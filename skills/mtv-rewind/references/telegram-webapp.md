# Telegram Web App Integration

MTV Rewind uses Telegram's Web App (Mini App) feature to embed the video player directly inside the Telegram chat experience.

## How It Works

1. User says "play MTV" (or similar trigger)
2. Paw sends a message with an `InlineKeyboardButton` using the `web_app` field
3. User taps the button → Telegram opens the MTV Rewind player in its built-in browser
4. Video plays inside Telegram — no external app switch needed

## Telegram Bot API

The skill uses the `web_app` button type:

```json
{
  "text": "📺 Watch MTV Rewind",
  "web_app": {
    "url": "https://wantmymtv.xyz/embed.html?channel=all"
  }
}
```

This is supported in Telegram Bot API 6.0+ and works on iOS, Android, and Telegram Desktop.

## Channel Parameters

- `?channel=all` — All eras mixed
- `?channel=80s` — 1980s MTV
- `?channel=90s` — 1990s MTV
- `?channel=2000s` — 2000s MTV

## Requirements

- Telegram Bot API 6.0+
- HTTPS URL (wantmymtv.xyz serves over HTTPS)
- No additional API keys or authentication needed
