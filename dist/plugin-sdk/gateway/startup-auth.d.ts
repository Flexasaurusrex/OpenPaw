import type { GatewayAuthConfig, GatewayTailscaleConfig, OpenPawConfig } from "../config/config.js";
import { resolveGatewayAuth, type ResolvedGatewayAuth } from "./auth.js";
export declare function mergeGatewayAuthConfig(base?: GatewayAuthConfig, override?: GatewayAuthConfig): GatewayAuthConfig;
export declare function mergeGatewayTailscaleConfig(base?: GatewayTailscaleConfig, override?: GatewayTailscaleConfig): GatewayTailscaleConfig;
export declare function ensureGatewayStartupAuth(params: {
    cfg: OpenPawConfig;
    env?: NodeJS.ProcessEnv;
    authOverride?: GatewayAuthConfig;
    tailscaleOverride?: GatewayTailscaleConfig;
    persist?: boolean;
}): Promise<{
    cfg: OpenPawConfig;
    auth: ReturnType<typeof resolveGatewayAuth>;
    generatedToken?: string;
    persistedGeneratedToken: boolean;
}>;
export declare function assertHooksTokenSeparateFromGatewayAuth(params: {
    cfg: OpenPawConfig;
    auth: ResolvedGatewayAuth;
}): void;
