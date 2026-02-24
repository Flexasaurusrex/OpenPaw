import type { OpenPawConfig } from "../config/config.js";
export declare const DEFAULT_PI_COMPACTION_RESERVE_TOKENS_FLOOR = 20000;
type PiSettingsManagerLike = {
    getCompactionReserveTokens: () => number;
    getCompactionKeepRecentTokens: () => number;
    applyOverrides: (overrides: {
        compaction: {
            reserveTokens?: number;
            keepRecentTokens?: number;
        };
    }) => void;
};
export declare function ensurePiCompactionReserveTokens(params: {
    settingsManager: PiSettingsManagerLike;
    minReserveTokens?: number;
}): {
    didOverride: boolean;
    reserveTokens: number;
};
export declare function resolveCompactionReserveTokensFloor(cfg?: OpenPawConfig): number;
export declare function applyPiCompactionSettingsFromConfig(params: {
    settingsManager: PiSettingsManagerLike;
    cfg?: OpenPawConfig;
}): {
    didOverride: boolean;
    compaction: {
        reserveTokens: number;
        keepRecentTokens: number;
    };
};
export {};
