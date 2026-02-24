import type { OpenPawConfig } from "../config/config.js";
import type { CliBackendConfig } from "../config/types.js";
export type ResolvedCliBackend = {
    id: string;
    config: CliBackendConfig;
};
export declare function resolveCliBackendIds(cfg?: OpenPawConfig): Set<string>;
export declare function resolveCliBackendConfig(provider: string, cfg?: OpenPawConfig): ResolvedCliBackend | null;
