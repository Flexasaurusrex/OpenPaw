import cron from 'node-cron';
import { ConfigManager } from './config.js';
import { BlockchainService } from './blockchain.js';
import { PriceService } from './prices.js';
import { TelegramService } from './telegram.js';

export class MonitorService {
  private config: ConfigManager;
  private blockchain: BlockchainService;
  private prices: PriceService;
  private telegram: TelegramService;
  private lastCheckedBlocks: Map<string, number> = new Map();

  constructor(
    config: ConfigManager,
    blockchain: BlockchainService,
    prices: PriceService,
    telegram: TelegramService
  ) {
    this.config = config;
    this.blockchain = blockchain;
    this.prices = prices;
    this.telegram = telegram;
  }

  start(): void {
    const interval = this.config.get('checkInterval') || 5;
    console.log(`Starting monitor (checking every ${interval} minutes)...`);

    // Check price alerts
    cron.schedule(`*/${interval} * * * *`, async () => {
      await this.checkPriceAlerts();
    });

    // Check wallet transactions
    cron.schedule(`*/${interval} * * * *`, async () => {
      await this.checkWalletTransactions();
    });

    // Run initial check
    this.checkPriceAlerts();
    this.checkWalletTransactions();
  }

  private async checkPriceAlerts(): Promise<void> {
    try {
      const triggered = await this.prices.checkAlerts();

      for (const { alert, currentPrice } of triggered) {
        await this.telegram.sendPriceAlert(
          alert.token,
          alert.condition,
          alert.price,
          currentPrice
        );
      }
    } catch (error) {
      console.error('Error checking price alerts:', error);
    }
  }

  private async checkWalletTransactions(): Promise<void> {
    try {
      const wallets = this.config.get('wallets') || [];

      for (const wallet of wallets) {
        const lastBlock = this.lastCheckedBlocks.get(wallet.address) || 0;
        const newTxs = await this.blockchain.checkForNewTransactions(wallet, lastBlock);

        for (const tx of newTxs) {
          await this.telegram.sendTransactionAlert(wallet.label, tx);

          // Update last checked block
          if (tx.blockNumber > lastBlock) {
            this.lastCheckedBlocks.set(wallet.address, tx.blockNumber);
          }
        }
      }
    } catch (error) {
      console.error('Error checking wallet transactions:', error);
    }
  }
}
