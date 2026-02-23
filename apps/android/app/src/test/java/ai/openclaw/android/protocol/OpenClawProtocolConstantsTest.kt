package ai.openpaw.android.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class OpenPawProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", OpenPawCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", OpenPawCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", OpenPawCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", OpenPawCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", OpenPawCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", OpenPawCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", OpenPawCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", OpenPawCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", OpenPawCapability.Canvas.rawValue)
    assertEquals("camera", OpenPawCapability.Camera.rawValue)
    assertEquals("screen", OpenPawCapability.Screen.rawValue)
    assertEquals("voiceWake", OpenPawCapability.VoiceWake.rawValue)
  }

  @Test
  fun screenCommandsUseStableStrings() {
    assertEquals("screen.record", OpenPawScreenCommand.Record.rawValue)
  }
}
