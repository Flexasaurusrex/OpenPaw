import type { OpenPawConfig } from "../../config/config.js";
import type { SandboxConfig, SandboxToolPolicyResolved } from "./types.js";
export declare function resolveSandboxRuntimeStatus(params: {
    cfg?: OpenPawConfig;
    sessionKey?: string;
}): {
    agentId: string;
    sessionKey: string;
    mainSessionKey: string;
    mode: SandboxConfig["mode"];
    sandboxed: boolean;
    toolPolicy: SandboxToolPolicyResolved;
};
export declare function formatSandboxToolPolicyBlockedMessage(params: {
    cfg?: OpenPawConfig;
    sessionKey?: string;
    toolName: string;
}): string | undefined;
