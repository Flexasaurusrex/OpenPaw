import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import type { OpenPawConfig } from "../../config/config.js";
import type { ChannelMessageActionContext, ChannelMessageActionName } from "./types.js";
export declare function listChannelMessageActions(cfg: OpenPawConfig): ChannelMessageActionName[];
export declare function supportsChannelMessageButtons(cfg: OpenPawConfig): boolean;
export declare function supportsChannelMessageButtonsForChannel(params: {
    cfg: OpenPawConfig;
    channel?: string;
}): boolean;
export declare function supportsChannelMessageCards(cfg: OpenPawConfig): boolean;
export declare function supportsChannelMessageCardsForChannel(params: {
    cfg: OpenPawConfig;
    channel?: string;
}): boolean;
export declare function dispatchChannelMessageAction(ctx: ChannelMessageActionContext): Promise<AgentToolResult<unknown> | null>;
