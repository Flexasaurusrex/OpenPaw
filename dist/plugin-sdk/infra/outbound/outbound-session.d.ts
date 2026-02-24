import type { ChannelId } from "../../channels/plugins/types.js";
import type { OpenPawConfig } from "../../config/config.js";
import { type RoutePeer } from "../../routing/resolve-route.js";
import type { ResolvedMessagingTarget } from "./target-resolver.js";
export type OutboundSessionRoute = {
    sessionKey: string;
    baseSessionKey: string;
    peer: RoutePeer;
    chatType: "direct" | "group" | "channel";
    from: string;
    to: string;
    threadId?: string | number;
};
export type ResolveOutboundSessionRouteParams = {
    cfg: OpenPawConfig;
    channel: ChannelId;
    agentId: string;
    accountId?: string | null;
    target: string;
    resolvedTarget?: ResolvedMessagingTarget;
    replyToId?: string | null;
    threadId?: string | number | null;
};
export declare function resolveOutboundSessionRoute(params: ResolveOutboundSessionRouteParams): Promise<OutboundSessionRoute | null>;
export declare function ensureOutboundSessionEntry(params: {
    cfg: OpenPawConfig;
    agentId: string;
    channel: ChannelId;
    accountId?: string | null;
    route: OutboundSessionRoute;
}): Promise<void>;
