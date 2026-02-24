import type { OpenPawConfig } from "../config/config.js";
import type { SessionEntry } from "../config/sessions.js";
export declare function resolveModelAuthLabel(params: {
    provider?: string;
    cfg?: OpenPawConfig;
    sessionEntry?: SessionEntry;
    agentDir?: string;
}): string | undefined;
