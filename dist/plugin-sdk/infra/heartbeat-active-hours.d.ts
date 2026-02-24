import type { OpenPawConfig } from "../config/config.js";
import type { AgentDefaultsConfig } from "../config/types.agent-defaults.js";
type HeartbeatConfig = AgentDefaultsConfig["heartbeat"];
export declare function isWithinActiveHours(cfg: OpenPawConfig, heartbeat?: HeartbeatConfig, nowMs?: number): boolean;
export {};
