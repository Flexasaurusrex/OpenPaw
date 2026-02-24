# CryptoWatch 🔐

On-chain monitoring, price alerts, and portfolio tracking via Telegram. Watch wallets, get notified of transactions, track token prices.

## Quick Start

```bash
npm install -g @pawhub/cryptowatch

# Setup
cryptowatch setup

# Configure
cryptowatch config:set telegramToken YOUR_BOT_TOKEN
cryptowatch config:set telegramChatId YOUR_CHAT_ID

# Optional: API keys for better features
cryptowatch config:set etherscanApiKey YOUR_KEY
cryptowatch config:set basescanApiKey YOUR_KEY
cryptowatch config:set coingeckoApiKey YOUR_KEY

# Watch a wallet
cryptowatch watch 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb "vitalik.eth"

# Set price alert
cryptowatch alert ETH above 5000

# Start bot
cryptowatch bot
```

## Features

### Wallet Watching
- Track any Ethereum/Base/Polygon/Arbitrum wallet
- Get notified of new transactions
- Check balances (ETH + tokens)
- View recent transaction history

### Price Alerts
- Set alerts for any token
- Above/below price triggers
- Real-time notifications via Telegram

### Portfolio Tracking
- Track multiple wallets
- Aggregate holdings across chains
- Calculate total portfolio value

## Telegram Commands

Once the bot is running:

- `/wallets` - List watched wallets
- `/balance <address|label>` - Check wallet balance
- `/watch <address> <label>` - Watch a new wallet
- `/price <token>` - Get current token price
- `/alerts` - List price alerts
- `/alert <token> above|below <price>` - Set price alert
- `/help` - Show all commands

## CLI Usage

```bash
# Watch wallets
cryptowatch watch 0x... "my-wallet" --chain ethereum
cryptowatch wallets
cryptowatch balance "my-wallet"

# Price tracking
cryptowatch price ETH
cryptowatch alert BTC above 100000
cryptowatch alerts

# Start monitoring
cryptowatch bot
```

## Configuration

```bash
# View config
cryptowatch config

# Set values
cryptowatch config:set <key> <value>

# Available keys:
# - telegramToken (required)
# - telegramChatId (required)
# - etherscanApiKey (optional)
# - basescanApiKey (optional)
# - coingeckoApiKey (optional)
# - checkInterval (default: 5 minutes)
```

## API Keys

### Etherscan (Ethereum)
1. Sign up at https://etherscan.io
2. Go to API-KEYs
3. Create a new key
4. `cryptowatch config:set etherscanApiKey YOUR_KEY`

### Basescan (Base)
1. Sign up at https://basescan.org
2. Go to API-KEYs
3. Create a new key
4. `cryptowatch config:set basescanApiKey YOUR_KEY`

### CoinGecko (Prices)
- Free tier works without API key
- Pro tier for better rate limits: https://www.coingecko.com/en/api

### Telegram
1. Message @BotFather, create bot with `/newbot`
2. Save the bot token
3. Message @userinfobot to get your chat ID

## Example

```bash
# Watch Vitalik's wallet
cryptowatch watch 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb "vitalik.eth" --chain ethereum

# Set price alerts
cryptowatch alert ETH above 5000
cryptowatch alert DEGEN above 0.01

# Start monitoring
cryptowatch bot

# Then in Telegram:
You: /balance vitalik.eth

Bot: 💰 vitalik.eth
`0x742d35Cc...95f0bEb`

Balance: 243.7832 ETH

Tokens:
• USDC: 1,234.56
• DAI: 567.89

Recent Transactions:
• 0.5 ETH
  `0xabc123...`
```

## License

MIT
