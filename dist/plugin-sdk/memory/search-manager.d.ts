import type { OpenPawConfig } from "../config/config.js";
import type { MemorySearchManager } from "./types.js";
export type MemorySearchManagerResult = {
    manager: MemorySearchManager | null;
    error?: string;
};
export declare function getMemorySearchManager(params: {
    cfg: OpenPawConfig;
    agentId: string;
    purpose?: "default" | "status";
}): Promise<MemorySearchManagerResult>;
