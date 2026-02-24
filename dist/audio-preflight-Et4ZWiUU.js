import { St as shouldLogVerbose, yt as logVerbose } from "./entry.js";
import "./auth-profiles-Cob1PkNk.js";
import "./agent-scope-Ch2id45o.js";
import "./exec-G9-WTRVN.js";
import "./github-copilot-token-RNgXBxZS.js";
import "./host-env-security-DyQuUnEd.js";
import "./pi-model-discovery-CwESh4K1.js";
import "./frontmatter-C-mnS1Ag.js";
import "./skills-DhLwpMz_.js";
import "./manifest-registry-DqqQzpz1.js";
import "./config-DUiZpzJa.js";
import "./version-C26Rk39r.js";
import "./env-vars-DiCRNmoj.js";
import "./dock-CIQZSu0X.js";
import "./message-channel-C8ZvZtXL.js";
import "./net-BVkY67bp.js";
import "./ip-BkPdUc6e.js";
import "./tailnet-CBDDP2ef.js";
import "./sessions-BOuQLul1.js";
import "./plugins-BOsODpl9.js";
import "./accounts-ZciIdins.js";
import "./bindings-CqMiIKM5.js";
import "./logging-CGlH1P7F.js";
import "./accounts-CxmFIdzG.js";
import "./image-ops-CD21cBoz.js";
import "./pi-embedded-helpers-CyGCtlTK.js";
import "./sandbox-C5ZzCurI.js";
import "./chrome-DMq6k23s.js";
import "./tailscale-QhdHV80-.js";
import "./auth-LAV7Qr_D.js";
import "./server-context-B0eZP7Jh.js";
import "./routes-bx_VxR0p.js";
import "./redact-8ygXzN2c.js";
import "./errors-CAg9uklP.js";
import "./fs-safe-VAZ-b1a1.js";
import "./paths-DZnnOi0n.js";
import "./ssrf-B0PMs-Z1.js";
import "./store-8cGa4yTM.js";
import "./ports-Dpij79Ry.js";
import "./trash-BKArGMlZ.js";
import "./accounts-JARp6uPy.js";
import "./paths-DXBvtSww.js";
import "./chat-envelope-GDr4Ob9e.js";
import "./tool-images-BQAFJ-TV.js";
import "./thinking-BF74hBT8.js";
import "./models-config-Cn7PNzaI.js";
import "./gemini-auth-ClarSsef.js";
import "./fetch-guard-s1EvTHMo.js";
import "./local-roots-DAZSahJ7.js";
import "./image-C9blTh14.js";
import "./tool-display-qnmuGsrD.js";
import { a as resolveMediaAttachmentLocalRoots, n as createMediaAttachmentCache, o as runCapability, r as normalizeMediaAttachments, s as isAudioAttachment, t as buildProviderRegistry } from "./runner-Dm3eq7Ry.js";
import "./model-catalog-ZJIgO4tD.js";

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