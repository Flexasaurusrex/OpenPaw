import type { OpenPawConfig } from "../config/config.js";
import type { ChannelAccountSnapshot } from "./plugins/types.core.js";
import type { ChannelPlugin } from "./plugins/types.plugin.js";
export declare function buildChannelAccountSnapshot(params: {
    plugin: ChannelPlugin;
    account: unknown;
    cfg: OpenPawConfig;
    accountId: string;
    enabled: boolean;
    configured: boolean;
}): ChannelAccountSnapshot;
export declare function formatChannelAllowFrom(params: {
    plugin: ChannelPlugin;
    cfg: OpenPawConfig;
    accountId?: string | null;
    allowFrom: Array<string | number>;
}): string[];
