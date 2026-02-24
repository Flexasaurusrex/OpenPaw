import type { OpenPawConfig } from "../../config/config.js";
import type { MsgContext } from "../templating.js";
import type { CommandContext } from "./commands-types.js";
export declare function buildCommandContext(params: {
    ctx: MsgContext;
    cfg: OpenPawConfig;
    agentId?: string;
    sessionKey?: string;
    isGroup: boolean;
    triggerBodyNormalized: string;
    commandAuthorized: boolean;
}): CommandContext;
