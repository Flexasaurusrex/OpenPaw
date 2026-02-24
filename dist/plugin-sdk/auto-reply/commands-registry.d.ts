import type { SkillCommandSpec } from "../agents/skills.js";
import type { OpenPawConfig } from "../config/types.js";
import type { ChatCommandDefinition, CommandArgDefinition, CommandArgs, CommandDetection, CommandNormalizeOptions, NativeCommandSpec, ShouldHandleTextCommandsParams } from "./commands-registry.types.js";
export type { ChatCommandDefinition, CommandArgChoiceContext, CommandArgDefinition, CommandArgMenuSpec, CommandArgValues, CommandArgs, CommandDetection, CommandNormalizeOptions, CommandScope, NativeCommandSpec, ShouldHandleTextCommandsParams, } from "./commands-registry.types.js";
export declare function listChatCommands(params?: {
    skillCommands?: SkillCommandSpec[];
}): ChatCommandDefinition[];
export declare function isCommandEnabled(cfg: OpenPawConfig, commandKey: string): boolean;
export declare function listChatCommandsForConfig(cfg: OpenPawConfig, params?: {
    skillCommands?: SkillCommandSpec[];
}): ChatCommandDefinition[];
export declare function listNativeCommandSpecs(params?: {
    skillCommands?: SkillCommandSpec[];
    provider?: string;
}): NativeCommandSpec[];
export declare function listNativeCommandSpecsForConfig(cfg: OpenPawConfig, params?: {
    skillCommands?: SkillCommandSpec[];
    provider?: string;
}): NativeCommandSpec[];
export declare function findCommandByNativeName(name: string, provider?: string): ChatCommandDefinition | undefined;
export declare function buildCommandText(commandName: string, args?: string): string;
export declare function parseCommandArgs(command: ChatCommandDefinition, raw?: string): CommandArgs | undefined;
export declare function serializeCommandArgs(command: ChatCommandDefinition, args?: CommandArgs): string | undefined;
export declare function buildCommandTextFromArgs(command: ChatCommandDefinition, args?: CommandArgs): string;
export type ResolvedCommandArgChoice = {
    value: string;
    label: string;
};
export declare function resolveCommandArgChoices(params: {
    command: ChatCommandDefinition;
    arg: CommandArgDefinition;
    cfg?: OpenPawConfig;
    provider?: string;
    model?: string;
}): ResolvedCommandArgChoice[];
export declare function resolveCommandArgMenu(params: {
    command: ChatCommandDefinition;
    args?: CommandArgs;
    cfg?: OpenPawConfig;
}): {
    arg: CommandArgDefinition;
    choices: ResolvedCommandArgChoice[];
    title?: string;
} | null;
export declare function normalizeCommandBody(raw: string, options?: CommandNormalizeOptions): string;
export declare function isCommandMessage(raw: string): boolean;
export declare function getCommandDetection(_cfg?: OpenPawConfig): CommandDetection;
export declare function maybeResolveTextAlias(raw: string, cfg?: OpenPawConfig): string | null;
export declare function resolveTextCommand(raw: string, cfg?: OpenPawConfig): {
    command: ChatCommandDefinition;
    args?: string;
} | null;
export declare function isNativeCommandSurface(surface?: string): boolean;
export declare function shouldHandleTextCommands(params: ShouldHandleTextCommandsParams): boolean;
