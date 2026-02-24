import { s as createSubsystemLogger } from "./entry.js";
import "./auth-profiles-Cob1PkNk.js";
import { l as resolveAgentWorkspaceDir, u as resolveDefaultAgentId } from "./agent-scope-Ch2id45o.js";
import "./exec-G9-WTRVN.js";
import "./github-copilot-token-RNgXBxZS.js";
import "./host-env-security-DyQuUnEd.js";
import "./model-DMMSU2Nn.js";
import "./pi-model-discovery-CwESh4K1.js";
import "./frontmatter-C-mnS1Ag.js";
import "./skills-DhLwpMz_.js";
import "./manifest-registry-DqqQzpz1.js";
import { i as loadConfig } from "./config-DUiZpzJa.js";
import "./version-C26Rk39r.js";
import "./env-vars-DiCRNmoj.js";
import "./dock-CIQZSu0X.js";
import "./client-DYR6lezz.js";
import "./call-B2DDSO3D.js";
import "./message-channel-C8ZvZtXL.js";
import "./pairing-token-Cs6U982f.js";
import "./net-BVkY67bp.js";
import "./ip-BkPdUc6e.js";
import "./tailnet-CBDDP2ef.js";
import { _ as loadOpenPawPlugins } from "./subagent-registry-C3IVJ9fO.js";
import "./sessions-BOuQLul1.js";
import "./tokens-ZjGx7ut4.js";
import "./plugins-BOsODpl9.js";
import "./accounts-ZciIdins.js";
import "./bindings-CqMiIKM5.js";
import "./logging-CGlH1P7F.js";
import "./send-BwXqEDH3.js";
import "./send-C4JFBNiL.js";
import "./with-timeout-Djdz4I0u.js";
import "./deliver-CQ-fLRss.js";
import "./diagnostic-dNzRjagQ.js";
import "./diagnostic-session-state-BPGgn8hZ.js";
import "./accounts-CxmFIdzG.js";
import "./send-BPN9CyRt.js";
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
import "./exec-approvals-allowlist-Bou3u6wf.js";
import "./exec-safe-bin-runtime-policy-D_zH0KKI.js";
import "./reply-prefix-BR6w-klU.js";
import "./memory-cli-c8OqPVXm.js";
import "./manager-B6UYhnJ6.js";
import "./gemini-auth-ClarSsef.js";
import "./fetch-guard-s1EvTHMo.js";
import "./query-expansion-6kMx1ddq.js";
import "./retry-BLB59C0N.js";
import "./target-errors-DnsFD3hl.js";
import "./chunk-CSy6-pZ0.js";
import "./markdown-tables-Dja2scho.js";
import "./local-roots-DAZSahJ7.js";
import "./ir-Bmjg7yjJ.js";
import "./render-Bdn0My43.js";
import "./commands-LMwKegSD.js";
import "./commands-registry-Cdy2yJTY.js";
import "./image-C9blTh14.js";
import "./tool-display-qnmuGsrD.js";
import "./runner-Dm3eq7Ry.js";
import "./model-catalog-ZJIgO4tD.js";
import "./session-utils-LM_GzPUO.js";
import "./skill-commands-B4Xi21Qc.js";
import "./workspace-dirs-XahlOvQp.js";
import "./pairing-store-BjCCgKtE.js";
import "./fetch-CjnkV4k0.js";
import "./exec-approvals-CUBR7Atl.js";
import "./nodes-screen-CNrWLRSw.js";
import "./session-cost-usage-Dn_xGzv4.js";
import "./channel-activity-DVjNqtU-.js";
import "./tables-D2EB277q.js";
import "./control-service-CiTUtbvA.js";
import "./stagger-CacBBbof.js";
import "./channel-selection-BjRDmc1c.js";
import "./send-afnWXyGc.js";
import "./outbound-attachment-dCeJCXyv.js";
import "./delivery-queue-DQk6d_Ts.js";
import "./send-ZHTX6J1E.js";
import "./resolve-route-ASm3WzJn.js";
import "./proxy-DyD4fJMf.js";
import "./links-CJOVG08v.js";
import "./cli-utils-B_gcZWk3.js";
import "./help-format-DhOc2v_u.js";
import "./progress-C3lmnWTa.js";
import "./replies-zd1xaXH9.js";
import "./onboard-helpers-CQbFd_nK.js";
import "./prompt-style-DmTpv6Qh.js";
import "./pairing-labels-ByMeBRle.js";
import "./pi-tools.policy-CScfFv2x.js";

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