import type { OpenPawConfig } from "../../../config/config.js";
import type { WizardPrompter } from "../../../wizard/prompts.js";
import { type ChannelAccessPolicy } from "./channel-access.js";
export declare function configureChannelAccessWithAllowlist<TResolved>(params: {
    cfg: OpenPawConfig;
    prompter: WizardPrompter;
    label: string;
    currentPolicy: ChannelAccessPolicy;
    currentEntries: string[];
    placeholder: string;
    updatePrompt: boolean;
    setPolicy: (cfg: OpenPawConfig, policy: ChannelAccessPolicy) => OpenPawConfig;
    resolveAllowlist: (params: {
        cfg: OpenPawConfig;
        entries: string[];
    }) => Promise<TResolved>;
    applyAllowlist: (params: {
        cfg: OpenPawConfig;
        resolved: TResolved;
    }) => OpenPawConfig;
}): Promise<OpenPawConfig>;
