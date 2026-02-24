import { s as resolveAgentWorkspaceDir } from "../../agent-scope-9aJRv6zx.js";
import { s as resolveStateDir } from "../../paths-Dn-gE1l8.js";
import { t as createSubsystemLogger } from "../../subsystem-DWLvTobT.js";
import { l as resolveAgentIdFromSessionKey } from "../../session-key-BlAu1iW4.js";
import "../../workspace-DlPWdeFR.js";
import "../../tokens-yEU5Gbs4.js";
import "../../pi-embedded-BPwZgOoT.js";
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
import { O as hasInterSessionUserProvenance } from "../../sessions-QcEz4fnW.js";
import "../../accounts-B1UGR7vk.js";
import "../../paths-u5mmLSVx.js";
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
import { generateSlugViaLLM } from "../../llm-slug-generator.js";
import { t as resolveHookConfig } from "../../config-DoFSfMif.js";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

//#region src/hooks/bundled/session-memory/handler.ts
/**
* Session memory hook handler
*
* Saves session context to memory when /new or /reset command is triggered
* Creates a new dated memory file with LLM-generated slug
*/
const log = createSubsystemLogger("hooks/session-memory");
/**
* Read recent messages from session file for slug generation
*/
async function getRecentSessionContent(sessionFilePath, messageCount = 15) {
	try {
		const lines = (await fs.readFile(sessionFilePath, "utf-8")).trim().split("\n");
		const allMessages = [];
		for (const line of lines) try {
			const entry = JSON.parse(line);
			if (entry.type === "message" && entry.message) {
				const msg = entry.message;
				const role = msg.role;
				if ((role === "user" || role === "assistant") && msg.content) {
					if (role === "user" && hasInterSessionUserProvenance(msg)) continue;
					const text = Array.isArray(msg.content) ? msg.content.find((c) => c.type === "text")?.text : msg.content;
					if (text && !text.startsWith("/")) allMessages.push(`${role}: ${text}`);
				}
			}
		} catch {}
		return allMessages.slice(-messageCount).join("\n");
	} catch {
		return null;
	}
}
/**
* Try the active transcript first; if /new already rotated it,
* fallback to the latest .jsonl.reset.* sibling.
*/
async function getRecentSessionContentWithResetFallback(sessionFilePath, messageCount = 15) {
	const primary = await getRecentSessionContent(sessionFilePath, messageCount);
	if (primary) return primary;
	try {
		const dir = path.dirname(sessionFilePath);
		const resetPrefix = `${path.basename(sessionFilePath)}.reset.`;
		const resetCandidates = (await fs.readdir(dir)).filter((name) => name.startsWith(resetPrefix)).toSorted();
		if (resetCandidates.length === 0) return primary;
		const latestResetPath = path.join(dir, resetCandidates[resetCandidates.length - 1]);
		const fallback = await getRecentSessionContent(latestResetPath, messageCount);
		if (fallback) log.debug("Loaded session content from reset fallback", {
			sessionFilePath,
			latestResetPath
		});
		return fallback || primary;
	} catch {
		return primary;
	}
}
function stripResetSuffix(fileName) {
	const resetIndex = fileName.indexOf(".reset.");
	return resetIndex === -1 ? fileName : fileName.slice(0, resetIndex);
}
async function findPreviousSessionFile(params) {
	try {
		const files = await fs.readdir(params.sessionsDir);
		const fileSet = new Set(files);
		const baseFromReset = params.currentSessionFile ? stripResetSuffix(path.basename(params.currentSessionFile)) : void 0;
		if (baseFromReset && fileSet.has(baseFromReset)) return path.join(params.sessionsDir, baseFromReset);
		const trimmedSessionId = params.sessionId?.trim();
		if (trimmedSessionId) {
			const canonicalFile = `${trimmedSessionId}.jsonl`;
			if (fileSet.has(canonicalFile)) return path.join(params.sessionsDir, canonicalFile);
			const topicVariants = files.filter((name) => name.startsWith(`${trimmedSessionId}-topic-`) && name.endsWith(".jsonl") && !name.includes(".reset.")).toSorted().toReversed();
			if (topicVariants.length > 0) return path.join(params.sessionsDir, topicVariants[0]);
		}
		if (!params.currentSessionFile) return;
		const nonResetJsonl = files.filter((name) => name.endsWith(".jsonl") && !name.includes(".reset.")).toSorted().toReversed();
		if (nonResetJsonl.length > 0) return path.join(params.sessionsDir, nonResetJsonl[0]);
	} catch {}
}
/**
* Save session context to memory when /new or /reset command is triggered
*/
const saveSessionToMemory = async (event) => {
	const isResetCommand = event.action === "new" || event.action === "reset";
	if (event.type !== "command" || !isResetCommand) return;
	try {
		log.debug("Hook triggered for reset/new command", { action: event.action });
		const context = event.context || {};
		const cfg = context.cfg;
		const agentId = resolveAgentIdFromSessionKey(event.sessionKey);
		const workspaceDir = cfg ? resolveAgentWorkspaceDir(cfg, agentId) : path.join(resolveStateDir(process.env, os.homedir), "workspace");
		const memoryDir = path.join(workspaceDir, "memory");
		await fs.mkdir(memoryDir, { recursive: true });
		const now = new Date(event.timestamp);
		const dateStr = now.toISOString().split("T")[0];
		const sessionEntry = context.previousSessionEntry || context.sessionEntry || {};
		const currentSessionId = sessionEntry.sessionId;
		let currentSessionFile = sessionEntry.sessionFile || void 0;
		if (!currentSessionFile || currentSessionFile.includes(".reset.")) {
			const sessionsDirs = /* @__PURE__ */ new Set();
			if (currentSessionFile) sessionsDirs.add(path.dirname(currentSessionFile));
			sessionsDirs.add(path.join(workspaceDir, "sessions"));
			for (const sessionsDir of sessionsDirs) {
				const recoveredSessionFile = await findPreviousSessionFile({
					sessionsDir,
					currentSessionFile,
					sessionId: currentSessionId
				});
				if (!recoveredSessionFile) continue;
				currentSessionFile = recoveredSessionFile;
				log.debug("Found previous session file", { file: currentSessionFile });
				break;
			}
		}
		log.debug("Session context resolved", {
			sessionId: currentSessionId,
			sessionFile: currentSessionFile,
			hasCfg: Boolean(cfg)
		});
		const sessionFile = currentSessionFile || void 0;
		const hookConfig = resolveHookConfig(cfg, "session-memory");
		const messageCount = typeof hookConfig?.messages === "number" && hookConfig.messages > 0 ? hookConfig.messages : 15;
		let slug = null;
		let sessionContent = null;
		if (sessionFile) {
			sessionContent = await getRecentSessionContentWithResetFallback(sessionFile, messageCount);
			log.debug("Session content loaded", {
				length: sessionContent?.length ?? 0,
				messageCount
			});
			const allowLlmSlug = !(process.env.OPENPAW_TEST_FAST === "1" || process.env.VITEST === "true" || process.env.VITEST === "1" || false) && hookConfig?.llmSlug !== false;
			if (sessionContent && cfg && allowLlmSlug) {
				log.debug("Calling generateSlugViaLLM...");
				slug = await generateSlugViaLLM({
					sessionContent,
					cfg
				});
				log.debug("Generated slug", { slug });
			}
		}
		if (!slug) {
			slug = now.toISOString().split("T")[1].split(".")[0].replace(/:/g, "").slice(0, 4);
			log.debug("Using fallback timestamp slug", { slug });
		}
		const filename = `${dateStr}-${slug}.md`;
		const memoryFilePath = path.join(memoryDir, filename);
		log.debug("Memory file path resolved", {
			filename,
			path: memoryFilePath.replace(os.homedir(), "~")
		});
		const timeStr = now.toISOString().split("T")[1].split(".")[0];
		const sessionId = sessionEntry.sessionId || "unknown";
		const source = context.commandSource || "unknown";
		const entryParts = [
			`# Session: ${dateStr} ${timeStr} UTC`,
			"",
			`- **Session Key**: ${event.sessionKey}`,
			`- **Session ID**: ${sessionId}`,
			`- **Source**: ${source}`,
			""
		];
		if (sessionContent) entryParts.push("## Conversation Summary", "", sessionContent, "");
		const entry = entryParts.join("\n");
		await fs.writeFile(memoryFilePath, entry, "utf-8");
		log.debug("Memory file written successfully");
		const relPath = memoryFilePath.replace(os.homedir(), "~");
		log.info(`Session context saved to ${relPath}`);
	} catch (err) {
		if (err instanceof Error) log.error("Failed to save session memory", {
			errorName: err.name,
			errorMessage: err.message,
			stack: err.stack
		});
		else log.error("Failed to save session memory", { error: String(err) });
	}
};

//#endregion
export { saveSessionToMemory as default };