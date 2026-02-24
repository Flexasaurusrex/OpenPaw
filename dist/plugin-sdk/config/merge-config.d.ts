import type { OpenPawConfig } from "./config.js";
import type { WhatsAppConfig } from "./types.js";
export type MergeSectionOptions<T> = {
    unsetOnUndefined?: Array<keyof T>;
};
export declare function mergeConfigSection<T extends Record<string, unknown>>(base: T | undefined, patch: Partial<T>, options?: MergeSectionOptions<T>): T;
export declare function mergeWhatsAppConfig(cfg: OpenPawConfig, patch: Partial<WhatsAppConfig>, options?: MergeSectionOptions<WhatsAppConfig>): OpenPawConfig;
