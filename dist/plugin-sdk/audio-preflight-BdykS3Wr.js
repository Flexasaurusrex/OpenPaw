import "./accounts-CLTX_mkd.js";
import "./paths-CImrry1O.js";
import "./github-copilot-token-rXrmO5ay.js";
import "./plugins-DknbNP8B.js";
import { Z as logVerbose, et as shouldLogVerbose } from "./subsystem-DAkun_KF.js";
import "./config-CwTZzzhp.js";
import "./command-format-B6MNxjoy.js";
import "./model-selection-CLx-pfYR.js";
import "./agent-scope-SDywqdsf.js";
import "./manifest-registry-BaIkXH2C.js";
import "./dock-CfgoVEq8.js";
import "./redact-CXLx_Xor.js";
import "./errors-CF5PYiCs.js";
import "./image-ops-DqsnXTrX.js";
import "./ssrf-DswcqIq6.js";
import "./fetch-guard-CmDEBxhd.js";
import "./local-roots-BtxMj3Uk.js";
import "./message-channel-5bXKHP9G.js";
import "./bindings-CVJAqq-x.js";
import "./tool-images-BfeK-lGB.js";
import { a as resolveMediaAttachmentLocalRoots, n as createMediaAttachmentCache, o as runCapability, r as normalizeMediaAttachments, t as buildProviderRegistry, u as isAudioAttachment } from "./runner-BNDah7-o.js";
import "./skills-B1gBsTEr.js";
import "./chrome-CktdRxit.js";
import "./accounts-C5ms2k4z.js";
import "./accounts-Dp_YSBFW.js";
import "./sessions-DQptu9BX.js";
import "./paths-pMWC5YrF.js";
import "./store-GwxxCTxg.js";
import "./pi-embedded-helpers-CPGFtadK.js";
import "./thinking-DFs8hJTB.js";
import "./image-B3AVIWiA.js";
import "./pi-model-discovery-CLdAHc9I.js";
import "./api-key-rotation-Bi2QlmEB.js";

//#region src/media-understanding/audio-preflight.ts
/**
* Transcribes the first audio attachment BEFORE mention checking.
* This allows voice notes to be processed in group chats with requireMention: true.
* Returns the transcript or undefined if transcription fails or no audio is found.
*/
async function transcribeFirstAudio(params) {
	const { ctx, cfg } = params;
	const audioConfig = cfg.tools?.media?.audio;
	if (!audioConfig || audioConfig.enabled === false) return;
	const attachments = normalizeMediaAttachments(ctx);
	if (!attachments || attachments.length === 0) return;
	const firstAudio = attachments.find((att) => att && isAudioAttachment(att) && !att.alreadyTranscribed);
	if (!firstAudio) return;
	if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribing attachment ${firstAudio.index} for mention check`);
	const providerRegistry = buildProviderRegistry(params.providers);
	const cache = createMediaAttachmentCache(attachments, { localPathRoots: resolveMediaAttachmentLocalRoots({
		cfg,
		ctx
	}) });
	try {
		const result = await runCapability({
			capability: "audio",
			cfg,
			ctx,
			attachments: cache,
			media: attachments,
			agentDir: params.agentDir,
			providerRegistry,
			config: audioConfig,
			activeModel: params.activeModel
		});
		if (!result || result.outputs.length === 0) return;
		const audioOutput = result.outputs.find((output) => output.kind === "audio.transcription");
		if (!audioOutput || !audioOutput.text) return;
		firstAudio.alreadyTranscribed = true;
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribed ${audioOutput.text.length} chars from attachment ${firstAudio.index}`);
		return audioOutput.text;
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcription failed: ${String(err)}`);
		return;
	} finally {
		await cache.cleanup();
	}
}

//#endregion
export { transcribeFirstAudio };