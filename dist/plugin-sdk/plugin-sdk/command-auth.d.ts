import type { OpenPawConfig } from "../config/config.js";
export type ResolveSenderCommandAuthorizationParams = {
    cfg: OpenPawConfig;
    rawBody: string;
    isGroup: boolean;
    dmPolicy: string;
    configuredAllowFrom: string[];
    senderId: string;
    isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
    readAllowFromStore: () => Promise<string[]>;
    shouldComputeCommandAuthorized: (rawBody: string, cfg: OpenPawConfig) => boolean;
    resolveCommandAuthorizedFromAuthorizers: (params: {
        useAccessGroups: boolean;
        authorizers: Array<{
            configured: boolean;
            allowed: boolean;
        }>;
    }) => boolean;
};
export declare function resolveSenderCommandAuthorization(params: ResolveSenderCommandAuthorizationParams): Promise<{
    shouldComputeAuth: boolean;
    effectiveAllowFrom: string[];
    senderAllowedForCommands: boolean;
    commandAuthorized: boolean | undefined;
}>;
