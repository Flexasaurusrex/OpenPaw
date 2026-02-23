import Foundation

// Stable identifier used for both the macOS LaunchAgent label and Nix-managed defaults suite.
// nix-openpaw writes app defaults into this suite to survive app bundle identifier churn.
let launchdLabel = "ai.openpaw.mac"
let gatewayLaunchdLabel = "ai.openpaw.gateway"
let onboardingVersionKey = "openpaw.onboardingVersion"
let onboardingSeenKey = "openpaw.onboardingSeen"
let currentOnboardingVersion = 7
let pauseDefaultsKey = "openpaw.pauseEnabled"
let iconAnimationsEnabledKey = "openpaw.iconAnimationsEnabled"
let swabbleEnabledKey = "openpaw.swabbleEnabled"
let swabbleTriggersKey = "openpaw.swabbleTriggers"
let voiceWakeTriggerChimeKey = "openpaw.voiceWakeTriggerChime"
let voiceWakeSendChimeKey = "openpaw.voiceWakeSendChime"
let showDockIconKey = "openpaw.showDockIcon"
let defaultVoiceWakeTriggers = ["openpaw"]
let voiceWakeMaxWords = 32
let voiceWakeMaxWordLength = 64
let voiceWakeMicKey = "openpaw.voiceWakeMicID"
let voiceWakeMicNameKey = "openpaw.voiceWakeMicName"
let voiceWakeLocaleKey = "openpaw.voiceWakeLocaleID"
let voiceWakeAdditionalLocalesKey = "openpaw.voiceWakeAdditionalLocaleIDs"
let voicePushToTalkEnabledKey = "openpaw.voicePushToTalkEnabled"
let talkEnabledKey = "openpaw.talkEnabled"
let iconOverrideKey = "openpaw.iconOverride"
let connectionModeKey = "openpaw.connectionMode"
let remoteTargetKey = "openpaw.remoteTarget"
let remoteIdentityKey = "openpaw.remoteIdentity"
let remoteProjectRootKey = "openpaw.remoteProjectRoot"
let remoteCliPathKey = "openpaw.remoteCliPath"
let canvasEnabledKey = "openpaw.canvasEnabled"
let cameraEnabledKey = "openpaw.cameraEnabled"
let systemRunPolicyKey = "openpaw.systemRunPolicy"
let systemRunAllowlistKey = "openpaw.systemRunAllowlist"
let systemRunEnabledKey = "openpaw.systemRunEnabled"
let locationModeKey = "openpaw.locationMode"
let locationPreciseKey = "openpaw.locationPreciseEnabled"
let peekabooBridgeEnabledKey = "openpaw.peekabooBridgeEnabled"
let deepLinkKeyKey = "openpaw.deepLinkKey"
let modelCatalogPathKey = "openpaw.modelCatalogPath"
let modelCatalogReloadKey = "openpaw.modelCatalogReload"
let cliInstallPromptedVersionKey = "openpaw.cliInstallPromptedVersion"
let heartbeatsEnabledKey = "openpaw.heartbeatsEnabled"
let debugPaneEnabledKey = "openpaw.debugPaneEnabled"
let debugFileLogEnabledKey = "openpaw.debug.fileLogEnabled"
let appLogLevelKey = "openpaw.debug.appLogLevel"
let voiceWakeSupported: Bool = ProcessInfo.processInfo.operatingSystemVersion.majorVersion >= 26
