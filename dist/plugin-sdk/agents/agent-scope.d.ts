import type { OpenPawConfig } from "../config/config.js";
export { resolveAgentIdFromSessionKey } from "../routing/session-key.js";
type AgentEntry = NonNullable<NonNullable<OpenPawConfig["agents"]>["list"]>[number];
type ResolvedAgentConfig = {
    name?: string;
    workspace?: string;
    agentDir?: string;
    model?: AgentEntry["model"];
    skills?: AgentEntry["skills"];
    memorySearch?: AgentEntry["memorySearch"];
    humanDelay?: AgentEntry["humanDelay"];
    heartbeat?: AgentEntry["heartbeat"];
    identity?: AgentEntry["identity"];
    groupChat?: AgentEntry["groupChat"];
    subagents?: AgentEntry["subagents"];
    sandbox?: AgentEntry["sandbox"];
    tools?: AgentEntry["tools"];
};
export declare function listAgentEntries(cfg: OpenPawConfig): AgentEntry[];
export declare function listAgentIds(cfg: OpenPawConfig): string[];
export declare function resolveDefaultAgentId(cfg: OpenPawConfig): string;
export declare function resolveSessionAgentIds(params: {
    sessionKey?: string;
    config?: OpenPawConfig;
    agentId?: string;
}): {
    defaultAgentId: string;
    sessionAgentId: string;
};
export declare function resolveSessionAgentId(params: {
    sessionKey?: string;
    config?: OpenPawConfig;
}): string;
export declare function resolveAgentConfig(cfg: OpenPawConfig, agentId: string): ResolvedAgentConfig | undefined;
export declare function resolveAgentSkillsFilter(cfg: OpenPawConfig, agentId: string): string[] | undefined;
export declare function resolveAgentExplicitModelPrimary(cfg: OpenPawConfig, agentId: string): string | undefined;
export declare function resolveAgentEffectiveModelPrimary(cfg: OpenPawConfig, agentId: string): string | undefined;
export declare function resolveAgentModelPrimary(cfg: OpenPawConfig, agentId: string): string | undefined;
export declare function resolveAgentModelFallbacksOverride(cfg: OpenPawConfig, agentId: string): string[] | undefined;
export declare function resolveEffectiveModelFallbacks(params: {
    cfg: OpenPawConfig;
    agentId: string;
    hasSessionModelOverride: boolean;
}): string[] | undefined;
export declare function resolveAgentWorkspaceDir(cfg: OpenPawConfig, agentId: string): string;
export declare function resolveAgentDir(cfg: OpenPawConfig, agentId: string): string;
