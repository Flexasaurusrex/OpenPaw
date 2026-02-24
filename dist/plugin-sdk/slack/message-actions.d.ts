import type { ChannelMessageActionName, ChannelToolSend } from "../channels/plugins/types.js";
import type { OpenPawConfig } from "../config/config.js";
export declare function listSlackMessageActions(cfg: OpenPawConfig): ChannelMessageActionName[];
export declare function extractSlackToolSend(args: Record<string, unknown>): ChannelToolSend | null;
