import type { OpenPawConfig } from "../config/config.js";
import type { TelegramAccountConfig, TelegramActionConfig } from "../config/types.js";
export type ResolvedTelegramAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    token: string;
    tokenSource: "env" | "tokenFile" | "config" | "none";
    config: TelegramAccountConfig;
};
export declare function listTelegramAccountIds(cfg: OpenPawConfig): string[];
export declare function resolveDefaultTelegramAccountId(cfg: OpenPawConfig): string;
export declare function createTelegramActionGate(params: {
    cfg: OpenPawConfig;
    accountId?: string | null;
}): (key: keyof TelegramActionConfig, defaultValue?: boolean) => boolean;
export declare function resolveTelegramAccount(params: {
    cfg: OpenPawConfig;
    accountId?: string | null;
}): ResolvedTelegramAccount;
export declare function listEnabledTelegramAccounts(cfg: OpenPawConfig): ResolvedTelegramAccount[];
