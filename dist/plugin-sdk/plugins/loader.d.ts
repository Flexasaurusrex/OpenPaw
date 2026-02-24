import type { OpenPawConfig } from "../config/config.js";
import type { GatewayRequestHandler } from "../gateway/server-methods/types.js";
import { type PluginRegistry } from "./registry.js";
import type { PluginLogger } from "./types.js";
export type PluginLoadResult = PluginRegistry;
export type PluginLoadOptions = {
    config?: OpenPawConfig;
    workspaceDir?: string;
    logger?: PluginLogger;
    coreGatewayHandlers?: Record<string, GatewayRequestHandler>;
    cache?: boolean;
    mode?: "full" | "validate";
};
export declare function loadOpenPawPlugins(options?: PluginLoadOptions): PluginRegistry;
