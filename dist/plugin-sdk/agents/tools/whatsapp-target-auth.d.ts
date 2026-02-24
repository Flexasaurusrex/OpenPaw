import type { OpenPawConfig } from "../../config/config.js";
export declare function resolveAuthorizedWhatsAppOutboundTarget(params: {
    cfg: OpenPawConfig;
    chatJid: string;
    accountId?: string;
    actionLabel: string;
}): {
    to: string;
    accountId: string;
};
