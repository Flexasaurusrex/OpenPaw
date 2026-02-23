package ai.openpaw.android.node

import ai.openpaw.android.gateway.GatewaySession
import ai.openpaw.android.protocol.OpenPawCanvasA2UICommand
import ai.openpaw.android.protocol.OpenPawCanvasCommand
import ai.openpaw.android.protocol.OpenPawCameraCommand
import ai.openpaw.android.protocol.OpenPawLocationCommand
import ai.openpaw.android.protocol.OpenPawScreenCommand
import ai.openpaw.android.protocol.OpenPawSmsCommand

class InvokeDispatcher(
  private val canvas: CanvasController,
  private val cameraHandler: CameraHandler,
  private val locationHandler: LocationHandler,
  private val screenHandler: ScreenHandler,
  private val smsHandler: SmsHandler,
  private val a2uiHandler: A2UIHandler,
  private val debugHandler: DebugHandler,
  private val appUpdateHandler: AppUpdateHandler,
  private val isForeground: () -> Boolean,
  private val cameraEnabled: () -> Boolean,
  private val locationEnabled: () -> Boolean,
) {
  suspend fun handleInvoke(command: String, paramsJson: String?): GatewaySession.InvokeResult {
    // Check foreground requirement for canvas/camera/screen commands
    if (
      command.startsWith(OpenPawCanvasCommand.NamespacePrefix) ||
        command.startsWith(OpenPawCanvasA2UICommand.NamespacePrefix) ||
        command.startsWith(OpenPawCameraCommand.NamespacePrefix) ||
        command.startsWith(OpenPawScreenCommand.NamespacePrefix)
    ) {
      if (!isForeground()) {
        return GatewaySession.InvokeResult.error(
          code = "NODE_BACKGROUND_UNAVAILABLE",
          message = "NODE_BACKGROUND_UNAVAILABLE: canvas/camera/screen commands require foreground",
        )
      }
    }

    // Check camera enabled
    if (command.startsWith(OpenPawCameraCommand.NamespacePrefix) && !cameraEnabled()) {
      return GatewaySession.InvokeResult.error(
        code = "CAMERA_DISABLED",
        message = "CAMERA_DISABLED: enable Camera in Settings",
      )
    }

    // Check location enabled
    if (command.startsWith(OpenPawLocationCommand.NamespacePrefix) && !locationEnabled()) {
      return GatewaySession.InvokeResult.error(
        code = "LOCATION_DISABLED",
        message = "LOCATION_DISABLED: enable Location in Settings",
      )
    }

    return when (command) {
      // Canvas commands
      OpenPawCanvasCommand.Present.rawValue -> {
        val url = CanvasController.parseNavigateUrl(paramsJson)
        canvas.navigate(url)
        GatewaySession.InvokeResult.ok(null)
      }
      OpenPawCanvasCommand.Hide.rawValue -> GatewaySession.InvokeResult.ok(null)
      OpenPawCanvasCommand.Navigate.rawValue -> {
        val url = CanvasController.parseNavigateUrl(paramsJson)
        canvas.navigate(url)
        GatewaySession.InvokeResult.ok(null)
      }
      OpenPawCanvasCommand.Eval.rawValue -> {
        val js =
          CanvasController.parseEvalJs(paramsJson)
            ?: return GatewaySession.InvokeResult.error(
              code = "INVALID_REQUEST",
              message = "INVALID_REQUEST: javaScript required",
            )
        val result =
          try {
            canvas.eval(js)
          } catch (err: Throwable) {
            return GatewaySession.InvokeResult.error(
              code = "NODE_BACKGROUND_UNAVAILABLE",
              message = "NODE_BACKGROUND_UNAVAILABLE: canvas unavailable",
            )
          }
        GatewaySession.InvokeResult.ok("""{"result":${result.toJsonString()}}""")
      }
      OpenPawCanvasCommand.Snapshot.rawValue -> {
        val snapshotParams = CanvasController.parseSnapshotParams(paramsJson)
        val base64 =
          try {
            canvas.snapshotBase64(
              format = snapshotParams.format,
              quality = snapshotParams.quality,
              maxWidth = snapshotParams.maxWidth,
            )
          } catch (err: Throwable) {
            return GatewaySession.InvokeResult.error(
              code = "NODE_BACKGROUND_UNAVAILABLE",
              message = "NODE_BACKGROUND_UNAVAILABLE: canvas unavailable",
            )
          }
        GatewaySession.InvokeResult.ok("""{"format":"${snapshotParams.format.rawValue}","base64":"$base64"}""")
      }

      // A2UI commands
      OpenPawCanvasA2UICommand.Reset.rawValue -> {
        val a2uiUrl = a2uiHandler.resolveA2uiHostUrl()
          ?: return GatewaySession.InvokeResult.error(
            code = "A2UI_HOST_NOT_CONFIGURED",
            message = "A2UI_HOST_NOT_CONFIGURED: gateway did not advertise canvas host",
          )
        val ready = a2uiHandler.ensureA2uiReady(a2uiUrl)
        if (!ready) {
          return GatewaySession.InvokeResult.error(
            code = "A2UI_HOST_UNAVAILABLE",
            message = "A2UI host not reachable",
          )
        }
        val res = canvas.eval(A2UIHandler.a2uiResetJS)
        GatewaySession.InvokeResult.ok(res)
      }
      OpenPawCanvasA2UICommand.Push.rawValue, OpenPawCanvasA2UICommand.PushJSONL.rawValue -> {
        val messages =
          try {
            a2uiHandler.decodeA2uiMessages(command, paramsJson)
          } catch (err: Throwable) {
            return GatewaySession.InvokeResult.error(
              code = "INVALID_REQUEST",
              message = err.message ?: "invalid A2UI payload"
            )
          }
        val a2uiUrl = a2uiHandler.resolveA2uiHostUrl()
          ?: return GatewaySession.InvokeResult.error(
            code = "A2UI_HOST_NOT_CONFIGURED",
            message = "A2UI_HOST_NOT_CONFIGURED: gateway did not advertise canvas host",
          )
        val ready = a2uiHandler.ensureA2uiReady(a2uiUrl)
        if (!ready) {
          return GatewaySession.InvokeResult.error(
            code = "A2UI_HOST_UNAVAILABLE",
            message = "A2UI host not reachable",
          )
        }
        val js = A2UIHandler.a2uiApplyMessagesJS(messages)
        val res = canvas.eval(js)
        GatewaySession.InvokeResult.ok(res)
      }

      // Camera commands
      OpenPawCameraCommand.Snap.rawValue -> cameraHandler.handleSnap(paramsJson)
      OpenPawCameraCommand.Clip.rawValue -> cameraHandler.handleClip(paramsJson)

      // Location command
      OpenPawLocationCommand.Get.rawValue -> locationHandler.handleLocationGet(paramsJson)

      // Screen command
      OpenPawScreenCommand.Record.rawValue -> screenHandler.handleScreenRecord(paramsJson)

      // SMS command
      OpenPawSmsCommand.Send.rawValue -> smsHandler.handleSmsSend(paramsJson)

      // Debug commands
      "debug.ed25519" -> debugHandler.handleEd25519()
      "debug.logs" -> debugHandler.handleLogs()

      // App update
      "app.update" -> appUpdateHandler.handleUpdate(paramsJson)

      else ->
        GatewaySession.InvokeResult.error(
          code = "INVALID_REQUEST",
          message = "INVALID_REQUEST: unknown command",
        )
    }
  }
}
