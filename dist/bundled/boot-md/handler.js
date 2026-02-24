import { s as resolveAgentWorkspaceDir, t as listAgentIds } from "../../agent-scope-9aJRv6zx.js";
import "../../paths-Dn-gE1l8.js";
import { dt as isGatewayStartupEvent, r as defaultRuntime, t as createSubsystemLogger } from "../../subsystem-DWLvTobT.js";
import { l as resolveAgentIdFromSessionKey } from "../../session-key-BlAu1iW4.js";
import "../../workspace-DlPWdeFR.js";
import { n as SILENT_REPLY_TOKEN } from "../../tokens-yEU5Gbs4.js";
import { a as createDefaultDeps, i as agentCommand } from "../../pi-embedded-BPwZgOoT.js";
import "../../plugins-C8pEMavJ.js";
import "../../accounts-y13sZPpa.js";
import "../../boolean-mcn6kL0s.js";
import "../../command-format-x8oDHspF.js";
import "../../bindings-Co9zZjgY.js";
import "../../send-oIG8unax.js";
import "../../send-CEHcC0l0.js";
import "../../deliver-MBsjM--N.js";
import "../../diagnostic-giJtqvB3.js";
import "../../diagnostic-session-state-Bxo4UHOL.js";
import "../../accounts-BsJZbQ_H.js";
import "../../send-LLyChnjK.js";
import "../../image-ops-B-YON1BR.js";
import "../../model-auth-CqKxd6-7.js";
import "../../github-copilot-token-BffWg1BA.js";
import "../../pi-model-discovery-DaNAekda.js";
import "../../message-channel-c6NXxHsV.js";
import "../../pi-embedded-helpers-dFheFgcJ.js";
import "../../config-CMJyaS_f.js";
import "../../manifest-registry-Bp6yP7WJ.js";
import "../../dock-JwW3M4-s.js";
import "../../chrome-D2KsnIcg.js";
import "../../ssrf-DoQDLHSj.js";
import "../../frontmatter-Bm1Lr5Td.js";
import "../../skills-F6NLZVdD.js";
import "../../redact-B_SY0qn8.js";
import "../../errors-DS1LEZcU.js";
import "../../store-BHaeIGMJ.js";
import { V as resolveMainSessionKey, d as updateSessionStore, s as loadSessionStore, z as resolveAgentMainSessionKey } from "../../sessions-QcEz4fnW.js";
import "../../accounts-B1UGR7vk.js";
import { l as resolveStorePath } from "../../paths-u5mmLSVx.js";
import "../../tool-images-Dp92NXAm.js";
import "../../thinking-Ds6fxj9u.js";
import "../../image-DxsqHe5T.js";
import "../../reply-prefix-B-p3hX-F.js";
import "../../manager-B5Fs7575.js";
import "../../gemini-auth-nBaq0Wti.js";
import "../../fetch-guard-C0-RjmYc.js";
import "../../query-expansion-Bpr68972.js";
import "../../retry-CdyU265B.js";
import "../../target-errors-CcE5hV_t.js";
import "../../chunk-D5hrLenJ.js";
import "../../markdown-tables-Dg4AJ9gZ.js";
import "../../local-roots-nWQl2qU_.js";
import "../../ir-Bc9ujYJU.js";
import "../../render-D7U4wOLO.js";
import "../../commands-registry-BGzAJWag.js";
import "../../skill-commands-DucUaWQ_.js";
import "../../runner-DdwQooHN.js";
import "../../fetch-BOb9Gd5j.js";
import "../../channel-activity-Dbjc4Mfp.js";
import "../../tables-8c-FW5BC.js";
import "../../send-Bj4hnAdD.js";
import "../../outbound-attachment-UhKnCMMB.js";
import "../../send-d83KJbb_.js";
import "../../resolve-route-Nxst_J6b.js";
import "../../proxy-DTBHP1Tj.js";
import "../../replies-CEKtashQ.js";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

//#region src/gateway/boot.ts
function generateBootSessionId() {
	return `boot-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").replace("T", "_").replace("Z", "")}-${crypto.randomUUID().slice(0, 8)}`;
}
const log$1 = createSubsystemLogger("gateway/boot");
const BOOT_FILENAME = "BOOT.md";
function buildBootPrompt(content) {
	return [
		"You are running a boot check. Follow BOOT.md instructions exactly.",
		"",
		"BOOT.md:",
		content,
		"",
		"If BOOT.md asks you to send a message, use the message tool (action=send with channel + target).",
		"Use the `target` field (not `to`) for message tool destinations.",
		`After sending with the message tool, reply with ONLY: ${SILENT_REPLY_TOKEN}.`,
		`If nothing needs attention, reply with ONLY: ${SILENT_REPLY_TOKEN}.`
	].join("\n");
}
async function loadBootFile(workspaceDir) {
	const bootPath = path.join(workspaceDir, BOOT_FILENAME);
	try {
		const trimmed = (await fs.readFile(bootPath, "utf-8")).trim();
		if (!trimmed) return { status: "empty" };
		return {
			status: "ok",
			content: trimmed
		};
	} catch (err) {
		if (err.code === "ENOENT") return { status: "missing" };
		throw err;
	}
}
function snapshotMainSessionMapping(params) {
	const agentId = resolveAgentIdFromSessionKey(params.sessionKey);
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId });
	try {
		const entry = loadSessionStore(storePath, { skipCache: true })[params.sessionKey];
		if (!entry) return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: true,
			hadEntry: false
		};
		return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: true,
			hadEntry: true,
			entry: structuredClone(entry)
		};
	} catch (err) {
		log$1.debug("boot: could not snapshot main session mapping", {
			sessionKey: params.sessionKey,
			error: String(err)
		});
		return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: false,
			hadEntry: false
		};
	}
}
async function restoreMainSessionMapping(snapshot) {
	if (!snapshot.canRestore) return;
	try {
		await updateSessionStore(snapshot.storePath, (store) => {
			if (snapshot.hadEntry && snapshot.entry) {
				store[snapshot.sessionKey] = snapshot.entry;
				return;
			}
			delete store[snapshot.sessionKey];
		}, { activeSessionKey: snapshot.sessionKey });
		return;
	} catch (err) {
		return err instanceof Error ? err.message : String(err);
	}
}
async function runBootOnce(params) {
	const bootRuntime = {
		log: () => {},
		error: (message) => log$1.error(String(message)),
		exit: defaultRuntime.exit
	};
	let result;
	try {
		result = await loadBootFile(params.workspaceDir);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		log$1.error(`boot: failed to read ${BOOT_FILENAME}: ${message}`);
		return {
			status: "failed",
			reason: message
		};
	}
	if (result.status === "missing" || result.status === "empty") return {
		status: "skipped",
		reason: result.status
	};
	const sessionKey = params.agentId ? resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	}) : resolveMainSessionKey(params.cfg);
	const message = buildBootPrompt(result.content ?? "");
	const sessionId = generateBootSessionId();
	const mappingSnapshot = snapshotMainSessionMapping({
		cfg: params.cfg,
		sessionKey
	});
	let agentFailure;
	try {
		await agentCommand({
			message,
			sessionKey,
			sessionId,
			deliver: false
		}, bootRuntime, params.deps);
	} catch (err) {
		agentFailure = err instanceof Error ? err.message : String(err);
		log$1.error(`boot: agent run failed: ${agentFailure}`);
	}
	const mappingRestoreFailure = await restoreMainSessionMapping(mappingSnapshot);
	if (mappingRestoreFailure) log$1.error(`boot: failed to restore main session mapping: ${mappingRestoreFailure}`);
	if (!agentFailure && !mappingRestoreFailure) return { status: "ran" };
	return {
		status: "failed",
		reason: [agentFailure ? `agent run failed: ${agentFailure}` : void 0, mappingRestoreFailure ? `mapping restore failed: ${mappingRestoreFailure}` : void 0].filter((part) => Boolean(part)).join("; ")
	};
}

//#endregion
//#region src/hooks/bundled/boot-md/handler.ts
const log = createSubsystemLogger("hooks/boot-md");
const runBootChecklist = async (event) => {
	if (!isGatewayStartupEvent(event)) return;
	if (!event.context.cfg) return;
	const cfg = event.context.cfg;
	const deps = event.context.deps ?? createDefaultDeps();
	const agentIds = listAgentIds(cfg);
	for (const agentId of agentIds) {
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
		const result = await runBootOnce({
			cfg,
			deps,
			workspaceDir,
			agentId
		});
		if (result.status === "failed") {
			log.warn("boot-md failed for agent startup run", {
				agentId,
				workspaceDir,
				reason: result.reason
			});
			continue;
		}
		if (result.status === "skipped") log.debug("boot-md skipped for agent startup run", {
			agentId,
			workspaceDir,
			reason: result.reason
		});
	}
};

//#endregion
export { runBootChecklist as default };