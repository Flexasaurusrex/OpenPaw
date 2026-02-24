import type { OpenPawConfig } from "../config/config.js";
import type { PluginRecord } from "./registry.js";
export type NormalizedPluginsConfig = {
    enabled: boolean;
    allow: string[];
    deny: string[];
    loadPaths: string[];
    slots: {
        memory?: string | null;
    };
    entries: Record<string, {
        enabled?: boolean;
        config?: unknown;
    }>;
};
export declare const BUNDLED_ENABLED_BY_DEFAULT: Set<string>;
export declare const normalizePluginsConfig: (config?: OpenPawConfig["plugins"]) => NormalizedPluginsConfig;
export declare function applyTestPluginDefaults(cfg: OpenPawConfig, env?: NodeJS.ProcessEnv): OpenPawConfig;
export declare function isTestDefaultMemorySlotDisabled(cfg: OpenPawConfig, env?: NodeJS.ProcessEnv): boolean;
export declare function resolveEnableState(id: string, origin: PluginRecord["origin"], config: NormalizedPluginsConfig): {
    enabled: boolean;
    reason?: string;
};
export declare function resolveMemorySlotDecision(params: {
    id: string;
    kind?: string;
    slot: string | null | undefined;
    selectedId: string | null;
}): {
    enabled: boolean;
    reason?: string;
    selected?: boolean;
};
