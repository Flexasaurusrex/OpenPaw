import Conf from 'conf';

export interface WalletWatch {
  address: string;
  label: string;
  chain: 'ethereum' | 'base' | 'polygon' | 'arbitrum';
}

export interface PriceAlert {
  token: string;
  condition: 'above' | 'below';
  price: number;
  triggered?: boolean;
}

export interface CryptoWatchConfig {
  wallets?: WalletWatch[];
  priceAlerts?: PriceAlert[];
  telegramToken?: string;
  telegramChatId?: string;
  etherscanApiKey?: string;
  basescanApiKey?: string;
  coingeckoApiKey?: string;
  checkInterval?: number; // minutes
}

export class ConfigManager {
  private config: Conf<CryptoWatchConfig>;

  constructor() {
    this.config = new Conf<CryptoWatchConfig>({
      projectName: 'cryptowatch',
      defaults: {
        wallets: [],
        priceAlerts: [],
        checkInterval: 5
      }
    });
  }

  get<K extends keyof CryptoWatchConfig>(key: K): CryptoWatchConfig[K] {
    return this.config.get(key);
  }

  set<K extends keyof CryptoWatchConfig>(key: K, value: CryptoWatchConfig[K]): void {
    this.config.set(key, value);
  }

  getAll(): CryptoWatchConfig {
    return this.config.store;
  }

  addWallet(wallet: WalletWatch): void {
    const wallets = this.get('wallets') || [];
    wallets.push(wallet);
    this.set('wallets', wallets);
  }

  removeWallet(address: string): void {
    const wallets = (this.get('wallets') || []).filter(w => w.address !== address);
    this.set('wallets', wallets);
  }

  addPriceAlert(alert: PriceAlert): void {
    const alerts = this.get('priceAlerts') || [];
    alerts.push(alert);
    this.set('priceAlerts', alerts);
  }

  removePriceAlert(index: number): void {
    const alerts = this.get('priceAlerts') || [];
    alerts.splice(index, 1);
    this.set('priceAlerts', alerts);
  }

  isConfigured(): boolean {
    return !!(this.get('telegramToken') && this.get('telegramChatId'));
  }
}
