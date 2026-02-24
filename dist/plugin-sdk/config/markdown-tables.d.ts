import type { OpenPawConfig } from "./config.js";
import type { MarkdownTableMode } from "./types.base.js";
export declare function resolveMarkdownTableMode(params: {
    cfg?: Partial<OpenPawConfig>;
    channel?: string | null;
    accountId?: string | null;
}): MarkdownTableMode;
