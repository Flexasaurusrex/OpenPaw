import type { OpenPawConfig } from "../config/config.js";
type SessionDepthEntry = {
    sessionId?: unknown;
    spawnDepth?: unknown;
    spawnedBy?: unknown;
};
export declare function getSubagentDepthFromSessionStore(sessionKey: string | undefined | null, opts?: {
    cfg?: OpenPawConfig;
    store?: Record<string, SessionDepthEntry>;
}): number;
export {};
