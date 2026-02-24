import type { OpenPawConfig } from "../../config/config.js";
import type { AuthProfileStore } from "./types.js";
export declare function resolveAuthProfileOrder(params: {
    cfg?: OpenPawConfig;
    store: AuthProfileStore;
    provider: string;
    preferredProfile?: string;
}): string[];
