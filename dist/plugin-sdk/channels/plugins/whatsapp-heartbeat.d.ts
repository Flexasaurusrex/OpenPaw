import type { OpenPawConfig } from "../../config/config.js";
type HeartbeatRecipientsResult = {
    recipients: string[];
    source: string;
};
type HeartbeatRecipientsOpts = {
    to?: string;
    all?: boolean;
};
export declare function resolveWhatsAppHeartbeatRecipients(cfg: OpenPawConfig, opts?: HeartbeatRecipientsOpts): HeartbeatRecipientsResult;
export {};
