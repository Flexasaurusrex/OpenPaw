import type { ChannelAgentTool, ChannelMessageActionName } from "../channels/plugins/types.js";
import type { OpenPawConfig } from "../config/config.js";
/**
 * Get the list of supported message actions for a specific channel.
 * Returns an empty array if channel is not found or has no actions configured.
 */
export declare function listChannelSupportedActions(params: {
    cfg?: OpenPawConfig;
    channel?: string;
}): ChannelMessageActionName[];
/**
 * Get the list of all supported message actions across all configured channels.
 */
export declare function listAllChannelSupportedActions(params: {
    cfg?: OpenPawConfig;
}): ChannelMessageActionName[];
export declare function listChannelAgentTools(params: {
    cfg?: OpenPawConfig;
}): ChannelAgentTool[];
export declare function resolveChannelMessageToolHints(params: {
    cfg?: OpenPawConfig;
    channel?: string | null;
    accountId?: string | null;
}): string[];
export declare const __testing: {
    resetLoggedListActionErrors(): void;
};
