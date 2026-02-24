import type { OpenPawConfig } from "../../config/config.js";
import type { MsgContext, TemplateContext } from "../templating.js";
export declare function stageSandboxMedia(params: {
    ctx: MsgContext;
    sessionCtx: TemplateContext;
    cfg: OpenPawConfig;
    sessionKey?: string;
    workspaceDir: string;
}): Promise<void>;
