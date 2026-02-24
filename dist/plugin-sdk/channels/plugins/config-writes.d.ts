import type { OpenPawConfig } from "../../config/config.js";
import type { ChannelId } from "./types.js";
export declare function resolveChannelConfigWrites(params: {
    cfg: OpenPawConfig;
    channelId?: ChannelId | null;
    accountId?: string | null;
}): boolean;
