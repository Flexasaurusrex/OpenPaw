import type { ChannelThreadingContext, ChannelThreadingToolContext } from "../channels/plugins/types.js";
import type { OpenPawConfig } from "../config/config.js";
export declare function buildSlackThreadingToolContext(params: {
    cfg: OpenPawConfig;
    accountId?: string | null;
    context: ChannelThreadingContext;
    hasRepliedRef?: {
        value: boolean;
    };
}): ChannelThreadingToolContext;
