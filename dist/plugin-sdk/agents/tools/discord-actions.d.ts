import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import type { OpenPawConfig } from "../../config/config.js";
export declare function handleDiscordAction(params: Record<string, unknown>, cfg: OpenPawConfig, options?: {
    mediaLocalRoots?: readonly string[];
}): Promise<AgentToolResult<unknown>>;
