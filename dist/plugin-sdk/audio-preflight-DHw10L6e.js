import "./accounts-CDfuhPF9.js";
import "./paths-CImrry1O.js";
import "./github-copilot-token-rXrmO5ay.js";
import "./plugins-FzvJaCEt.js";
import { Z as logVerbose, et as shouldLogVerbose } from "./subsystem-ClBbMbTX.js";
import "./config-CHEq4Abk.js";
import "./command-format-D2Cctd5h.js";
import "./model-selection-CCe5uWRJ.js";
import "./agent-scope-CvD9EBI7.js";
import "./manifest-registry-CR0scqab.js";
import "./dock-B1dxnzcR.js";
import "./redact-Dbi15qWB.js";
import "./errors-DBPj4TD8.js";
import "./image-ops-BrbVKM5f.js";
import "./ssrf-DswcqIq6.js";
import "./fetch-guard-HTNZ5_-9.js";
import "./local-roots-B4efmqzH.js";
import "./message-channel-D0N-TpaW.js";
import "./bindings-ETxywlHC.js";
import "./tool-images-BY77wqMn.js";
import { a as resolveMediaAttachmentLocalRoots, n as createMediaAttachmentCache, o as runCapability, r as normalizeMediaAttachments, t as buildProviderRegistry, u as isAudioAttachment } from "./runner-D_Sb10Z8.js";
import "./skills-B-OtTxpA.js";
import "./chrome-BjvadydC.js";
import "./accounts-D8zZWTRD.js";
import "./accounts-B_-fZaIs.js";
import "./sessions-Dxbm56T1.js";
import "./paths-pMWC5YrF.js";
import "./store-DPo6CKL5.js";
import "./pi-embedded-helpers-B_QAI8GS.js";
import "./thinking-DFs8hJTB.js";
import "./image-B7Pp2ZXp.js";
import "./pi-model-discovery-CLdAHc9I.js";
import "./api-key-rotation-C_YHAV2y.js";

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