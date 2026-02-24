import type { OpenPawConfig, SkillConfig } from "../../config/config.js";
import { hasBinary, resolveConfigPath, resolveRuntimePlatform } from "../../shared/config-eval.js";
import type { SkillEligibilityContext, SkillEntry } from "./types.js";
export { hasBinary, resolveConfigPath, resolveRuntimePlatform };
export declare function isConfigPathTruthy(config: OpenPawConfig | undefined, pathStr: string): boolean;
export declare function resolveSkillConfig(config: OpenPawConfig | undefined, skillKey: string): SkillConfig | undefined;
export declare function resolveBundledAllowlist(config?: OpenPawConfig): string[] | undefined;
export declare function isBundledSkillAllowed(entry: SkillEntry, allowlist?: string[]): boolean;
export declare function shouldIncludeSkill(params: {
    entry: SkillEntry;
    config?: OpenPawConfig;
    eligibility?: SkillEligibilityContext;
}): boolean;
