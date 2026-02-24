import type { OpenPawConfig } from "../config/config.js";
export declare function maybePersistResolvedTelegramTarget(params: {
    cfg: OpenPawConfig;
    rawTarget: string;
    resolvedChatId: string;
    verbose?: boolean;
}): Promise<void>;
