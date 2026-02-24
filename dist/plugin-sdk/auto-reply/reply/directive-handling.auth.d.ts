import type { OpenPawConfig } from "../../config/config.js";
export type ModelAuthDetailMode = "compact" | "verbose";
export declare const resolveAuthLabel: (provider: string, cfg: OpenPawConfig, modelsPath: string, agentDir?: string, mode?: ModelAuthDetailMode) => Promise<{
    label: string;
    source: string;
}>;
export declare const formatAuthLabel: (auth: {
    label: string;
    source: string;
}) => string;
export declare const resolveProfileOverride: (params: {
    rawProfile?: string;
    provider: string;
    cfg: OpenPawConfig;
    agentDir?: string;
}) => {
    profileId?: string;
    error?: string;
};
