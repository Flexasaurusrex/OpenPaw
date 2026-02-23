package ai.openpaw.android.node

import android.os.Build
import ai.openpaw.android.BuildConfig
import ai.openpaw.android.SecurePrefs
import ai.openpaw.android.gateway.GatewayClientInfo
import ai.openpaw.android.gateway.GatewayConnectOptions
import ai.openpaw.android.gateway.GatewayEndpoint
import ai.openpaw.android.gateway.GatewayTlsParams
import ai.openpaw.android.protocol.OpenPawCanvasA2UICommand
import ai.openpaw.android.protocol.OpenPawCanvasCommand
import ai.openpaw.android.protocol.OpenPawCameraCommand
import ai.openpaw.android.protocol.OpenPawLocationCommand
import ai.openpaw.android.protocol.OpenPawScreenCommand
import ai.openpaw.android.protocol.OpenPawSmsCommand
import ai.openpaw.android.protocol.OpenPawCapability
import ai.openpaw.android.LocationMode
import ai.openpaw.android.VoiceWakeMode

class ConnectionManager(
  private val prefs: SecurePrefs,
  private val cameraEnabled: () -> Boolean,
  private val locationMode: () -> LocationMode,
  private val voiceWakeMode: () -> VoiceWakeMode,
  private val smsAvailable: () -> Boolean,
  private val hasRecordAudioPermission: () -> Boolean,
  private val manualTls: () -> Boolean,
) {
  companion object {
    internal fun resolveTlsParamsForEndpoint(
      endpoint: GatewayEndpoint,
      storedFingerprint: String?,
      manualTlsEnabled: Boolean,
    ): GatewayTlsParams? {
      val stableId = endpoint.stableId
      val stored = storedFingerprint?.trim().takeIf { !it.isNullOrEmpty() }
      val isManual = stableId.startsWith("manual|")

      if (isManual) {
        if (!manualTlsEnabled) return null
        if (!stored.isNullOrBlank()) {
          return GatewayTlsParams(
            required = true,
            expectedFingerprint = stored,
            allowTOFU = false,
            stableId = stableId,
          )
        }
        return GatewayTlsParams(
          required = true,
          expectedFingerprint = null,
          allowTOFU = false,
          stableId = stableId,
        )
      }

      // Prefer stored pins. Never let discovery-provided TXT override a stored fingerprint.
      if (!stored.isNullOrBlank()) {
        return GatewayTlsParams(
          required = true,
          expectedFingerprint = stored,
          allowTOFU = false,
          stableId = stableId,
        )
      }

      val hinted = endpoint.tlsEnabled || !endpoint.tlsFingerprintSha256.isNullOrBlank()
      if (hinted) {
        // TXT is unauthenticated. Do not treat the advertised fingerprint as authoritative.
        return GatewayTlsParams(
          required = true,
          expectedFingerprint = null,
          allowTOFU = false,
          stableId = stableId,
        )
      }

      return null
    }
  }

  fun buildInvokeCommands(): List<String> =
    buildList {
      add(OpenPawCanvasCommand.Present.rawValue)
      add(OpenPawCanvasCommand.Hide.rawValue)
      add(OpenPawCanvasCommand.Navigate.rawValue)
      add(OpenPawCanvasCommand.Eval.rawValue)
      add(OpenPawCanvasCommand.Snapshot.rawValue)
      add(OpenPawCanvasA2UICommand.Push.rawValue)
      add(OpenPawCanvasA2UICommand.PushJSONL.rawValue)
      add(OpenPawCanvasA2UICommand.Reset.rawValue)
      add(OpenPawScreenCommand.Record.rawValue)
      if (cameraEnabled()) {
        add(OpenPawCameraCommand.Snap.rawValue)
        add(OpenPawCameraCommand.Clip.rawValue)
      }
      if (locationMode() != LocationMode.Off) {
        add(OpenPawLocationCommand.Get.rawValue)
      }
      if (smsAvailable()) {
        add(OpenPawSmsCommand.Send.rawValue)
      }
      if (BuildConfig.DEBUG) {
        add("debug.logs")
        add("debug.ed25519")
      }
      add("app.update")
    }

  fun buildCapabilities(): List<String> =
    buildList {
      add(OpenPawCapability.Canvas.rawValue)
      add(OpenPawCapability.Screen.rawValue)
      if (cameraEnabled()) add(OpenPawCapability.Camera.rawValue)
      if (smsAvailable()) add(OpenPawCapability.Sms.rawValue)
      if (voiceWakeMode() != VoiceWakeMode.Off && hasRecordAudioPermission()) {
        add(OpenPawCapability.VoiceWake.rawValue)
      }
      if (locationMode() != LocationMode.Off) {
        add(OpenPawCapability.Location.rawValue)
      }
    }

  fun resolvedVersionName(): String {
    val versionName = BuildConfig.VERSION_NAME.trim().ifEmpty { "dev" }
    return if (BuildConfig.DEBUG && !versionName.contains("dev", ignoreCase = true)) {
      "$versionName-dev"
    } else {
      versionName
    }
  }

  fun resolveModelIdentifier(): String? {
    return listOfNotNull(Build.MANUFACTURER, Build.MODEL)
      .joinToString(" ")
      .trim()
      .ifEmpty { null }
  }

  fun buildUserAgent(): String {
    val version = resolvedVersionName()
    val release = Build.VERSION.RELEASE?.trim().orEmpty()
    val releaseLabel = if (release.isEmpty()) "unknown" else release
    return "OpenPawAndroid/$version (Android $releaseLabel; SDK ${Build.VERSION.SDK_INT})"
  }

  fun buildClientInfo(clientId: String, clientMode: String): GatewayClientInfo {
    return GatewayClientInfo(
      id = clientId,
      displayName = prefs.displayName.value,
      version = resolvedVersionName(),
      platform = "android",
      mode = clientMode,
      instanceId = prefs.instanceId.value,
      deviceFamily = "Android",
      modelIdentifier = resolveModelIdentifier(),
    )
  }

  fun buildNodeConnectOptions(): GatewayConnectOptions {
    return GatewayConnectOptions(
      role = "node",
      scopes = emptyList(),
      caps = buildCapabilities(),
      commands = buildInvokeCommands(),
      permissions = emptyMap(),
      client = buildClientInfo(clientId = "openpaw-android", clientMode = "node"),
      userAgent = buildUserAgent(),
    )
  }

  fun buildOperatorConnectOptions(): GatewayConnectOptions {
    return GatewayConnectOptions(
      role = "operator",
      scopes = listOf("operator.read", "operator.write", "operator.talk.secrets"),
      caps = emptyList(),
      commands = emptyList(),
      permissions = emptyMap(),
      client = buildClientInfo(clientId = "openpaw-control-ui", clientMode = "ui"),
      userAgent = buildUserAgent(),
    )
  }

  fun resolveTlsParams(endpoint: GatewayEndpoint): GatewayTlsParams? {
    val stored = prefs.loadGatewayTlsFingerprint(endpoint.stableId)
    return resolveTlsParamsForEndpoint(endpoint, storedFingerprint = stored, manualTlsEnabled = manualTls())
  }
}
