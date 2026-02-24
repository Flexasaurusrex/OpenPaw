export declare function resolveRelayAuthTokenForPort(port: number): string;
export declare function probeAuthenticatedOpenPawRelay(params: {
    baseUrl: string;
    relayAuthHeader: string;
    relayAuthToken: string;
    timeoutMs?: number;
}): Promise<boolean>;
