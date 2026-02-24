import type { ChannelHeartbeatDeps } from "../channels/plugins/types.js";
import type { OpenPawConfig } from "../config/config.js";
import type { AgentDefaultsConfig } from "../config/types.agent-defaults.js";
import { type RuntimeEnv } from "../runtime.js";
import { isCronSystemEvent } from "./heartbeat-events-filter.js";
import { type HeartbeatRunResult } from "./heartbeat-wake.js";
import type { OutboundSendDeps } from "./outbound/deliver.js";
export type HeartbeatDeps = OutboundSendDeps & ChannelHeartbeatDeps & {
    runtime?: RuntimeEnv;
    getQueueSize?: (lane?: string) => number;
    nowMs?: () => number;
};
export declare function setHeartbeatsEnabled(enabled: boolean): void;
type HeartbeatConfig = AgentDefaultsConfig["heartbeat"];
export type HeartbeatSummary = {
    enabled: boolean;
    every: string;
    everyMs: number | null;
    prompt: string;
    target: string;
    model?: string;
    ackMaxChars: number;
};
export { isCronSystemEvent };
export type HeartbeatRunner = {
    stop: () => void;
    updateConfig: (cfg: OpenPawConfig) => void;
};
export declare function isHeartbeatEnabledForAgent(cfg: OpenPawConfig, agentId?: string): boolean;
export declare function resolveHeartbeatSummaryForAgent(cfg: OpenPawConfig, agentId?: string): HeartbeatSummary;
export declare function resolveHeartbeatIntervalMs(cfg: OpenPawConfig, overrideEvery?: string, heartbeat?: HeartbeatConfig): number | null;
export declare function resolveHeartbeatPrompt(cfg: OpenPawConfig, heartbeat?: HeartbeatConfig): string;
export declare function runHeartbeatOnce(opts: {
    cfg?: OpenPawConfig;
    agentId?: string;
    sessionKey?: string;
    heartbeat?: HeartbeatConfig;
    reason?: string;
    deps?: HeartbeatDeps;
}): Promise<HeartbeatRunResult>;
export declare function startHeartbeatRunner(opts: {
    cfg?: OpenPawConfig;
    runtime?: RuntimeEnv;
    abortSignal?: AbortSignal;
    runOnce?: typeof runHeartbeatOnce;
}): HeartbeatRunner;
