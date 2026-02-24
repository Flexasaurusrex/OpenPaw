import type { OpenPawConfig } from "../../config/config.js";
import type { AuthProfileStore } from "./types.js";
export declare function resolveAuthProfileDisplayLabel(params: {
    cfg?: OpenPawConfig;
    store: AuthProfileStore;
    profileId: string;
}): string;
