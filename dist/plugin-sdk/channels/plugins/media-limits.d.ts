import type { OpenPawConfig } from "../../config/config.js";
export declare function resolveChannelMediaMaxBytes(params: {
    cfg: OpenPawConfig;
    resolveChannelLimitMb: (params: {
        cfg: OpenPawConfig;
        accountId: string;
    }) => number | undefined;
    accountId?: string | null;
}): number | undefined;
