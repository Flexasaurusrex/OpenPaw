import type { OpenPawConfig } from "../../config/config.js";
import type { SandboxContext, SandboxDockerConfig, SandboxWorkspaceInfo } from "./types.js";
export declare function resolveSandboxDockerUser(params: {
    docker: SandboxDockerConfig;
    workspaceDir: string;
    stat?: (workspaceDir: string) => Promise<{
        uid: number;
        gid: number;
    }>;
}): Promise<SandboxDockerConfig>;
export declare function resolveSandboxContext(params: {
    config?: OpenPawConfig;
    sessionKey?: string;
    workspaceDir?: string;
}): Promise<SandboxContext | null>;
export declare function ensureSandboxWorkspaceForSession(params: {
    config?: OpenPawConfig;
    sessionKey?: string;
    workspaceDir?: string;
}): Promise<SandboxWorkspaceInfo | null>;
