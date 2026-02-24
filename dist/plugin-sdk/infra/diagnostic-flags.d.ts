import type { OpenPawConfig } from "../config/config.js";
export declare function resolveDiagnosticFlags(cfg?: OpenPawConfig, env?: NodeJS.ProcessEnv): string[];
export declare function matchesDiagnosticFlag(flag: string, enabledFlags: string[]): boolean;
export declare function isDiagnosticFlagEnabled(flag: string, cfg?: OpenPawConfig, env?: NodeJS.ProcessEnv): boolean;
