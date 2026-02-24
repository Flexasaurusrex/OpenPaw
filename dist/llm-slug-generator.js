import { c as resolveDefaultAgentId, r as resolveAgentDir, s as resolveAgentWorkspaceDir } from "./agent-scope-9aJRv6zx.js";
import "./paths-Dn-gE1l8.js";
import { t as createSubsystemLogger } from "./subsystem-DWLvTobT.js";
import "./workspace-DlPWdeFR.js";
import "./tokens-yEU5Gbs4.js";
import { t as runEmbeddedPiAgent } from "./pi-embedded-CgWHNN3K.js";
import "./plugins-C8pEMavJ.js";
import "./accounts-y13sZPpa.js";
import "./boolean-mcn6kL0s.js";
import "./command-format-x8oDHspF.js";
import "./bindings-Co9zZjgY.js";
import "./send-Dwt9aF8j.js";
import "./send-B8CZ_Odz.js";
import "./deliver-BvLjM0I6.js";
import "./diagnostic-giJtqvB3.js";
import "./diagnostic-session-state-Bxo4UHOL.js";
import "./accounts-BsJZbQ_H.js";
import "./send-C8-n42fM.js";
import "./image-ops-B-YON1BR.js";
import "./model-auth-HfI5mzXM.js";
import "./github-copilot-token-BffWg1BA.js";
import "./pi-model-discovery-DaNAekda.js";
import "./message-channel-c6NXxHsV.js";
import "./pi-embedded-helpers-DewQtT5s.js";
import "./config-CMa41IiH.js";
import "./manifest-registry-Bp6yP7WJ.js";
import "./dock-JwW3M4-s.js";
import "./chrome-CYz0Uu7N.js";
import "./ssrf-DoQDLHSj.js";
import "./frontmatter-Bm1Lr5Td.js";
import "./skills-CoyY6qOv.js";
import "./redact-B_SY0qn8.js";
import "./errors-DS1LEZcU.js";
import "./store-BHaeIGMJ.js";
import "./sessions-CIs786H3.js";
import "./accounts-B1UGR7vk.js";
import "./paths-u5mmLSVx.js";
import "./tool-images-Dp92NXAm.js";
import "./thinking-Ds6fxj9u.js";
import "./image-CAwtq_8T.js";
import "./reply-prefix-B-p3hX-F.js";
import "./manager-D0SEyNxk.js";
import "./gemini-auth-73sdiQ0s.js";
import "./fetch-guard-C0-RjmYc.js";
import "./query-expansion-Bpr68972.js";
import "./retry-CdyU265B.js";
import "./target-errors-CcE5hV_t.js";
import "./chunk-D5hrLenJ.js";
import "./markdown-tables-Dg4AJ9gZ.js";
import "./local-roots-nWQl2qU_.js";
import "./ir-Bc9ujYJU.js";
import "./render-D7U4wOLO.js";
import "./commands-registry-D2TppQr0.js";
import "./skill-commands-BkUkatkW.js";
import "./runner-B35DpG6r.js";
import "./fetch-BOb9Gd5j.js";
import "./channel-activity-Dbjc4Mfp.js";
import "./tables-8c-FW5BC.js";
import "./send-DmIQr_E9.js";
import "./outbound-attachment-UhKnCMMB.js";
import "./send-nC-6cmLw.js";
import "./resolve-route-Nxst_J6b.js";
import "./proxy-DTBHP1Tj.js";
import "./replies-DFvBkwh_.js";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

//#region src/hooks/llm-slug-generator.ts
/**
* LLM-based slug generator for session memory filenames
*/
const log = createSubsystemLogger("llm-slug-generator");
/**
* Generate a short 1-2 word filename slug from session content using LLM
*/
async function generateSlugViaLLM(params) {
	let tempSessionFile = null;
	try {
		const agentId = resolveDefaultAgentId(params.cfg);
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
		const agentDir = resolveAgentDir(params.cfg, agentId);
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openpaw-slug-"));
		tempSessionFile = path.join(tempDir, "session.jsonl");
		const prompt = `Based on this conversation, generate a short 1-2 word filename slug (lowercase, hyphen-separated, no file extension).

Conversation summary:
${params.sessionContent.slice(0, 2e3)}

Reply with ONLY the slug, nothing else. Examples: "vendor-pitch", "api-design", "bug-fix"`;
		const result = await runEmbeddedPiAgent({
			sessionId: `slug-generator-${Date.now()}`,
			sessionKey: "temp:slug-generator",
			agentId,
			sessionFile: tempSessionFile,
			workspaceDir,
			agentDir,
			config: params.cfg,
			prompt,
			timeoutMs: 15e3,
			runId: `slug-gen-${Date.now()}`
		});
		if (result.payloads && result.payloads.length > 0) {
			const text = result.payloads[0]?.text;
			if (text) return text.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || null;
		}
		return null;
	} catch (err) {
		const message = err instanceof Error ? err.stack ?? err.message : String(err);
		log.error(`Failed to generate slug: ${message}`);
		return null;
	} finally {
		if (tempSessionFile) try {
			await fs.rm(path.dirname(tempSessionFile), {
				recursive: true,
				force: true
			});
		} catch {}
	}
}

//#endregion
export { generateSlugViaLLM };