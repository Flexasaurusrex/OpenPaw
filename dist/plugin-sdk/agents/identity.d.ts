import type { OpenPawConfig, HumanDelayConfig, IdentityConfig } from "../config/config.js";
export declare function resolveAgentIdentity(cfg: OpenPawConfig, agentId: string): IdentityConfig | undefined;
export declare function resolveAckReaction(cfg: OpenPawConfig, agentId: string, opts?: {
    channel?: string;
    accountId?: string;
}): string;
export declare function resolveIdentityNamePrefix(cfg: OpenPawConfig, agentId: string): string | undefined;
/** Returns just the identity name (without brackets) for template context. */
export declare function resolveIdentityName(cfg: OpenPawConfig, agentId: string): string | undefined;
export declare function resolveMessagePrefix(cfg: OpenPawConfig, agentId: string, opts?: {
    configured?: string;
    hasAllowFrom?: boolean;
    fallback?: string;
}): string;
export declare function resolveResponsePrefix(cfg: OpenPawConfig, agentId: string, opts?: {
    channel?: string;
    accountId?: string;
}): string | undefined;
export declare function resolveEffectiveMessagesConfig(cfg: OpenPawConfig, agentId: string, opts?: {
    hasAllowFrom?: boolean;
    fallbackMessagePrefix?: string;
    channel?: string;
    accountId?: string;
}): {
    messagePrefix: string;
    responsePrefix?: string;
};
export declare function resolveHumanDelayConfig(cfg: OpenPawConfig, agentId: string): HumanDelayConfig | undefined;
