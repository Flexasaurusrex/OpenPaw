import Foundation

public enum OpenPawChatTransportEvent: Sendable {
    case health(ok: Bool)
    case tick
    case chat(OpenPawChatEventPayload)
    case agent(OpenPawAgentEventPayload)
    case seqGap
}

public protocol OpenPawChatTransport: Sendable {
    func requestHistory(sessionKey: String) async throws -> OpenPawChatHistoryPayload
    func sendMessage(
        sessionKey: String,
        message: String,
        thinking: String,
        idempotencyKey: String,
        attachments: [OpenPawChatAttachmentPayload]) async throws -> OpenPawChatSendResponse

    func abortRun(sessionKey: String, runId: String) async throws
    func listSessions(limit: Int?) async throws -> OpenPawChatSessionsListResponse

    func requestHealth(timeoutMs: Int) async throws -> Bool
    func events() -> AsyncStream<OpenPawChatTransportEvent>

    func setActiveSessionKey(_ sessionKey: String) async throws
}

extension OpenPawChatTransport {
    public func setActiveSessionKey(_: String) async throws {}

    public func abortRun(sessionKey _: String, runId _: String) async throws {
        throw NSError(
            domain: "OpenPawChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "chat.abort not supported by this transport"])
    }

    public func listSessions(limit _: Int?) async throws -> OpenPawChatSessionsListResponse {
        throw NSError(
            domain: "OpenPawChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.list not supported by this transport"])
    }
}
