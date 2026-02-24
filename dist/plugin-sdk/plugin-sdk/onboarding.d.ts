import type { OpenPawConfig } from "../config/config.js";
import type { WizardPrompter } from "../wizard/prompts.js";
export type PromptAccountIdParams = {
    cfg: OpenPawConfig;
    prompter: WizardPrompter;
    label: string;
    currentId?: string;
    listAccountIds: (cfg: OpenPawConfig) => string[];
    defaultAccountId: string;
};
export declare function promptAccountId(params: PromptAccountIdParams): Promise<string>;
