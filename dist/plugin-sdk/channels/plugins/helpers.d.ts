import type { OpenPawConfig } from "../../config/config.js";
import type { ChannelPlugin } from "./types.js";
export declare function resolveChannelDefaultAccountId<ResolvedAccount>(params: {
    plugin: ChannelPlugin<ResolvedAccount>;
    cfg: OpenPawConfig;
    accountIds?: string[];
}): string;
export declare function formatPairingApproveHint(channelId: string): string;
