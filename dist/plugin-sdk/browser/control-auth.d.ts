import type { OpenPawConfig } from "../config/config.js";
export type BrowserControlAuth = {
    token?: string;
    password?: string;
};
export declare function resolveBrowserControlAuth(cfg: OpenPawConfig | undefined, env?: NodeJS.ProcessEnv): BrowserControlAuth;
export declare function ensureBrowserControlAuth(params: {
    cfg: OpenPawConfig;
    env?: NodeJS.ProcessEnv;
}): Promise<{
    auth: BrowserControlAuth;
    generatedToken?: string;
}>;
