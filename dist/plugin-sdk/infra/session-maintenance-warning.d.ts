import type { OpenPawConfig } from "../config/config.js";
import type { SessionEntry, SessionMaintenanceWarning } from "../config/sessions.js";
type WarningParams = {
    cfg: OpenPawConfig;
    sessionKey: string;
    entry: SessionEntry;
    warning: SessionMaintenanceWarning;
};
export declare function deliverSessionMaintenanceWarning(params: WarningParams): Promise<void>;
export {};
