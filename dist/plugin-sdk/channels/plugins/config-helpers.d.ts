import type { OpenPawConfig } from "../../config/config.js";
export declare function setAccountEnabledInConfigSection(params: {
    cfg: OpenPawConfig;
    sectionKey: string;
    accountId: string;
    enabled: boolean;
    allowTopLevel?: boolean;
}): OpenPawConfig;
export declare function deleteAccountFromConfigSection(params: {
    cfg: OpenPawConfig;
    sectionKey: string;
    accountId: string;
    clearBaseFields?: string[];
}): OpenPawConfig;
