import Foundation

public enum OpenPawCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum OpenPawCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum OpenPawCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum OpenPawCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct OpenPawCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: OpenPawCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: OpenPawCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: OpenPawCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: OpenPawCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct OpenPawCameraClipParams: Codable, Sendable, Equatable {
    public var facing: OpenPawCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: OpenPawCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: OpenPawCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: OpenPawCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
