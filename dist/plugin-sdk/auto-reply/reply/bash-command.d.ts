import type { OpenPawConfig } from "../../config/config.js";
import type { MsgContext } from "../templating.js";
import type { ReplyPayload } from "../types.js";
export declare function handleBashChatCommand(params: {
    ctx: MsgContext;
    cfg: OpenPawConfig;
    agentId?: string;
    sessionKey: string;
    isGroup: boolean;
    elevated: {
        enabled: boolean;
        allowed: boolean;
        failures: Array<{
            gate: string;
            key: string;
        }>;
    };
}): Promise<ReplyPayload>;
export declare function resetBashChatCommandForTests(): void;
