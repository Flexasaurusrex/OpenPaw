import type { OpenPawConfig } from "../config/config.js";
import { type ReactionLevel, type ResolvedReactionLevel } from "../utils/reaction-level.js";
export type SignalReactionLevel = ReactionLevel;
export type ResolvedSignalReactionLevel = ResolvedReactionLevel;
/**
 * Resolve the effective reaction level and its implications for Signal.
 *
 * Levels:
 * - "off": No reactions at all
 * - "ack": Only automatic ack reactions (👀 when processing), no agent reactions
 * - "minimal": Agent can react, but sparingly (default)
 * - "extensive": Agent can react liberally
 */
export declare function resolveSignalReactionLevel(params: {
    cfg: OpenPawConfig;
    accountId?: string;
}): ResolvedSignalReactionLevel;
