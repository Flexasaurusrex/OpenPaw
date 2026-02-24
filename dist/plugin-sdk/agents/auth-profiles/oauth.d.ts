import type { OpenPawConfig } from "../../config/config.js";
import type { AuthProfileStore } from "./types.js";
type ResolveApiKeyForProfileParams = {
    cfg?: OpenPawConfig;
    store: AuthProfileStore;
    profileId: string;
    agentDir?: string;
};
export declare function resolveApiKeyForProfile(params: ResolveApiKeyForProfileParams): Promise<{
    apiKey: string;
    provider: string;
    email?: string;
} | null>;
export {};
