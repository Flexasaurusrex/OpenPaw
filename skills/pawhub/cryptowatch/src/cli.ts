#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { ConfigManager } from './config.js';
import { BlockchainService } from './blockchain.js';
import { PriceService } from './prices.js';
import { TelegramService } from './telegram.js';
import { MonitorService } from './monitor.js';

const program = new Command();

program
  .name('cryptowatch')
  .description('On-chain monitoring, price alerts, and portfolio tracking')
  .version('1.0.0');

// Config commands
program
  .command('config')
  .description('Show current configuration')
  .action(() => {
    const config = new ConfigManager();
    console.log(chalk.cyan('\n🔐 CryptoWatch Configuration:\n'));
    const conf = config.getAll();

    console.log(chalk.bold('Wallets:'), (conf.wallets?.length || 0));
    console.log(chalk.bold('Price Alerts:'), (conf.priceAlerts?.length || 0));
    console.log(chalk.bold('Check Interval:'), `${conf.checkInterval || 5} minutes`);
    console.log(chalk.bold('Telegram Token:'), conf.telegramToken ? '***' : chalk.red('not set'));
    console.log(chalk.bold('Telegram Chat ID:'), conf.telegramChatId || chalk.red('not set'));
    console.log(chalk.bold('Etherscan API:'), conf.etherscanApiKey ? '***' : chalk.gray('not set'));
    console.log();
  });

program
  .command('config:set <key> <value>')
  .description('Set a configuration value')
  .action((key, value) => {
    const config = new ConfigManager();
    config.set(key as any, value);
    console.log(chalk.green(`✓ Set ${key}`));
  });

// Watch wallet
program
  .command('watch <address> <label>')
  .description('Watch a wallet address')
  .option('-c, --chain <chain>', 'Blockchain (ethereum, base, polygon, arbitrum)', 'ethereum')
  .action((address, label, options) => {
    const config = new ConfigManager();
    config.addWallet({
      address,
      label,
      chain: options.chain
    });
    console.log(chalk.green(`✓ Now watching ${label}`));
    console.log(chalk.gray(`  ${address} on ${options.chain}`));
  });

// List wallets
program
  .command('wallets')
  .description('List watched wallets')
  .action(() => {
    const config = new ConfigManager();
    const wallets = config.get('wallets') || [];

    if (wallets.length === 0) {
      console.log(chalk.yellow('No wallets being watched'));
      return;
    }

    console.log(chalk.cyan(`\n👛 Watched Wallets (${wallets.length}):\n`));
    wallets.forEach((w, i) => {
      console.log(`${i + 1}. ${chalk.bold(w.label)}`);
      console.log(`   ${w.address}`);
      console.log(`   Chain: ${w.chain}\n`);
    });
  });

// Check balance
program
  .command('balance <addressOrLabel>')
  .description('Check wallet balance')
  .action(async (addressOrLabel) => {
    const spinner = ora('Fetching balance...').start();

    try {
      const config = new ConfigManager();
      const blockchain = new BlockchainService(config);

      const wallets = config.get('wallets') || [];
      const wallet = wallets.find(w =>
        w.address.toLowerCase() === addressOrLabel.toLowerCase() ||
        w.label.toLowerCase() === addressOrLabel.toLowerCase()
      );

      if (!wallet) {
        spinner.fail(`Wallet not found: ${addressOrLabel}`);
        process.exit(1);
      }

      const snapshot = await blockchain.getWalletSnapshot(wallet);
      spinner.succeed('Balance fetched');

      console.log();
      console.log(chalk.cyan.bold(snapshot.label));
      console.log(chalk.gray(snapshot.address));
      console.log();
      console.log(chalk.bold('Balance:'), `${parseFloat(snapshot.ethBalance).toFixed(4)} ETH`);

      if (snapshot.tokens.length > 0) {
        console.log();
        console.log(chalk.bold('Tokens:'));
        snapshot.tokens.forEach(t => {
          console.log(`  ${t.symbol}: ${t.balance}`);
        });
      }

      if (snapshot.recentTxs.length > 0) {
        console.log();
        console.log(chalk.bold('Recent Transactions:'));
        snapshot.recentTxs.slice(0, 5).forEach(tx => {
          console.log(`  ${tx.value} ETH - ${tx.hash.slice(0, 16)}...`);
        });
      }

      console.log();
    } catch (error: any) {
      spinner.fail(error.message);
      process.exit(1);
    }
  });

// Price commands
program
  .command('price <token>')
  .description('Get token price')
  .action(async (token) => {
    const spinner = ora(`Fetching ${token.toUpperCase()} price...`).start();

    try {
      const config = new ConfigManager();
      const prices = new PriceService(config);
      const price = await prices.getPrice(token);

      spinner.succeed();
      console.log();
      console.log(chalk.cyan.bold(price.symbol));
      console.log(chalk.bold('Price:'), prices.formatPrice(price.price));
      console.log(chalk.bold('24h Change:'), prices.formatChange(price.change24h));
      console.log(chalk.bold('Market Cap:'), `$${(price.marketCap / 1e9).toFixed(2)}B`);
      console.log();
    } catch (error: any) {
      spinner.fail(error.message);
      process.exit(1);
    }
  });

// Alert commands
program
  .command('alert <token> <condition> <price>')
  .description('Set price alert (condition: above/below)')
  .action((token, condition, price) => {
    if (condition !== 'above' && condition !== 'below') {
      console.log(chalk.red('❌ Condition must be "above" or "below"'));
      process.exit(1);
    }

    const config = new ConfigManager();
    const prices = new PriceService(config);

    config.addPriceAlert({
      token,
      condition: condition as 'above' | 'below',
      price: parseFloat(price)
    });

    console.log(chalk.green(`✓ Alert set: ${token.toUpperCase()} ${condition} ${prices.formatPrice(parseFloat(price))}`));
  });

program
  .command('alerts')
  .description('List price alerts')
  .action(() => {
    const config = new ConfigManager();
    const prices = new PriceService(config);
    const alerts = config.get('priceAlerts') || [];

    if (alerts.length === 0) {
      console.log(chalk.yellow('No price alerts set'));
      return;
    }

    console.log(chalk.cyan(`\n🔔 Price Alerts (${alerts.length}):\n`));
    alerts.forEach((a, i) => {
      const status = a.triggered ? chalk.green('✅') : chalk.yellow('⏳');
      console.log(`${i + 1}. ${status} ${a.token.toUpperCase()} ${a.condition} ${prices.formatPrice(a.price)}`);
    });
    console.log();
  });

// Bot command
program
  .command('bot')
  .description('Start Telegram bot and monitoring')
  .action(async () => {
    console.log(chalk.cyan('🤖 Starting CryptoWatch bot...\n'));

    try {
      const config = new ConfigManager();
      if (!config.isConfigured()) {
        console.log(chalk.red('❌ Not configured. Run: cryptowatch setup'));
        process.exit(1);
      }

      const blockchain = new BlockchainService(config);
      const prices = new PriceService(config);
      const telegram = new TelegramService(config, blockchain, prices);
      const monitor = new MonitorService(config, blockchain, prices, telegram);

      monitor.start();

      console.log(chalk.green('✓ Bot is running!'));
      console.log(chalk.gray('\nMonitoring:'));
      console.log(chalk.gray(`  • ${(config.get('wallets') || []).length} wallets`));
      console.log(chalk.gray(`  • ${(config.get('priceAlerts') || []).length} price alerts`));
      console.log(chalk.gray(`  • Checking every ${config.get('checkInterval') || 5} minutes`));
      console.log(chalk.gray('\nPress Ctrl+C to stop\n'));

      process.on('SIGINT', () => {
        console.log(chalk.yellow('\n\n👋 Stopping bot...'));
        telegram.stop();
        process.exit(0);
      });

    } catch (error: any) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Setup wizard
program
  .command('setup')
  .description('Interactive setup wizard')
  .action(() => {
    console.log(chalk.cyan.bold('\n🔐 CryptoWatch Setup\n'));

    console.log(chalk.yellow('Required:'));
    console.log('  1. Telegram Bot Token (from @BotFather)');
    console.log('  2. Telegram Chat ID (from @userinfobot)\n');

    console.log(chalk.yellow('Optional (for advanced features):'));
    console.log('  3. Etherscan API Key (for Ethereum wallet tracking)');
    console.log('  4. Basescan API Key (for Base wallet tracking)');
    console.log('  5. CoinGecko API Key (for better rate limits)\n');

    console.log(chalk.cyan('Configure using:\n'));
    console.log('  cryptowatch config:set telegramToken YOUR_TOKEN');
    console.log('  cryptowatch config:set telegramChatId YOUR_CHAT_ID');
    console.log('  cryptowatch config:set etherscanApiKey YOUR_KEY');
    console.log('  cryptowatch config:set basescanApiKey YOUR_KEY');
    console.log('  cryptowatch config:set coingeckoApiKey YOUR_KEY\n');

    console.log(chalk.cyan('Then:\n'));
    console.log('  cryptowatch watch 0x... "wallet-name"');
    console.log('  cryptowatch alert ETH above 5000');
    console.log('  cryptowatch bot\n');
  });

program.parse();
