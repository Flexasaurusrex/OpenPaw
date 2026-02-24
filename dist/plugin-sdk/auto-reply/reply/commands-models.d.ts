import type { OpenPawConfig } from "../../config/config.js";
import type { SessionEntry } from "../../config/sessions.js";
import type { ReplyPayload } from "../types.js";
import type { CommandHandler } from "./commands-types.js";
export type ModelsProviderData = {
    byProvider: Map<string, Set<string>>;
    providers: string[];
    resolvedDefault: {
        provider: string;
        model: string;
    };
};
/**
 * Build provider/model data from config and catalog.
 * Exported for reuse by callback handlers.
 */
export declare function buildModelsProviderData(cfg: OpenPawConfig): Promise<ModelsProviderData>;
export declare function formatModelsAvailableHeader(params: {
    provider: string;
    total: number;
    cfg: OpenPawConfig;
    agentDir?: string;
    sessionEntry?: SessionEntry;
}): string;
export declare function resolveModelsCommandReply(params: {
    cfg: OpenPawConfig;
    commandBodyNormalized: string;
    surface?: string;
    currentModel?: string;
    agentDir?: string;
    sessionEntry?: SessionEntry;
}): Promise<ReplyPayload | null>;
export declare const handleModelsCommand: CommandHandler;
