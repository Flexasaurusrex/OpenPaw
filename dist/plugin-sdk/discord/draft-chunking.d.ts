import type { OpenPawConfig } from "../config/config.js";
export declare function resolveDiscordDraftStreamingChunking(cfg: OpenPawConfig | undefined, accountId?: string | null): {
    minChars: number;
    maxChars: number;
    breakPreference: "paragraph" | "newline" | "sentence";
};
