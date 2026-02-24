import { type ModelAliasIndex } from "../../agents/model-selection.js";
import type { OpenPawConfig } from "../../config/config.js";
import { type SessionEntry } from "../../config/sessions.js";
import type { InlineDirectives } from "./directive-handling.parse.js";
export declare function persistInlineDirectives(params: {
    directives: InlineDirectives;
    effectiveModelDirective?: string;
    cfg: OpenPawConfig;
    agentDir?: string;
    sessionEntry?: SessionEntry;
    sessionStore?: Record<string, SessionEntry>;
    sessionKey?: string;
    storePath?: string;
    elevatedEnabled: boolean;
    elevatedAllowed: boolean;
    defaultProvider: string;
    defaultModel: string;
    aliasIndex: ModelAliasIndex;
    allowedModelKeys: Set<string>;
    provider: string;
    model: string;
    initialModelLabel: string;
    formatModelSwitchEvent: (label: string, alias?: string) => string;
    agentCfg: NonNullable<OpenPawConfig["agents"]>["defaults"] | undefined;
}): Promise<{
    provider: string;
    model: string;
    contextTokens: number;
}>;
export declare function resolveDefaultModel(params: {
    cfg: OpenPawConfig;
    agentId?: string;
}): {
    defaultProvider: string;
    defaultModel: string;
    aliasIndex: ModelAliasIndex;
};
