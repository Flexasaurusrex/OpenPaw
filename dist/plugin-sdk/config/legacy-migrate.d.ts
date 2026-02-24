import type { OpenPawConfig } from "./types.js";
export declare function migrateLegacyConfig(raw: unknown): {
    config: OpenPawConfig | null;
    changes: string[];
};
