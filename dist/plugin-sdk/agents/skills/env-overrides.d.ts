import type { OpenPawConfig } from "../../config/config.js";
import type { SkillEntry, SkillSnapshot } from "./types.js";
export declare function applySkillEnvOverrides(params: {
    skills: SkillEntry[];
    config?: OpenPawConfig;
}): () => void;
export declare function applySkillEnvOverridesFromSnapshot(params: {
    snapshot?: SkillSnapshot;
    config?: OpenPawConfig;
}): () => void;
