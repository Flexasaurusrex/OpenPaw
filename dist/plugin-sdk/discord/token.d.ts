import type { BaseTokenResolution } from "../channels/plugins/types.js";
import type { OpenPawConfig } from "../config/config.js";
export type DiscordTokenSource = "env" | "config" | "none";
export type DiscordTokenResolution = BaseTokenResolution & {
    source: DiscordTokenSource;
};
export declare function normalizeDiscordToken(raw?: string | null): string | undefined;
export declare function resolveDiscordToken(cfg?: OpenPawConfig, opts?: {
    accountId?: string | null;
    envToken?: string | null;
}): DiscordTokenResolution;
