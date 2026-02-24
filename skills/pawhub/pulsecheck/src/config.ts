import Conf from 'conf';
import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export interface PulseCheckConfig {
  gaPropertyId?: string;
  gaCredentials?: string;
  telegramToken?: string;
  telegramChatId?: string;
  timezone?: string;
}

export class ConfigManager {
  private config: Conf<PulseCheckConfig>;

  constructor() {
    this.config = new Conf<PulseCheckConfig>({
      projectName: 'pulsecheck',
      defaults: {
        timezone: 'America/Los_Angeles'
      }
    });
  }

  get<K extends keyof PulseCheckConfig>(key: K): PulseCheckConfig[K] {
    return this.config.get(key);
  }

  set<K extends keyof PulseCheckConfig>(key: K, value: PulseCheckConfig[K]): void {
    this.config.set(key, value);
  }

  getAll(): PulseCheckConfig {
    return this.config.store;
  }

  isConfigured(): boolean {
    return !!(
      this.get('gaPropertyId') &&
      this.get('gaCredentials') &&
      this.get('telegramToken') &&
      this.get('telegramChatId')
    );
  }

  loadGACredentials(): any {
    const credPath = this.get('gaCredentials');
    if (!credPath) {
      throw new Error('Google Analytics credentials path not set');
    }

    const fullPath = credPath.startsWith('~')
      ? join(homedir(), credPath.slice(1))
      : credPath;

    if (!existsSync(fullPath)) {
      throw new Error(`Credentials file not found: ${fullPath}`);
    }

    return JSON.parse(readFileSync(fullPath, 'utf-8'));
  }
}
