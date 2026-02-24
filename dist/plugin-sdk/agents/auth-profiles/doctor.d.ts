import type { OpenPawConfig } from "../../config/config.js";
import type { AuthProfileStore } from "./types.js";
export declare function formatAuthDoctorHint(params: {
    cfg?: OpenPawConfig;
    store: AuthProfileStore;
    provider: string;
    profileId?: string;
}): string;
