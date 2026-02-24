import type { OpenPawConfig } from "./types.js";
/**
 * Nix mode detection: When OPENPAW_NIX_MODE=1, the gateway is running under Nix.
 * In this mode:
 * - No auto-install flows should be attempted
 * - Missing dependencies should produce actionable Nix-specific error messages
 * - Config is managed externally (read-only from Nix perspective)
 */
export declare function resolveIsNixMode(env?: NodeJS.ProcessEnv): boolean;
export declare const isNixMode: boolean;
export declare function resolveLegacyStateDir(homedir?: () => string): string;
export declare function resolveLegacyStateDirs(homedir?: () => string): string[];
export declare function resolveNewStateDir(homedir?: () => string): string;
/**
 * State directory for mutable data (sessions, logs, caches).
 * Can be overridden via OPENPAW_STATE_DIR.
 * Default: ~/.openpaw
 */
export declare function resolveStateDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
export declare const STATE_DIR: string;
/**
 * Config file path (JSON5).
 * Can be overridden via OPENPAW_CONFIG_PATH.
 * Default: ~/.openpaw/openpaw.json (or $OPENPAW_STATE_DIR/openpaw.json)
 */
export declare function resolveCanonicalConfigPath(env?: NodeJS.ProcessEnv, stateDir?: string): string;
/**
 * Resolve the active config path by preferring existing config candidates
 * before falling back to the canonical path.
 */
export declare function resolveConfigPathCandidate(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/**
 * Active config path (prefers existing config files).
 */
export declare function resolveConfigPath(env?: NodeJS.ProcessEnv, stateDir?: string, homedir?: () => string): string;
export declare const CONFIG_PATH: string;
/**
 * Resolve default config path candidates across default locations.
 * Order: explicit config path → state-dir-derived paths → new default.
 */
export declare function resolveDefaultConfigCandidates(env?: NodeJS.ProcessEnv, homedir?: () => string): string[];
export declare const DEFAULT_GATEWAY_PORT = 18789;
/**
 * Gateway lock directory (ephemeral).
 * Default: os.tmpdir()/openpaw-<uid> (uid suffix when available).
 */
export declare function resolveGatewayLockDir(tmpdir?: () => string): string;
/**
 * OAuth credentials storage directory.
 *
 * Precedence:
 * - `OPENPAW_OAUTH_DIR` (explicit override)
 * - `$*_STATE_DIR/credentials` (canonical server/default)
 */
export declare function resolveOAuthDir(env?: NodeJS.ProcessEnv, stateDir?: string): string;
export declare function resolveOAuthPath(env?: NodeJS.ProcessEnv, stateDir?: string): string;
export declare function resolveGatewayPort(cfg?: OpenPawConfig, env?: NodeJS.ProcessEnv): number;
