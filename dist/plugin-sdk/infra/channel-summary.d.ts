import { type OpenPawConfig } from "../config/config.js";
export type ChannelSummaryOptions = {
    colorize?: boolean;
    includeAllowFrom?: boolean;
};
export declare function buildChannelSummary(cfg?: OpenPawConfig, options?: ChannelSummaryOptions): Promise<string[]>;
