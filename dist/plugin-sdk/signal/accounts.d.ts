import type { OpenPawConfig } from "../config/config.js";
import type { SignalAccountConfig } from "../config/types.js";
export type ResolvedSignalAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    baseUrl: string;
    configured: boolean;
    config: SignalAccountConfig;
};
export declare const listSignalAccountIds: (cfg: OpenPawConfig) => string[];
export declare const resolveDefaultSignalAccountId: (cfg: OpenPawConfig) => string;
export declare function resolveSignalAccount(params: {
    cfg: OpenPawConfig;
    accountId?: string | null;
}): ResolvedSignalAccount;
export declare function listEnabledSignalAccounts(cfg: OpenPawConfig): ResolvedSignalAccount[];
