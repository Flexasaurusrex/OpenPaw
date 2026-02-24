import type { OpenPawConfig } from "../config/config.js";
import type { ResolvedLineAccount } from "./types.js";
export { DEFAULT_ACCOUNT_ID } from "../routing/account-id.js";
export declare function resolveLineAccount(params: {
    cfg: OpenPawConfig;
    accountId?: string;
}): ResolvedLineAccount;
export declare function listLineAccountIds(cfg: OpenPawConfig): string[];
export declare function resolveDefaultLineAccountId(cfg: OpenPawConfig): string;
export declare function normalizeAccountId(accountId: string | undefined): string;
