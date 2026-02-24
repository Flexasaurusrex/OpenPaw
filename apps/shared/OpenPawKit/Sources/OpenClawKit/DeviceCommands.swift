import Foundation

public enum OpenPawDeviceCommand: String, Codable, Sendable {
    case status = "device.status"
    case info = "device.info"
}

public enum OpenPawBatteryState: String, Codable, Sendable {
    case unknown
    case unplugged
    case charging
    case full
}

public enum OpenPawThermalState: String, Codable, Sendable {
    case nominal
    case fair
    case serious
    case critical
}

public enum OpenPawNetworkPathStatus: String, Codable, Sendable {
    case satisfied
    case unsatisfied
    case requiresConnection
}

public enum OpenPawNetworkInterfaceType: String, Codable, Sendable {
    case wifi
    case cellular
    case wired
    case other
}

public struct OpenPawBatteryStatusPayload: Codable, Sendable, Equatable {
    public var level: Double?
    public var state: OpenPawBatteryState
    public var lowPowerModeEnabled: Bool

    public init(level: Double?, state: OpenPawBatteryState, lowPowerModeEnabled: Bool) {
        self.level = level
        self.state = state
        self.lowPowerModeEnabled = lowPowerModeEnabled
    }
}

public struct OpenPawThermalStatusPayload: Codable, Sendable, Equatable {
    public var state: OpenPawThermalState

    public init(state: OpenPawThermalState) {
        self.state = state
    }
}

public struct OpenPawStorageStatusPayload: Codable, Sendable, Equatable {
    public var totalBytes: Int64
    public var freeBytes: Int64
    public var usedBytes: Int64

    public init(totalBytes: Int64, freeBytes: Int64, usedBytes: Int64) {
        self.totalBytes = totalBytes
        self.freeBytes = freeBytes
        self.usedBytes = usedBytes
    }
}

public struct OpenPawNetworkStatusPayload: Codable, Sendable, Equatable {
    public var status: OpenPawNetworkPathStatus
    public var isExpensive: Bool
    public var isConstrained: Bool
    public var interfaces: [OpenPawNetworkInterfaceType]

    public init(
        status: OpenPawNetworkPathStatus,
        isExpensive: Bool,
        isConstrained: Bool,
        interfaces: [OpenPawNetworkInterfaceType])
    {
        self.status = status
        self.isExpensive = isExpensive
        self.isConstrained = isConstrained
        self.interfaces = interfaces
    }
}

public struct OpenPawDeviceStatusPayload: Codable, Sendable, Equatable {
    public var battery: OpenPawBatteryStatusPayload
    public var thermal: OpenPawThermalStatusPayload
    public var storage: OpenPawStorageStatusPayload
    public var network: OpenPawNetworkStatusPayload
    public var uptimeSeconds: Double

    public init(
        battery: OpenPawBatteryStatusPayload,
        thermal: OpenPawThermalStatusPayload,
        storage: OpenPawStorageStatusPayload,
        network: OpenPawNetworkStatusPayload,
        uptimeSeconds: Double)
    {
        self.battery = battery
        self.thermal = thermal
        self.storage = storage
        self.network = network
        self.uptimeSeconds = uptimeSeconds
    }
}

public struct OpenPawDeviceInfoPayload: Codable, Sendable, Equatable {
    public var deviceName: String
    public var modelIdentifier: String
    public var systemName: String
    public var systemVersion: String
    public var appVersion: String
    public var appBuild: String
    public var locale: String

    public init(
        deviceName: String,
        modelIdentifier: String,
        systemName: String,
        systemVersion: String,
        appVersion: String,
        appBuild: String,
        locale: String)
    {
        self.deviceName = deviceName
        self.modelIdentifier = modelIdentifier
        self.systemName = systemName
        self.systemVersion = systemVersion
        self.appVersion = appVersion
        self.appBuild = appBuild
        self.locale = locale
    }
}
