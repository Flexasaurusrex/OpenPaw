import type { OpenPawConfig } from "../../config/config.js";
export declare function createAccountListHelpers(channelKey: string): {
    listConfiguredAccountIds: (cfg: OpenPawConfig) => string[];
    listAccountIds: (cfg: OpenPawConfig) => string[];
    resolveDefaultAccountId: (cfg: OpenPawConfig) => string;
};
