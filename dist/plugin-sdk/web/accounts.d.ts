import type { OpenPawConfig } from "../config/config.js";
import type { DmPolicy, GroupPolicy, WhatsAppAccountConfig } from "../config/types.js";
export type ResolvedWhatsAppAccount = {
    accountId: string;
    name?: string;
    enabled: boolean;
    sendReadReceipts: boolean;
    messagePrefix?: string;
    authDir: string;
    isLegacyAuthDir: boolean;
    selfChatMode?: boolean;
    allowFrom?: string[];
    groupAllowFrom?: string[];
    groupPolicy?: GroupPolicy;
    dmPolicy?: DmPolicy;
    textChunkLimit?: number;
    chunkMode?: "length" | "newline";
    mediaMaxMb?: number;
    blockStreaming?: boolean;
    ackReaction?: WhatsAppAccountConfig["ackReaction"];
    groups?: WhatsAppAccountConfig["groups"];
    debounceMs?: number;
};
export declare const listWhatsAppAccountIds: (cfg: OpenPawConfig) => string[];
export declare const resolveDefaultWhatsAppAccountId: (cfg: OpenPawConfig) => string;
export declare function listWhatsAppAuthDirs(cfg: OpenPawConfig): string[];
export declare function hasAnyWhatsAppAuth(cfg: OpenPawConfig): boolean;
export declare function resolveWhatsAppAuthDir(params: {
    cfg: OpenPawConfig;
    accountId: string;
}): {
    authDir: string;
    isLegacy: boolean;
};
export declare function resolveWhatsAppAccount(params: {
    cfg: OpenPawConfig;
    accountId?: string | null;
}): ResolvedWhatsAppAccount;
export declare function listEnabledWhatsAppAccounts(cfg: OpenPawConfig): ResolvedWhatsAppAccount[];
