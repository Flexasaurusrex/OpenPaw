export declare const CACHE_TTL_CUSTOM_TYPE = "openpaw.cache-ttl";
export type CacheTtlEntryData = {
    timestamp: number;
    provider?: string;
    modelId?: string;
};
export declare function isCacheTtlEligibleProvider(provider: string, modelId: string): boolean;
export declare function readLastCacheTtlTimestamp(sessionManager: unknown): number | null;
export declare function appendCacheTtlTimestamp(sessionManager: unknown, data: CacheTtlEntryData): void;
