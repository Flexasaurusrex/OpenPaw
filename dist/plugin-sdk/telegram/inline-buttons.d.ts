import type { OpenPawConfig } from "../config/config.js";
import type { TelegramInlineButtonsScope } from "../config/types.telegram.js";
export declare function resolveTelegramInlineButtonsScope(params: {
    cfg: OpenPawConfig;
    accountId?: string | null;
}): TelegramInlineButtonsScope;
export declare function isTelegramInlineButtonsEnabled(params: {
    cfg: OpenPawConfig;
    accountId?: string | null;
}): boolean;
export { resolveTelegramTargetChatType } from "./targets.js";
