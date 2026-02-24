import TelegramBot from 'node-telegram-bot-api';
import { ConfigManager } from './config.js';
import { AnalyticsService } from './analytics.js';

export class TelegramService {
  private bot: TelegramBot;
  private chatId: string;
  private analytics: AnalyticsService;
  private config: ConfigManager;

  constructor(config: ConfigManager, analytics: AnalyticsService) {
    this.config = config;
    this.analytics = analytics;

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
    // /pulse - Quick stats
    this.bot.onText(/\/pulse/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const realtime = await this.analytics.getRealtime();
      const today = await this.analytics.getTopPages('today', 5);

      const message = `
📊 *PulseCheck*

*Right now:* ${realtime.totals?.activeUsers || 0} users online

*Today's top pages:*
${today.rows.slice(0, 5).map((r, i) => `${i + 1}. ${r.pagePath} (${r.screenPageViews} views)`).join('\n')}

*Total today:* ${today.totals?.screenPageViews || 0} views
      `.trim();

      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
    });

    // /top - Top pages
    this.bot.onText(/\/top(?:\s+(.+))?/, async (msg, match) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const period = match?.[1]?.trim() || 'today';
      const result = await this.analytics.getTopPages(period, 10);

      const message = `
📈 *Top Pages (${period})*

${result.rows.map((r, i) => `${i + 1}. ${r.pagePath}\n   ${r.screenPageViews} views, ${r.activeUsers} users`).join('\n\n')}

*Total:* ${result.totals?.screenPageViews || 0} views
      `.trim();

      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
    });

    // /sources - Traffic sources
    this.bot.onText(/\/sources(?:\s+(.+))?/, async (msg, match) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const period = match?.[1]?.trim() || 'today';
      const result = await this.analytics.getTrafficSources(period);

      const message = `
🌍 *Traffic Sources (${period})*

${result.rows.map((r, i) => `${i + 1}. ${r.sessionSource}: ${r.activeUsers} users`).join('\n')}
      `.trim();

      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
    });

    // /realtime - Live users
    this.bot.onText(/\/realtime/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const result = await this.analytics.getRealtime();

      const message = `
⚡ *Live Right Now*

*Total:* ${result.totals?.activeUsers || 0} users online

*By city:*
${result.rows.slice(0, 10).map((r, i) => `${i + 1}. ${r.city}: ${r.activeUsers} users`).join('\n')}
      `.trim();

      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
    });
  }

  async sendMessage(text: string): Promise<void> {
    await this.bot.sendMessage(this.chatId, text, { parse_mode: 'Markdown' });
  }

  async sendAlert(metric: string, value: string, threshold: string): Promise<void> {
    const message = `
🚨 *Alert*

*${metric}* has ${value > threshold ? 'exceeded' : 'dropped below'} threshold

*Current:* ${value}
*Threshold:* ${threshold}
    `.trim();

    await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
  }

  stop(): void {
    this.bot.stopPolling();
  }
}
