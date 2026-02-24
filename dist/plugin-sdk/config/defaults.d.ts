import type { OpenPawConfig } from "./types.js";
type WarnState = {
    warned: boolean;
};
export type SessionDefaultsOptions = {
    warn?: (message: string) => void;
    warnState?: WarnState;
};
export declare function applyMessageDefaults(cfg: OpenPawConfig): OpenPawConfig;
export declare function applySessionDefaults(cfg: OpenPawConfig, options?: SessionDefaultsOptions): OpenPawConfig;
export declare function applyTalkApiKey(config: OpenPawConfig): OpenPawConfig;
export declare function applyModelDefaults(cfg: OpenPawConfig): OpenPawConfig;
export declare function applyAgentDefaults(cfg: OpenPawConfig): OpenPawConfig;
export declare function applyLoggingDefaults(cfg: OpenPawConfig): OpenPawConfig;
export declare function applyContextPruningDefaults(cfg: OpenPawConfig): OpenPawConfig;
export declare function applyCompactionDefaults(cfg: OpenPawConfig): OpenPawConfig;
export declare function resetSessionDefaultsWarningForTests(): void;
export {};
