import type { OpenPawConfig } from "../config/config.js";
export declare function getDefaultMediaLocalRoots(): readonly string[];
export declare function getAgentScopedMediaLocalRoots(cfg: OpenPawConfig, agentId?: string): readonly string[];
