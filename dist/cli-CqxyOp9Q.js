import "./paths-5liSMgvV.js";
import "./utils-CLEQvfyB.js";
import "./thinking-EAliFiVK.js";
import { vt as loadOpenPawPlugins } from "./reply-C7c1Otq4.js";
import { l as resolveAgentWorkspaceDir, u as resolveDefaultAgentId } from "./agent-scope-DVw9WyO3.js";
import { t as createSubsystemLogger } from "./subsystem-BlU6Lg5x.js";
import "./exec-DkdDR1S0.js";
import "./model-selection-DBzxxd2t.js";
import "./github-copilot-token-V7Dgsl4R.js";
import "./boolean-BgXe2hyu.js";
import "./env-BuaPy6k5.js";
import "./host-env-security-ljCLeQmh.js";
import "./message-channel-DlEv3rvX.js";
import "./send-B41Wg3CC.js";
import { i as loadConfig } from "./config-BrzzL48f.js";
import "./version-CmTNPgEd.js";
import "./env-vars-CsJ4chkK.js";
import "./manifest-registry-fNuKu-JQ.js";
import "./dock-NIaOR0r_.js";
import "./runner-BepI0jrs.js";
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
import "./send-7qLxtK97.js";
import "./paths-UwFQANoB.js";
import "./chat-envelope-Ddj7Occv.js";
import "./tool-images-B_Tq_5hY.js";
import "./tool-display-VQ2UFB5v.js";
import "./fetch-guard-DLYr9x03.js";
import "./api-key-rotation-CmIvZBIM.js";
import "./local-roots-CusIIHJX.js";
import "./query-expansion-C0LYSFr9.js";
import "./model-catalog-D-1a_g1w.js";
import "./tokens-BrGcAwbN.js";
import "./with-timeout-DXNXiNQ6.js";
import "./deliver-C2kKUG6U.js";
import "./diagnostic-C_SZ1pLI.js";
import "./diagnostic-session-state-7Ra8u_hY.js";
import "./send-NKa4xzuq.js";
import "./model-CES2iFyq.js";
import "./exec-approvals-allowlist-DrS302vF.js";
import "./exec-safe-bin-runtime-policy-CGgle7ZQ.js";
import "./reply-prefix-CVpztiHa.js";
import "./memory-cli-D3QaLOP5.js";
import "./manager-J8EoHgoj.js";
import "./retry-KmKuGYic.js";
import "./target-errors-C15DNWSd.js";
import "./chunk-BeOk4Mlg.js";
import "./markdown-tables-DN7WeB5D.js";
import "./ir-CxO3rFZw.js";
import "./render-B5HNUbes.js";
import "./commands-C3u9scYW.js";
import "./commands-registry-BsIe9-uz.js";
import "./client-8n3vPrA3.js";
import "./call-DHXpVMRJ.js";
import "./pairing-token-B9zvy9za.js";
import "./channel-activity-CDstTtTV.js";
import "./fetch-CKDDJfTQ.js";
import "./tables-DsZuOznP.js";
import "./send-DzT1B2VU.js";
import "./pairing-store-DLPx-tMR.js";
import "./proxy-CQzIYU6S.js";
import "./links-Om7vMhDC.js";
import "./cli-utils-CbnnSB38.js";
import "./help-format-DuuK66_B.js";
import "./progress-BrNyn1gy.js";
import "./resolve-route--lvzGpSg.js";
import "./replies-FThXdFg9.js";
import "./skill-commands-CJovjj9P.js";
import "./workspace-dirs-BJv6AR0c.js";
import "./channel-selection-Dzp_BlPL.js";
import "./outbound-attachment-BhlVneoD.js";
import "./delivery-queue-Bn-CSv8D.js";
import "./session-cost-usage-kJ4UzyLC.js";
import "./send-BSQhQH3J.js";
import "./onboard-helpers-Urhlbb7I.js";
import "./prompt-style-DE_Wto62.js";
import "./pairing-labels-BpNo-T3d.js";
import "./exec-approvals-FygPo23-.js";
import "./nodes-screen-BsqoKcbB.js";
import "./control-service-B5U1wAxE.js";
import "./stagger-CPIlBwxt.js";
import "./pi-tools.policy-CbGKAXXH.js";

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