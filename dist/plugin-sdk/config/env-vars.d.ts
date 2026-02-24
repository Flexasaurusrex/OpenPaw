import type { OpenPawConfig } from "./types.js";
export declare function collectConfigRuntimeEnvVars(cfg?: OpenPawConfig): Record<string, string>;
export declare function collectConfigServiceEnvVars(cfg?: OpenPawConfig): Record<string, string>;
/** @deprecated Use `collectConfigRuntimeEnvVars` or `collectConfigServiceEnvVars`. */
export declare function collectConfigEnvVars(cfg?: OpenPawConfig): Record<string, string>;
export declare function applyConfigEnvVars(cfg: OpenPawConfig, env?: NodeJS.ProcessEnv): void;
