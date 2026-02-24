import type { OpenPawConfig } from "../config/config.js";
import type { AgentBinding } from "../config/types.agents.js";
export declare function listBindings(cfg: OpenPawConfig): AgentBinding[];
export declare function listBoundAccountIds(cfg: OpenPawConfig, channelId: string): string[];
export declare function resolveDefaultAgentBoundAccountId(cfg: OpenPawConfig, channelId: string): string | null;
export declare function buildChannelAccountBindings(cfg: OpenPawConfig): Map<string, Map<string, string[]>>;
export declare function resolvePreferredAccountId(params: {
    accountIds: string[];
    defaultAccountId: string;
    boundAccounts: string[];
}): string;
