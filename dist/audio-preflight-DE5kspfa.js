import "./paths-5liSMgvV.js";
import { F as shouldLogVerbose, M as logVerbose } from "./utils-CLEQvfyB.js";
import "./thinking-EAliFiVK.js";
import "./agent-scope-DVw9WyO3.js";
import "./subsystem-BlU6Lg5x.js";
import "./exec-DkdDR1S0.js";
import "./model-selection-DBzxxd2t.js";
import "./github-copilot-token-V7Dgsl4R.js";
import "./boolean-BgXe2hyu.js";
import "./env-BuaPy6k5.js";
import "./host-env-security-ljCLeQmh.js";
import "./message-channel-DlEv3rvX.js";
import "./config-BrzzL48f.js";
import "./version-CmTNPgEd.js";
import "./env-vars-CsJ4chkK.js";
import "./manifest-registry-fNuKu-JQ.js";
import "./dock-NIaOR0r_.js";
import { a as resolveMediaAttachmentLocalRoots, n as createMediaAttachmentCache, o as runCapability, r as normalizeMediaAttachments, s as isAudioAttachment, t as buildProviderRegistry } from "./runner-BepI0jrs.js";
import "./image-Dpr4p2rZ.js";
import "./models-config-DtMqhpqZ.js";
import "./pi-model-discovery-Cojifu4Y.js";
import "./pi-embedded-helpers-9kEzinGy.js";
import "./sandbox-Bdjajo-M.js";
import "./chrome-CzcXboc0.js";
import "./tailscale-DNuh1EXL.js";
import "./ip-9Ji2ZKmK.js";
import "./tailnet-CfnDL3PT.js";
import "./ws-DI10x-Zu.js";
import "./auth-DiCh-IhS.js";
import "./server-context-Ce1QVTUf.js";
import "./frontmatter-BAu7PLcH.js";
import "./skills-h9Q-iHsk.js";
import "./routes-BFRza1-g.js";
import "./redact-iq6ANRhF.js";
import "./errors-DZpIsD32.js";
import "./fs-safe-D51abJr5.js";
import "./paths-DX8xqj9_.js";
import "./ssrf-CVJYDLbF.js";
import "./image-ops-_-mEyFJ8.js";
import "./store-DpFOKrgj.js";
import "./ports-7zKdGljn.js";
import "./trash-BJUTSBxB.js";
import "./sessions-CJHPvDu8.js";
import "./plugins-PixIvqwD.js";
import "./accounts-DQouuDyL.js";
import "./accounts-Cx7B1Aw-.js";
import "./accounts-B5K1ARxi.js";
import "./bindings-vqxtcSdy.js";
import "./logging-6RmrnEvA.js";
import "./paths-UwFQANoB.js";
import "./chat-envelope-Ddj7Occv.js";
import "./tool-images-B_Tq_5hY.js";
import "./tool-display-VQ2UFB5v.js";
import "./fetch-guard-DLYr9x03.js";
import "./api-key-rotation-CmIvZBIM.js";
import "./local-roots-CusIIHJX.js";
import "./model-catalog-D-1a_g1w.js";

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