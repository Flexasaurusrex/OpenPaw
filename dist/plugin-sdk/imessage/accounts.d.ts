import type { OpenPawConfig } from "../config/config.js";
import type { IMessageAccountConfig } from "../config/types.js";
export type ResolvedIMessageAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    config: IMessageAccountConfig;
    configured: boolean;
};
export declare const listIMessageAccountIds: (cfg: OpenPawConfig) => string[];
export declare const resolveDefaultIMessageAccountId: (cfg: OpenPawConfig) => string;
export declare function resolveIMessageAccount(params: {
    cfg: OpenPawConfig;
    accountId?: string | null;
}): ResolvedIMessageAccount;
export declare function listEnabledIMessageAccounts(cfg: OpenPawConfig): ResolvedIMessageAccount[];
