import type { ExecAsk, ExecSecurity } from "../infra/exec-approvals.js";
export type RequestExecApprovalDecisionParams = {
    id: string;
    command: string;
    cwd: string;
    host: "gateway" | "node";
    security: ExecSecurity;
    ask: ExecAsk;
    agentId?: string;
    resolvedPath?: string;
    sessionKey?: string;
};
export declare function requestExecApprovalDecision(params: RequestExecApprovalDecisionParams): Promise<string | null>;
export declare function requestExecApprovalDecisionForHost(params: {
    approvalId: string;
    command: string;
    workdir: string;
    host: "gateway" | "node";
    security: ExecSecurity;
    ask: ExecAsk;
    agentId?: string;
    resolvedPath?: string;
    sessionKey?: string;
}): Promise<string | null>;
