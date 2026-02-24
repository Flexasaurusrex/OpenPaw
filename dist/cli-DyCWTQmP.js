import "./paths-5liSMgvV.js";
import "./utils-CLEQvfyB.js";
import "./thinking-EAliFiVK.js";
import { vt as loadOpenPawPlugins } from "./reply-D_97LfkS.js";
import { l as resolveAgentWorkspaceDir, u as resolveDefaultAgentId } from "./agent-scope-DVw9WyO3.js";
import { t as createSubsystemLogger } from "./subsystem-BlU6Lg5x.js";
import "./exec-DkdDR1S0.js";
import "./model-selection-DLFgSmxJ.js";
import "./github-copilot-token-V7Dgsl4R.js";
import "./boolean-BgXe2hyu.js";
import "./env-BuaPy6k5.js";
import "./host-env-security-ljCLeQmh.js";
import "./message-channel-DlEv3rvX.js";
import "./send-Du6jbKSv.js";
import { i as loadConfig } from "./config-D2VtfSUL.js";
import "./version-CmTNPgEd.js";
import "./env-vars-CsJ4chkK.js";
import "./manifest-registry-fNuKu-JQ.js";
import "./dock-NIaOR0r_.js";
import "./runner-BzccovDw.js";
import "./image-D5VAtNen.js";
import "./models-config-Dg8Kg5A3.js";
import "./pi-model-discovery-Cojifu4Y.js";
import "./pi-embedded-helpers-DHAZhpow.js";
import "./sandbox-DfsyhnGI.js";
import "./chrome-DXqMQMj3.js";
import "./tailscale-DNuh1EXL.js";
import "./ip-9Ji2ZKmK.js";
import "./tailnet-CfnDL3PT.js";
import "./ws-DI10x-Zu.js";
import "./auth-DiCh-IhS.js";
import "./server-context-BR7ehuf9.js";
import "./frontmatter-BAu7PLcH.js";
import "./skills-h9Q-iHsk.js";
import "./routes-VSXeSaZa.js";
import "./redact-iq6ANRhF.js";
import "./errors-DZpIsD32.js";
import "./fs-safe-D51abJr5.js";
import "./paths-DX8xqj9_.js";
import "./ssrf-CVJYDLbF.js";
import "./image-ops-_-mEyFJ8.js";
import "./store-DpFOKrgj.js";
import "./ports-7zKdGljn.js";
import "./trash-BJUTSBxB.js";
import "./sessions-DrdLhqGQ.js";
import "./plugins-PixIvqwD.js";
import "./accounts-DQouuDyL.js";
import "./accounts-Cx7B1Aw-.js";
import "./accounts-B5K1ARxi.js";
import "./bindings-vqxtcSdy.js";
import "./logging-6RmrnEvA.js";
import "./send-BEQ3oqqE.js";
import "./paths-UwFQANoB.js";
import "./chat-envelope-Ddj7Occv.js";
import "./tool-images-B_Tq_5hY.js";
import "./tool-display-VQ2UFB5v.js";
import "./fetch-guard-DLYr9x03.js";
import "./api-key-rotation-C16BVrM_.js";
import "./local-roots-CusIIHJX.js";
import "./query-expansion-C0LYSFr9.js";
import "./model-catalog-WZgV-OzI.js";
import "./tokens-BrGcAwbN.js";
import "./with-timeout-RhNtpWzv.js";
import "./deliver-CSiAkuBe.js";
import "./diagnostic-C_SZ1pLI.js";
import "./diagnostic-session-state-7Ra8u_hY.js";
import "./send-CetZTMYA.js";
import "./model-B7b19Zdf.js";
import "./exec-approvals-allowlist-CQ7RBeKg.js";
import "./exec-safe-bin-runtime-policy-DmL2Ftfy.js";
import "./reply-prefix-CVpztiHa.js";
import "./memory-cli-BB0oE2Bs.js";
import "./manager-DoMFtXnm.js";
import "./retry-KmKuGYic.js";
import "./target-errors-C15DNWSd.js";
import "./chunk-BeOk4Mlg.js";
import "./markdown-tables-DN7WeB5D.js";
import "./ir-CxO3rFZw.js";
import "./render-B5HNUbes.js";
import "./commands-C3u9scYW.js";
import "./commands-registry-Dz5ewNx0.js";
import "./client-8n3vPrA3.js";
import "./call-qMGOPQLT.js";
import "./pairing-token-B9zvy9za.js";
import "./channel-activity-CDstTtTV.js";
import "./fetch-CKDDJfTQ.js";
import "./tables-DsZuOznP.js";
import "./send-BElGnN4_.js";
import "./pairing-store-D0c4lp-G.js";
import "./proxy-CQzIYU6S.js";
import "./links-Om7vMhDC.js";
import "./cli-utils-CbnnSB38.js";
import "./help-format-DuuK66_B.js";
import "./progress-BrNyn1gy.js";
import "./resolve-route--lvzGpSg.js";
import "./replies-BFV8pnah.js";
import "./skill-commands-DI91yLbB.js";
import "./workspace-dirs-BJv6AR0c.js";
import "./channel-selection-Dzp_BlPL.js";
import "./outbound-attachment-BhlVneoD.js";
import "./delivery-queue-Bn-CSv8D.js";
import "./session-cost-usage-kJ4UzyLC.js";
import "./send-99JS0_Oq.js";
import "./onboard-helpers-C5liWlpx.js";
import "./prompt-style-DE_Wto62.js";
import "./pairing-labels-Csw5PbO8.js";
import "./exec-approvals-FygPo23-.js";
import "./nodes-screen-BsqoKcbB.js";
import "./control-service-CkbOW8Cr.js";
import "./stagger-CPIlBwxt.js";
import "./pi-tools.policy-DG37Js1B.js";

//#region src/plugins/cli.ts
const log = createSubsystemLogger("plugins");
function registerPluginCliCommands(program, cfg) {
	const config = cfg ?? loadConfig();
	const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
	const logger = {
		info: (msg) => log.info(msg),
		warn: (msg) => log.warn(msg),
		error: (msg) => log.error(msg),
		debug: (msg) => log.debug(msg)
	};
	const registry = loadOpenPawPlugins({
		config,
		workspaceDir,
		logger
	});
	const existingCommands = new Set(program.commands.map((cmd) => cmd.name()));
	for (const entry of registry.cliRegistrars) {
		if (entry.commands.length > 0) {
			const overlaps = entry.commands.filter((command) => existingCommands.has(command));
			if (overlaps.length > 0) {
				log.debug(`plugin CLI register skipped (${entry.pluginId}): command already registered (${overlaps.join(", ")})`);
				continue;
			}
		}
		try {
			const result = entry.register({
				program,
				config,
				workspaceDir,
				logger
			});
			if (result && typeof result.then === "function") result.catch((err) => {
				log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
			});
			for (const command of entry.commands) existingCommands.add(command);
		} catch (err) {
			log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
		}
	}
}

//#endregion
export { registerPluginCliCommands };