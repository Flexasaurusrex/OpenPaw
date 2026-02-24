import "./agent-scope-DDpD-TG0.js";
import "./paths-C0uiCw4Q.js";
import { J as logVerbose, Z as shouldLogVerbose } from "./subsystem-8Ku6x7B-.js";
import "./model-selection-D5TmXO_y.js";
import "./github-copilot-token-DgMXYZEC.js";
import "./env-DiD38AJD.js";
import "./plugins-BCdTYJa7.js";
import "./accounts-CI8ArbYw.js";
import "./bindings-C1zGuRdD.js";
import "./accounts-DCa7fuTX.js";
import "./image-ops-B46KQegA.js";
import "./pi-model-discovery-j5tVLINv.js";
import "./message-channel-CU67zE1E.js";
import "./pi-embedded-helpers-CN7OlI9a.js";
import "./config-jCs8Cwk2.js";
import "./manifest-registry-BYYe4Adb.js";
import "./dock-CkJnBTJG.js";
import "./chrome-CBzcWJk_.js";
import "./ssrf-D_av5wos.js";
import "./skills-BxB35biB.js";
import "./redact-DuvewBuc.js";
import "./errors-BA3agtNw.js";
import "./store-9ma4HK4z.js";
import "./sessions-D8Bl20ZC.js";
import "./accounts-D6PlaDyj.js";
import "./paths-DuLEe_mf.js";
import "./tool-images-D2hZ3OHe.js";
import "./thinking-CLSwmd68.js";
import "./image-SXjW7H3g.js";
import "./gemini-auth-DCfYNd5y.js";
import "./fetch-guard-C6irlKf3.js";
import "./local-roots-S5nxWrcs.js";
import { a as resolveMediaAttachmentLocalRoots, n as createMediaAttachmentCache, o as runCapability, r as normalizeMediaAttachments, t as buildProviderRegistry, u as isAudioAttachment } from "./runner-C3Qxwr_n.js";

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