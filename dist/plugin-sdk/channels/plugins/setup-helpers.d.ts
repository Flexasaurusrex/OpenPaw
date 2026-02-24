import type { OpenPawConfig } from "../../config/config.js";
export declare function applyAccountNameToChannelSection(params: {
    cfg: OpenPawConfig;
    channelKey: string;
    accountId: string;
    name?: string;
    alwaysUseAccounts?: boolean;
}): OpenPawConfig;
export declare function migrateBaseNameToDefaultAccount(params: {
    cfg: OpenPawConfig;
    channelKey: string;
    alwaysUseAccounts?: boolean;
}): OpenPawConfig;
