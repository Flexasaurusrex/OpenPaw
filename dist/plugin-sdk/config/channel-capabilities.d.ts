import type { OpenPawConfig } from "./config.js";
export declare function resolveChannelCapabilities(params: {
    cfg?: Partial<OpenPawConfig>;
    channel?: string | null;
    accountId?: string | null;
}): string[] | undefined;
