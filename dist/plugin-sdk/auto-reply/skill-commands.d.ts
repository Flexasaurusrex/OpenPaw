import { type SkillCommandSpec } from "../agents/skills.js";
import type { OpenPawConfig } from "../config/config.js";
export declare function listReservedChatSlashCommandNames(extraNames?: string[]): Set<string>;
export declare function listSkillCommandsForWorkspace(params: {
    workspaceDir: string;
    cfg: OpenPawConfig;
    skillFilter?: string[];
}): SkillCommandSpec[];
export declare function listSkillCommandsForAgents(params: {
    cfg: OpenPawConfig;
    agentIds?: string[];
}): SkillCommandSpec[];
export declare function resolveSkillCommandInvocation(params: {
    commandBodyNormalized: string;
    skillCommands: SkillCommandSpec[];
}): {
    command: SkillCommandSpec;
    args?: string;
} | null;
