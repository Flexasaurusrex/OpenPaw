import "./agent-scope-CG5fO1-r.js";
import "./paths-C12iiEez.js";
import { J as logVerbose, Z as shouldLogVerbose } from "./subsystem-CrsB6DNT.js";
import "./workspace--8oeKjX4.js";
import "./plugins-DwqwF2qw.js";
import "./accounts-dft0V9Uu.js";
import "./boolean-mcn6kL0s.js";
import "./command-format-Dx1u_Gfy.js";
import "./bindings-DoXgMV1D.js";
import "./accounts-BjjTAs8-.js";
import "./image-ops-BBKt0mGX.js";
import "./model-auth-BcCFChCF.js";
import "./github-copilot-token-DXAbooML.js";
import "./pi-model-discovery-DaNAekda.js";
import "./message-channel-Cr0GWHFV.js";
import "./pi-embedded-helpers-DZjci1Yp.js";
import "./config-Bd-EiYyt.js";
import "./manifest-registry-B6UU1GUE.js";
import "./dock-DVwyPNAw.js";
import "./chrome-ClGKc2pN.js";
import "./ssrf-DoQDLHSj.js";
import "./frontmatter-8p6DrJoj.js";
import "./skills-DkMbD3-N.js";
import "./redact-CFZiIiPD.js";
import "./errors-BBKyS253.js";
import "./store-BfLyCygV.js";
import "./sessions-D5_9lCKT.js";
import "./accounts-ReBX1Fas.js";
import "./paths-DIPqyS4l.js";
import "./tool-images-Dfy0KR_O.js";
import "./thinking-Ds6fxj9u.js";
import "./image--q1yQfhs.js";
import "./gemini-auth-CmIr6IJd.js";
import "./fetch-guard-wffrbAvN.js";
import "./local-roots-zBApnRPv.js";
import { a as resolveMediaAttachmentLocalRoots, n as createMediaAttachmentCache, o as runCapability, r as normalizeMediaAttachments, t as buildProviderRegistry, u as isAudioAttachment } from "./runner-BvBJoKT6.js";

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