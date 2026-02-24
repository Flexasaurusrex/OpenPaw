import { r as resolveWhatsAppAccount } from "./accounts-CDfuhPF9.js";
import "./paths-CImrry1O.js";
import "./github-copilot-token-rXrmO5ay.js";
import "./plugins-FzvJaCEt.js";
import "./subsystem-ClBbMbTX.js";
import "./config-CHEq4Abk.js";
import "./command-format-D2Cctd5h.js";
import "./model-selection-CCe5uWRJ.js";
import "./agent-scope-CvD9EBI7.js";
import "./manifest-registry-CR0scqab.js";
import "./image-ops-BrbVKM5f.js";
import "./ssrf-DswcqIq6.js";
import "./fetch-guard-HTNZ5_-9.js";
import "./local-roots-B4efmqzH.js";
import "./ir-BNupWiQd.js";
import "./chunk-wIZRPHkl.js";
import "./message-channel-D0N-TpaW.js";
import "./bindings-ETxywlHC.js";
import "./markdown-tables-C7XQTt0F.js";
import "./render-C815sn1u.js";
import "./tables-2WLr1LF1.js";
import "./tool-images-BY77wqMn.js";
import { a as createActionGate, c as jsonResult, d as readReactionParams, i as ToolAuthorizationError, m as readStringParam } from "./target-errors-BEdUhLA2.js";
import { t as resolveWhatsAppOutboundTarget } from "./resolve-outbound-target-Yyjchfzx.js";
import { r as sendReactionWhatsApp } from "./outbound-CjOgZvI1.js";

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