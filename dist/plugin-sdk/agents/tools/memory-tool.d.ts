import type { OpenPawConfig } from "../../config/config.js";
import type { AnyAgentTool } from "./common.js";
export declare function createMemorySearchTool(options: {
    config?: OpenPawConfig;
    agentSessionKey?: string;
}): AnyAgentTool | null;
export declare function createMemoryGetTool(options: {
    config?: OpenPawConfig;
    agentSessionKey?: string;
}): AnyAgentTool | null;
