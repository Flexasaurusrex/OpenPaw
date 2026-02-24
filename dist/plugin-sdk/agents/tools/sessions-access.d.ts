import type { OpenPawConfig } from "../../config/config.js";
export type SessionToolsVisibility = "self" | "tree" | "agent" | "all";
export type AgentToAgentPolicy = {
    enabled: boolean;
    matchesAllow: (agentId: string) => boolean;
    isAllowed: (requesterAgentId: string, targetAgentId: string) => boolean;
};
export type SessionAccessAction = "history" | "send" | "list";
export type SessionAccessResult = {
    allowed: true;
} | {
    allowed: false;
    error: string;
    status: "forbidden";
};
export declare function resolveSessionToolsVisibility(cfg: OpenPawConfig): SessionToolsVisibility;
export declare function resolveEffectiveSessionToolsVisibility(params: {
    cfg: OpenPawConfig;
    sandboxed: boolean;
}): SessionToolsVisibility;
export declare function resolveSandboxSessionToolsVisibility(cfg: OpenPawConfig): "spawned" | "all";
export declare function resolveSandboxedSessionToolContext(params: {
    cfg: OpenPawConfig;
    agentSessionKey?: string;
    sandboxed?: boolean;
}): {
    mainKey: string;
    alias: string;
    visibility: "spawned" | "all";
    requesterInternalKey: string | undefined;
    effectiveRequesterKey: string;
    restrictToSpawned: boolean;
};
export declare function createAgentToAgentPolicy(cfg: OpenPawConfig): AgentToAgentPolicy;
export declare function createSessionVisibilityGuard(params: {
    action: SessionAccessAction;
    requesterSessionKey: string;
    visibility: SessionToolsVisibility;
    a2aPolicy: AgentToAgentPolicy;
}): Promise<{
    check: (targetSessionKey: string) => SessionAccessResult;
}>;
