import axios from 'axios';
import { ConfigManager, PriceAlert } from './config.js';

export interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
}

export interface Portfolio {
  tokens: Array<{
    symbol: string;
    amount: number;
    value: number;
    price: number;
  }>;
  totalValue: number;
}

export class PriceService {
  private config: ConfigManager;
  private coingeckoKey?: string;
  private cache: Map<string, { price: TokenPrice; timestamp: number }> = new Map();
  private CACHE_TTL = 60000; // 1 minute

  constructor(config: ConfigManager) {
    this.config = config;
    this.coingeckoKey = config.get('coingeckoApiKey');
  }

  async getPrice(symbol: string): Promise<TokenPrice> {
    // Check cache
    const cached = this.cache.get(symbol.toLowerCase());
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.price;
    }

    // Fetch from CoinGecko
    const coinId = this.symbolToCoinId(symbol);
    // Always use regular API endpoint (works with both free and demo keys)
    const url = `https://api.coingecko.com/api/v3/simple/price`;

    const headers = this.coingeckoKey
      ? { 'x-cg-demo-api-key': this.coingeckoKey }
      : {};

    try {
      const response = await axios.get(url, {
        params: {
          ids: coinId,
          vs_currencies: 'usd',
          include_24hr_change: 'true',
          include_market_cap: 'true'
        },
        headers
      });

      const data = response.data[coinId];
      if (!data) {
        throw new Error(`Price data not found for ${symbol}`);
      }

      const price: TokenPrice = {
        symbol: symbol.toUpperCase(),
        price: data.usd,
        change24h: data.usd_24h_change || 0,
        marketCap: data.usd_market_cap || 0
      };

      // Update cache
      this.cache.set(symbol.toLowerCase(), {
        price,
        timestamp: Date.now()
      });

      return price;
    } catch (error: any) {
      throw new Error(`Failed to fetch price for ${symbol}: ${error.message}`);
    }
  }

  async getPrices(symbols: string[]): Promise<TokenPrice[]> {
    const prices = await Promise.allSettled(
      symbols.map(symbol => this.getPrice(symbol))
    );

    return prices
      .filter((result): result is PromiseFulfilledResult<TokenPrice> => result.status === 'fulfilled')
      .map(result => result.value);
  }

  async checkAlerts(): Promise<Array<{ alert: PriceAlert; currentPrice: number }>> {
    const alerts = this.config.get('priceAlerts') || [];
    const triggered: Array<{ alert: PriceAlert; currentPrice: number }> = [];

    for (const alert of alerts) {
      if (alert.triggered) continue;

      try {
        const priceData = await this.getPrice(alert.token);
        const currentPrice = priceData.price;

        const shouldTrigger =
          (alert.condition === 'above' && currentPrice > alert.price) ||
          (alert.condition === 'below' && currentPrice < alert.price);

        if (shouldTrigger) {
          triggered.push({ alert, currentPrice });
          // Mark as triggered
          alert.triggered = true;
        }
      } catch (error) {
        console.error(`Error checking alert for ${alert.token}:`, error);
      }
    }

    // Update config with triggered alerts
    if (triggered.length > 0) {
      this.config.set('priceAlerts', alerts);
    }

    return triggered;
  }

  async calculatePortfolio(holdings: Array<{ symbol: string; amount: number }>): Promise<Portfolio> {
    const prices = await this.getPrices(holdings.map(h => h.symbol));

    const tokens = holdings.map(holding => {
      const priceData = prices.find(p => p.symbol.toLowerCase() === holding.symbol.toLowerCase());
      const price = priceData?.price || 0;
      const value = price * holding.amount;

      return {
        symbol: holding.symbol.toUpperCase(),
        amount: holding.amount,
        price,
        value
      };
    });

    const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);

    return { tokens, totalValue };
  }

  private symbolToCoinId(symbol: string): string {
    const mapping: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'USDC': 'usd-coin',
      'USDT': 'tether',
      'DEGEN': 'degen-base',
      'HIGHER': 'higher',
      'SOL': 'solana',
      'MATIC': 'matic-network',
      'ARB': 'arbitrum',
      'OP': 'optimism',
      'LINK': 'chainlink',
      'UNI': 'uniswap'
    };

    return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
  }

  formatPrice(price: number): string {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  }

  formatChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }
}
