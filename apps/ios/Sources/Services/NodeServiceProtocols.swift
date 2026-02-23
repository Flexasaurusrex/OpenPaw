import CoreLocation
import Foundation
import OpenPawKit
import UIKit

protocol CameraServicing: Sendable {
    func listDevices() async -> [CameraController.CameraDeviceInfo]
    func snap(params: OpenPawCameraSnapParams) async throws -> (format: String, base64: String, width: Int, height: Int)
    func clip(params: OpenPawCameraClipParams) async throws -> (format: String, base64: String, durationMs: Int, hasAudio: Bool)
}

protocol ScreenRecordingServicing: Sendable {
    func record(
        screenIndex: Int?,
        durationMs: Int?,
        fps: Double?,
        includeAudio: Bool?,
        outPath: String?) async throws -> String
}

@MainActor
protocol LocationServicing: Sendable {
    func authorizationStatus() -> CLAuthorizationStatus
    func accuracyAuthorization() -> CLAccuracyAuthorization
    func ensureAuthorization(mode: OpenPawLocationMode) async -> CLAuthorizationStatus
    func currentLocation(
        params: OpenPawLocationGetParams,
        desiredAccuracy: OpenPawLocationAccuracy,
        maxAgeMs: Int?,
        timeoutMs: Int?) async throws -> CLLocation
    func startLocationUpdates(
        desiredAccuracy: OpenPawLocationAccuracy,
        significantChangesOnly: Bool) -> AsyncStream<CLLocation>
    func stopLocationUpdates()
    func startMonitoringSignificantLocationChanges(onUpdate: @escaping @Sendable (CLLocation) -> Void)
    func stopMonitoringSignificantLocationChanges()
}

protocol DeviceStatusServicing: Sendable {
    func status() async throws -> OpenPawDeviceStatusPayload
    func info() -> OpenPawDeviceInfoPayload
}

protocol PhotosServicing: Sendable {
    func latest(params: OpenPawPhotosLatestParams) async throws -> OpenPawPhotosLatestPayload
}

protocol ContactsServicing: Sendable {
    func search(params: OpenPawContactsSearchParams) async throws -> OpenPawContactsSearchPayload
    func add(params: OpenPawContactsAddParams) async throws -> OpenPawContactsAddPayload
}

protocol CalendarServicing: Sendable {
    func events(params: OpenPawCalendarEventsParams) async throws -> OpenPawCalendarEventsPayload
    func add(params: OpenPawCalendarAddParams) async throws -> OpenPawCalendarAddPayload
}

protocol RemindersServicing: Sendable {
    func list(params: OpenPawRemindersListParams) async throws -> OpenPawRemindersListPayload
    func add(params: OpenPawRemindersAddParams) async throws -> OpenPawRemindersAddPayload
}

protocol MotionServicing: Sendable {
    func activities(params: OpenPawMotionActivityParams) async throws -> OpenPawMotionActivityPayload
    func pedometer(params: OpenPawPedometerParams) async throws -> OpenPawPedometerPayload
}

struct WatchMessagingStatus: Sendable, Equatable {
    var supported: Bool
    var paired: Bool
    var appInstalled: Bool
    var reachable: Bool
    var activationState: String
}

struct WatchQuickReplyEvent: Sendable, Equatable {
    var replyId: String
    var promptId: String
    var actionId: String
    var actionLabel: String?
    var sessionKey: String?
    var note: String?
    var sentAtMs: Int?
    var transport: String
}

struct WatchNotificationSendResult: Sendable, Equatable {
    var deliveredImmediately: Bool
    var queuedForDelivery: Bool
    var transport: String
}

protocol WatchMessagingServicing: AnyObject, Sendable {
    func status() async -> WatchMessagingStatus
    func setReplyHandler(_ handler: (@Sendable (WatchQuickReplyEvent) -> Void)?)
    func sendNotification(
        id: String,
        params: OpenPawWatchNotifyParams) async throws -> WatchNotificationSendResult
}

extension CameraController: CameraServicing {}
extension ScreenRecordService: ScreenRecordingServicing {}
extension LocationService: LocationServicing {}
