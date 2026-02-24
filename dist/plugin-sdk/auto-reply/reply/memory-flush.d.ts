import type { OpenPawConfig } from "../../config/config.js";
import { type SessionEntry } from "../../config/sessions.js";
export declare const DEFAULT_MEMORY_FLUSH_SOFT_TOKENS = 4000;
export declare const DEFAULT_MEMORY_FLUSH_PROMPT: string;
export declare const DEFAULT_MEMORY_FLUSH_SYSTEM_PROMPT: string;
export declare function resolveMemoryFlushPromptForRun(params: {
    prompt: string;
    cfg?: OpenPawConfig;
    nowMs?: number;
}): string;
export type MemoryFlushSettings = {
    enabled: boolean;
    softThresholdTokens: number;
    prompt: string;
    systemPrompt: string;
    reserveTokensFloor: number;
};
export declare function resolveMemoryFlushSettings(cfg?: OpenPawConfig): MemoryFlushSettings | null;
export declare function resolveMemoryFlushContextWindowTokens(params: {
    modelId?: string;
    agentCfgContextTokens?: number;
}): number;
export declare function shouldRunMemoryFlush(params: {
    entry?: Pick<SessionEntry, "totalTokens" | "totalTokensFresh" | "compactionCount" | "memoryFlushCompactionCount">;
    contextWindowTokens: number;
    reserveTokensFloor: number;
    softThresholdTokens: number;
}): boolean;
