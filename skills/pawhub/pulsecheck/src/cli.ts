#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { ConfigManager } from './config.js';
import { AnalyticsService } from './analytics.js';
import { TelegramService } from './telegram.js';

const program = new Command();

program
  .name('pulsecheck')
  .description('Query Google Analytics via Telegram')
  .version('1.0.0');

// Config commands
program
  .command('config')
  .description('Configure PulseCheck')
  .action(() => {
    const config = new ConfigManager();
    console.log(chalk.cyan('\n📋 Current Configuration:\n'));
    const conf = config.getAll();
    Object.entries(conf).forEach(([key, value]) => {
      if (key === 'gaCredentials' || key === 'telegramToken') {
        console.log(`  ${key}: ${value ? '***' : chalk.red('not set')}`);
      } else {
        console.log(`  ${key}: ${value || chalk.red('not set')}`);
      }
    });
    console.log();
  });

program
  .command('config:set <key> <value>')
  .description('Set a configuration value')
  .action((key, value) => {
    const config = new ConfigManager();
    config.set(key as any, value);
    console.log(chalk.green(`✓ Set ${key} = ${value}`));
  });

// Query command
program
  .command('query <text>')
  .description('Query analytics in plain English')
  .option('-p, --period <period>', 'Time period (today, yesterday, 7d, 30d)', 'today')
  .option('-l, --limit <limit>', 'Number of results', '10')
  .action(async (text, options) => {
    const spinner = ora('Querying analytics...').start();

    try {
      const config = new ConfigManager();
      if (!config.isConfigured()) {
        spinner.fail('Not configured. Run: pulsecheck setup');
        process.exit(1);
      }

      const analytics = new AnalyticsService(config);

      // Parse natural language query
      let result;
      if (text.includes('top pages') || text.includes('popular pages')) {
        result = await analytics.getTopPages(options.period, parseInt(options.limit));
      } else if (text.includes('traffic sources') || text.includes('where')) {
        result = await analytics.getTrafficSources(options.period);
      } else if (text.includes('realtime') || text.includes('live') || text.includes('now')) {
        result = await analytics.getRealtime();
      } else {
        result = await analytics.query({
          dateRange: options.period,
          limit: parseInt(options.limit)
        });
      }

      spinner.succeed('Results:');
      console.log();
      console.log(chalk.cyan(result.summary));
      console.log();

      if (result.rows.length > 0) {
        console.log(chalk.bold('Details:'));
        result.rows.forEach((row, i) => {
          console.log(`  ${i + 1}. ${JSON.stringify(row, null, 2).replace(/[{}]/g, '').trim()}`);
        });
      }

      if (result.totals) {
        console.log();
        console.log(chalk.bold('Totals:'), result.totals);
      }

    } catch (error: any) {
      spinner.fail(error.message);
      process.exit(1);
    }
  });

// Bot command
program
  .command('bot')
  .description('Start Telegram bot')
  .action(async () => {
    console.log(chalk.cyan('🤖 Starting PulseCheck Telegram bot...\n'));

    try {
      const config = new ConfigManager();
      if (!config.isConfigured()) {
        console.log(chalk.red('❌ Not configured. Run: pulsecheck setup'));
        process.exit(1);
      }

      const analytics = new AnalyticsService(config);
      const telegram = new TelegramService(config, analytics);

      console.log(chalk.green('✓ Bot is running!'));
      console.log(chalk.gray('\nAvailable commands:'));
      console.log(chalk.gray('  /pulse - Quick stats'));
      console.log(chalk.gray('  /top [period] - Top pages'));
      console.log(chalk.gray('  /sources [period] - Traffic sources'));
      console.log(chalk.gray('  /realtime - Live users'));
      console.log(chalk.gray('\nPress Ctrl+C to stop\n'));

      // Keep process alive
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
  .action(async () => {
    console.log(chalk.cyan.bold('\n📊 PulseCheck Setup\n'));
    console.log('This wizard will help you configure PulseCheck.\n');

    const config = new ConfigManager();

    console.log(chalk.yellow('1. Google Analytics Property ID'));
    console.log(chalk.gray('   Find this in GA4: Admin > Property > Property Details'));
    console.log(chalk.gray('   Example: 123456789\n'));

    console.log(chalk.yellow('2. Google Analytics Credentials'));
    console.log(chalk.gray('   Path to your service account JSON file'));
    console.log(chalk.gray('   Get it from: Google Cloud Console > IAM > Service Accounts'));
    console.log(chalk.gray('   Example: ~/.pulsecheck/credentials.json\n'));

    console.log(chalk.yellow('3. Telegram Bot Token'));
    console.log(chalk.gray('   Get from @BotFather on Telegram'));
    console.log(chalk.gray('   Example: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11\n'));

    console.log(chalk.yellow('4. Telegram Chat ID'));
    console.log(chalk.gray('   Your personal chat ID or group ID'));
    console.log(chalk.gray('   Get from @userinfobot or @get_id_bot'));
    console.log(chalk.gray('   Example: 123456789\n'));

    console.log(chalk.cyan('Use the following commands to configure:\n'));
    console.log('  pulsecheck config:set gaPropertyId YOUR_PROPERTY_ID');
    console.log('  pulsecheck config:set gaCredentials ~/.pulsecheck/creds.json');
    console.log('  pulsecheck config:set telegramToken YOUR_BOT_TOKEN');
    console.log('  pulsecheck config:set telegramChatId YOUR_CHAT_ID');
    console.log();
    console.log(chalk.gray('Then run: pulsecheck bot\n'));
  });

program.parse();
