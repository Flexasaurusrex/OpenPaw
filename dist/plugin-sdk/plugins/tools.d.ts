import type { AnyAgentTool } from "../agents/tools/common.js";
import type { OpenPawPluginToolContext } from "./types.js";
type PluginToolMeta = {
    pluginId: string;
    optional: boolean;
};
export declare function getPluginToolMeta(tool: AnyAgentTool): PluginToolMeta | undefined;
export declare function resolvePluginTools(params: {
    context: OpenPawPluginToolContext;
    existingToolNames?: Set<string>;
    toolAllowlist?: string[];
    suppressNameConflicts?: boolean;
}): AnyAgentTool[];
export {};
