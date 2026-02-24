import TelegramBot from 'node-telegram-bot-api';
import { ConfigManager } from './config.js';
import { BlockchainService } from './blockchain.js';
import { PriceService } from './prices.js';

export class TelegramService {
  private bot: TelegramBot;
  private chatId: string;
  private blockchain: BlockchainService;
  private prices: PriceService;
  private config: ConfigManager;

  constructor(config: ConfigManager, blockchain: BlockchainService, prices: PriceService) {
    this.config = config;
    this.blockchain = blockchain;
    this.prices = prices;

    const token = config.get('telegramToken');
    const chatId = config.get('telegramChatId');

    if (!token || !chatId) {
      throw new Error('Telegram not configured');
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.chatId = chatId;

    this.setupCommands();
  }

  private setupCommands(): void {
    // /wallets - Show all watched wallets
    this.bot.onText(/\/wallets/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const wallets = this.config.get('wallets') || [];

      if (wallets.length === 0) {
        await this.bot.sendMessage(this.chatId, '📭 No wallets being watched.\n\nAdd one with:\n`/watch <address> <label>`', { parse_mode: 'Markdown' });
        return;
      }

      const message = `
👛 *Watched Wallets* (${wallets.length})

${wallets.map((w, i) => `${i + 1}. *${w.label}*\n   \`${w.address.slice(0, 8)}...${w.address.slice(-6)}\`\n   Chain: ${w.chain}`).join('\n\n')}
      `.trim();

      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
    });

    // /balance <address or label> - Get wallet balance
    this.bot.onText(/\/balance(?:\s+(.+))?/, async (msg, match) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const query = match?.[1]?.trim();
      if (!query) {
        await this.bot.sendMessage(this.chatId, 'Usage: `/balance <address or label>`', { parse_mode: 'Markdown' });
        return;
      }

      const wallets = this.config.get('wallets') || [];
      const wallet = wallets.find(w =>
        w.address.toLowerCase() === query.toLowerCase() ||
        w.label.toLowerCase() === query.toLowerCase()
      );

      if (!wallet) {
        await this.bot.sendMessage(this.chatId, `❌ Wallet not found: ${query}`);
        return;
      }

      const snapshot = await this.blockchain.getWalletSnapshot(wallet);

      let message = `
💰 *${snapshot.label}*
\`${snapshot.address.slice(0, 10)}...${snapshot.address.slice(-8)}\`

*Balance:* ${parseFloat(snapshot.ethBalance).toFixed(4)} ETH
      `.trim();

      if (snapshot.tokens.length > 0) {
        message += '\n\n*Tokens:*\n';
        message += snapshot.tokens.map(t => `• ${t.symbol}: ${t.balance}`).join('\n');
      }

      if (snapshot.recentTxs.length > 0) {
        message += '\n\n*Recent Transactions:*\n';
        message += snapshot.recentTxs.slice(0, 3).map(tx =>
          `• ${tx.value} ETH\n  \`${tx.hash.slice(0, 12)}...\``
        ).join('\n');
      }

      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
    });

    // /price <token> - Get token price
    this.bot.onText(/\/price(?:\s+(.+))?/, async (msg, match) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const token = match?.[1]?.trim();
      if (!token) {
        await this.bot.sendMessage(this.chatId, 'Usage: `/price <token>`\nExample: `/price ETH`', { parse_mode: 'Markdown' });
        return;
      }

      try {
        const price = await this.prices.getPrice(token);

        const changeEmoji = price.change24h >= 0 ? '📈' : '📉';
        const message = `
${changeEmoji} *${price.symbol}*

*Price:* ${this.prices.formatPrice(price.price)}
*24h Change:* ${this.prices.formatChange(price.change24h)}
*Market Cap:* $${(price.marketCap / 1e9).toFixed(2)}B
        `.trim();

        await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
      } catch (error: any) {
        await this.bot.sendMessage(this.chatId, `❌ ${error.message}`);
      }
    });

    // /alerts - Show price alerts
    this.bot.onText(/\/alerts/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const alerts = this.config.get('priceAlerts') || [];

      if (alerts.length === 0) {
        await this.bot.sendMessage(this.chatId, '🔔 No price alerts set.\n\nAdd one with:\n`/alert <token> <above|below> <price>`', { parse_mode: 'Markdown' });
        return;
      }

      const message = `
🔔 *Price Alerts* (${alerts.length})

${alerts.map((a, i) => `${i + 1}. ${a.token.toUpperCase()} ${a.condition} ${this.prices.formatPrice(a.price)} ${a.triggered ? '✅' : '⏳'}`).join('\n')}
      `.trim();

      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
    });

    // /watch <address> <label> - Watch a wallet
    this.bot.onText(/\/watch\s+(\S+)\s+(.+)/, async (msg, match) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const address = match?.[1];
      const label = match?.[2];

      if (!address || !label) return;

      this.config.addWallet({
        address,
        label,
        chain: 'ethereum' // Default to Ethereum
      });

      await this.bot.sendMessage(this.chatId, `✅ Now watching *${label}*\n\`${address}\``, { parse_mode: 'Markdown' });
    });

    // /alert <token> <above|below> <price> - Set price alert
    this.bot.onText(/\/alert\s+(\S+)\s+(above|below)\s+(\d+\.?\d*)/, async (msg, match) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const token = match?.[1];
      const condition = match?.[2] as 'above' | 'below';
      const price = parseFloat(match?.[3] || '0');

      if (!token || !condition || !price) return;

      this.config.addPriceAlert({
        token,
        condition,
        price
      });

      await this.bot.sendMessage(
        this.chatId,
        `✅ Alert set: ${token.toUpperCase()} ${condition} ${this.prices.formatPrice(price)}`,
        { parse_mode: 'Markdown' }
      );
    });

    // Help command
    this.bot.onText(/\/help/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const message = `
🔐 *CryptoWatch Commands*

*Wallets:*
/wallets - List watched wallets
/watch <address> <label> - Watch a wallet
/balance <address|label> - Check balance

*Prices:*
/price <token> - Get token price
/alerts - List price alerts
/alert <token> above|below <price> - Set alert

*Example:*
\`/watch 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb \`"vitalik.eth\`"
\`/price ETH\`
\`/alert BTC above 100000\`
      `.trim();

      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
    });
  }

  async sendMessage(text: string): Promise<void> {
    await this.bot.sendMessage(this.chatId, text, { parse_mode: 'Markdown' });
  }

  async sendPriceAlert(token: string, condition: string, targetPrice: number, currentPrice: number): Promise<void> {
    const emoji = condition === 'above' ? '🚀' : '📉';
    const message = `
${emoji} *Price Alert Triggered!*

*${token.toUpperCase()}* is now ${condition} your target

*Target:* ${this.prices.formatPrice(targetPrice)}
*Current:* ${this.prices.formatPrice(currentPrice)}
    `.trim();

    await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
  }

  async sendTransactionAlert(label: string, tx: any): Promise<void> {
    const message = `
🔔 *New Transaction*

*Wallet:* ${label}
*Value:* ${tx.value} ETH
*Hash:* \`${tx.hash.slice(0, 16)}...\`
    `.trim();

    await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
  }

  stop(): void {
    this.bot.stopPolling();
  }
}
