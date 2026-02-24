import type { OpenPawConfig } from "../../config/config.js";
import { type SessionEntry } from "../../config/sessions.js";
export declare function clearSessionAuthProfileOverride(params: {
    sessionEntry: SessionEntry;
    sessionStore: Record<string, SessionEntry>;
    sessionKey: string;
    storePath?: string;
}): Promise<void>;
export declare function resolveSessionAuthProfileOverride(params: {
    cfg: OpenPawConfig;
    provider: string;
    agentDir: string;
    sessionEntry?: SessionEntry;
    sessionStore?: Record<string, SessionEntry>;
    sessionKey?: string;
    storePath?: string;
    isNewSession: boolean;
}): Promise<string | undefined>;
