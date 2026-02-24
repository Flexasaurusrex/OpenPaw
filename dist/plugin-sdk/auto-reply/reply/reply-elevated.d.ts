import type { OpenPawConfig } from "../../config/config.js";
import type { MsgContext } from "../templating.js";
export { formatElevatedUnavailableMessage } from "./elevated-unavailable.js";
export declare function resolveElevatedPermissions(params: {
    cfg: OpenPawConfig;
    agentId: string;
    ctx: MsgContext;
    provider: string;
}): {
    enabled: boolean;
    allowed: boolean;
    failures: Array<{
        gate: string;
        key: string;
    }>;
};
