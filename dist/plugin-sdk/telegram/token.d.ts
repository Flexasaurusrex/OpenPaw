import type { BaseTokenResolution } from "../channels/plugins/types.js";
import type { OpenPawConfig } from "../config/config.js";
export type TelegramTokenSource = "env" | "tokenFile" | "config" | "none";
export type TelegramTokenResolution = BaseTokenResolution & {
    source: TelegramTokenSource;
};
type ResolveTelegramTokenOpts = {
    envToken?: string | null;
    accountId?: string | null;
    logMissingFile?: (message: string) => void;
};
export declare function resolveTelegramToken(cfg?: OpenPawConfig, opts?: ResolveTelegramTokenOpts): TelegramTokenResolution;
export {};
