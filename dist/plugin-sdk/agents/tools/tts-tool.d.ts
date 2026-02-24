import type { OpenPawConfig } from "../../config/config.js";
import type { GatewayMessageChannel } from "../../utils/message-channel.js";
import type { AnyAgentTool } from "./common.js";
export declare function createTtsTool(opts?: {
    config?: OpenPawConfig;
    agentChannel?: GatewayMessageChannel;
}): AnyAgentTool;
