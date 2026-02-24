import type { MsgContext } from "../auto-reply/templating.js";
import type { OpenPawConfig } from "../config/config.js";
export type ApplyLinkUnderstandingResult = {
    outputs: string[];
    urls: string[];
};
export declare function applyLinkUnderstanding(params: {
    ctx: MsgContext;
    cfg: OpenPawConfig;
}): Promise<ApplyLinkUnderstandingResult>;
