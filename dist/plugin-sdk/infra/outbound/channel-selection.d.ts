import type { OpenPawConfig } from "../../config/config.js";
import { type DeliverableMessageChannel } from "../../utils/message-channel.js";
export type MessageChannelId = DeliverableMessageChannel;
export declare function listConfiguredMessageChannels(cfg: OpenPawConfig): Promise<MessageChannelId[]>;
export declare function resolveMessageChannelSelection(params: {
    cfg: OpenPawConfig;
    channel?: string | null;
}): Promise<{
    channel: MessageChannelId;
    configured: MessageChannelId[];
}>;
