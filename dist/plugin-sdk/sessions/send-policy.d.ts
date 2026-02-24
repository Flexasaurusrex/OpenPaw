import type { OpenPawConfig } from "../config/config.js";
import type { SessionChatType, SessionEntry } from "../config/sessions.js";
export type SessionSendPolicyDecision = "allow" | "deny";
export declare function normalizeSendPolicy(raw?: string | null): SessionSendPolicyDecision | undefined;
export declare function resolveSendPolicy(params: {
    cfg: OpenPawConfig;
    entry?: SessionEntry;
    sessionKey?: string;
    channel?: string;
    chatType?: SessionChatType;
}): SessionSendPolicyDecision;
