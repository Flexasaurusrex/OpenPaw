import { ethers } from 'ethers';
import axios from 'axios';
import { ConfigManager, WalletWatch } from './config.js';

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  value?: number;
}

export interface WalletSnapshot {
  address: string;
  label: string;
  ethBalance: string;
  tokens: TokenBalance[];
  recentTxs: Transaction[];
  totalValue?: number;
}

export class BlockchainService {
  private config: ConfigManager;
  private providers: Map<string, ethers.JsonRpcProvider>;
  private etherscanKey?: string;
  private basescanKey?: string;

  constructor(config: ConfigManager) {
    this.config = config;
    this.etherscanKey = config.get('etherscanApiKey');
    this.basescanKey = config.get('basescanApiKey');

    // Setup providers
    this.providers = new Map([
      ['ethereum', new ethers.JsonRpcProvider('https://eth.llamarpc.com')],
      ['base', new ethers.JsonRpcProvider('https://mainnet.base.org')],
      ['polygon', new ethers.JsonRpcProvider('https://polygon-rpc.com')],
      ['arbitrum', new ethers.JsonRpcProvider('https://arb1.arbitrum.io/rpc')]
    ]);
  }

  async getWalletSnapshot(wallet: WalletWatch): Promise<WalletSnapshot> {
    const provider = this.providers.get(wallet.chain);
    if (!provider) {
      throw new Error(`Unsupported chain: ${wallet.chain}`);
    }

    // Get ETH balance
    const balance = await provider.getBalance(wallet.address);
    const ethBalance = ethers.formatEther(balance);

    // Get recent transactions
    const recentTxs = await this.getRecentTransactions(wallet);

    // Get token balances (if API key available)
    let tokens: TokenBalance[] = [];
    if (this.etherscanKey && wallet.chain === 'ethereum') {
      tokens = await this.getTokenBalances(wallet.address, 'ethereum');
    } else if (this.basescanKey && wallet.chain === 'base') {
      tokens = await this.getTokenBalances(wallet.address, 'base');
    }

    return {
      address: wallet.address,
      label: wallet.label,
      ethBalance,
      tokens,
      recentTxs
    };
  }

  async getRecentTransactions(wallet: WalletWatch, limit: number = 5): Promise<Transaction[]> {
    const apiKey = wallet.chain === 'ethereum' ? this.etherscanKey : this.basescanKey;
    if (!apiKey) {
      return [];
    }

    const baseUrl = wallet.chain === 'ethereum'
      ? 'https://api.etherscan.io/api'
      : 'https://api.basescan.org/api';

    try {
      const response = await axios.get(baseUrl, {
        params: {
          module: 'account',
          action: 'txlist',
          address: wallet.address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: limit,
          sort: 'desc',
          apikey: apiKey
        }
      });

      if (response.data.status !== '1') {
        return [];
      }

      return response.data.result.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value),
        timestamp: parseInt(tx.timeStamp),
        blockNumber: parseInt(tx.blockNumber)
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async getTokenBalances(address: string, chain: 'ethereum' | 'base'): Promise<TokenBalance[]> {
    const apiKey = chain === 'ethereum' ? this.etherscanKey : this.basescanKey;
    if (!apiKey) {
      return [];
    }

    const baseUrl = chain === 'ethereum'
      ? 'https://api.etherscan.io/api'
      : 'https://api.basescan.org/api';

    try {
      const response = await axios.get(baseUrl, {
        params: {
          module: 'account',
          action: 'tokentx',
          address: address,
          page: 1,
          offset: 100,
          sort: 'desc',
          apikey: apiKey
        }
      });

      if (response.data.status !== '1') {
        return [];
      }

      // Aggregate unique tokens
      const tokenMap = new Map<string, TokenBalance>();

      for (const tx of response.data.result) {
        const symbol = tx.tokenSymbol;
        if (!tokenMap.has(symbol)) {
          // Get current balance for this token
          const balanceResponse = await axios.get(baseUrl, {
            params: {
              module: 'account',
              action: 'tokenbalance',
              contractaddress: tx.contractAddress,
              address: address,
              tag: 'latest',
              apikey: apiKey
            }
          });

          if (balanceResponse.data.status === '1') {
            const balance = balanceResponse.data.result;
            const decimals = parseInt(tx.tokenDecimal);
            const formattedBalance = (parseFloat(balance) / Math.pow(10, decimals)).toFixed(4);

            if (parseFloat(formattedBalance) > 0) {
              tokenMap.set(symbol, {
                symbol,
                name: tx.tokenName,
                balance: formattedBalance
              });
            }
          }
        }
      }

      return Array.from(tokenMap.values());
    } catch (error) {
      console.error('Error fetching token balances:', error);
      return [];
    }
  }

  async checkForNewTransactions(wallet: WalletWatch, lastCheckedBlock: number): Promise<Transaction[]> {
    const recentTxs = await this.getRecentTransactions(wallet, 10);
    return recentTxs.filter(tx => tx.blockNumber > lastCheckedBlock);
  }
}
