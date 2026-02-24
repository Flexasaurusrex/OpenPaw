import { r as resolveWhatsAppAccount } from "./accounts-CLTX_mkd.js";
import "./paths-CImrry1O.js";
import "./github-copilot-token-rXrmO5ay.js";
import "./plugins-DknbNP8B.js";
import "./subsystem-DAkun_KF.js";
import "./config-CwTZzzhp.js";
import "./command-format-B6MNxjoy.js";
import "./model-selection-CLx-pfYR.js";
import "./agent-scope-SDywqdsf.js";
import "./manifest-registry-BaIkXH2C.js";
import "./image-ops-DqsnXTrX.js";
import "./ssrf-DswcqIq6.js";
import "./fetch-guard-CmDEBxhd.js";
import "./local-roots-BtxMj3Uk.js";
import "./ir-CpxObGH9.js";
import "./chunk-C1U8ULYv.js";
import "./message-channel-5bXKHP9G.js";
import "./bindings-CVJAqq-x.js";
import "./markdown-tables-BwkJr4f4.js";
import "./render-C815sn1u.js";
import "./tables-RoCpQF8F.js";
import "./tool-images-BfeK-lGB.js";
import { a as createActionGate, c as jsonResult, d as readReactionParams, i as ToolAuthorizationError, m as readStringParam } from "./target-errors-DrdtDlG9.js";
import { t as resolveWhatsAppOutboundTarget } from "./resolve-outbound-target-k5PfJGGM.js";
import { r as sendReactionWhatsApp } from "./outbound-KiQvEeRt.js";

//#region src/agents/tools/whatsapp-target-auth.ts
function resolveAuthorizedWhatsAppOutboundTarget(params) {
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const resolution = resolveWhatsAppOutboundTarget({
		to: params.chatJid,
		allowFrom: account.allowFrom ?? [],
		mode: "implicit"
	});
	if (!resolution.ok) throw new ToolAuthorizationError(`WhatsApp ${params.actionLabel} blocked: chatJid "${params.chatJid}" is not in the configured allowFrom list for account "${account.accountId}".`);
	return {
		to: resolution.to,
		accountId: account.accountId
	};
}

//#endregion
//#region src/agents/tools/whatsapp-actions.ts
async function handleWhatsAppAction(params, cfg) {
	const action = readStringParam(params, "action", { required: true });
	const isActionEnabled = createActionGate(cfg.channels?.whatsapp?.actions);
	if (action === "react") {
		if (!isActionEnabled("reactions")) throw new Error("WhatsApp reactions are disabled.");
		const chatJid = readStringParam(params, "chatJid", { required: true });
		const messageId = readStringParam(params, "messageId", { required: true });
		const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove a WhatsApp reaction." });
		const participant = readStringParam(params, "participant");
		const accountId = readStringParam(params, "accountId");
		const fromMeRaw = params.fromMe;
		const fromMe = typeof fromMeRaw === "boolean" ? fromMeRaw : void 0;
		const resolved = resolveAuthorizedWhatsAppOutboundTarget({
			cfg,
			chatJid,
			accountId,
			actionLabel: "reaction"
		});
		const resolvedEmoji = remove ? "" : emoji;
		await sendReactionWhatsApp(resolved.to, messageId, resolvedEmoji, {
			verbose: false,
			fromMe,
			participant: participant ?? void 0,
			accountId: resolved.accountId
		});
		if (!remove && !isEmpty) return jsonResult({
			ok: true,
			added: emoji
		});
		return jsonResult({
			ok: true,
			removed: true
		});
	}
	throw new Error(`Unsupported WhatsApp action: ${action}`);
}

//#endregion
export { handleWhatsAppAction };