import { type OpenPawConfig } from "../config/config.js";
export declare function ensureOpenPawModelsJson(config?: OpenPawConfig, agentDirOverride?: string): Promise<{
    agentDir: string;
    wrote: boolean;
}>;
