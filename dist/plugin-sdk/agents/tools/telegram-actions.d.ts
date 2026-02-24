import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import type { OpenPawConfig } from "../../config/config.js";
import type { TelegramInlineButtons } from "../../telegram/button-types.js";
export declare function readTelegramButtons(params: Record<string, unknown>): TelegramInlineButtons | undefined;
export declare function handleTelegramAction(params: Record<string, unknown>, cfg: OpenPawConfig, options?: {
    mediaLocalRoots?: readonly string[];
}): Promise<AgentToolResult<unknown>>;
