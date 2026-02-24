import type { OpenPawConfig } from "../config/config.js";
export declare function resolveAgentTimeoutSeconds(cfg?: OpenPawConfig): number;
export declare function resolveAgentTimeoutMs(opts: {
    cfg?: OpenPawConfig;
    overrideMs?: number | null;
    overrideSeconds?: number | null;
    minMs?: number;
}): number;
