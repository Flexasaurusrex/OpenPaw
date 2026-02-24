import { s as createSubsystemLogger } from "./entry.js";
import "./auth-profiles-F3rq6gIp.js";
import { l as resolveAgentWorkspaceDir, u as resolveDefaultAgentId } from "./agent-scope-Ch2id45o.js";
import "./exec-G9-WTRVN.js";
import "./github-copilot-token-RNgXBxZS.js";
import "./host-env-security-DyQuUnEd.js";
import "./model-N-4PKrha.js";
import "./pi-model-discovery-CwESh4K1.js";
import "./frontmatter-C-mnS1Ag.js";
import "./skills-DhLwpMz_.js";
import "./manifest-registry-DqqQzpz1.js";
import { i as loadConfig } from "./config-DcMGW7oZ.js";
import "./version-C26Rk39r.js";
import "./env-vars-DiCRNmoj.js";
import "./dock-CIQZSu0X.js";
import "./client-DYR6lezz.js";
import "./call-BVtRsC6W.js";
import "./message-channel-C8ZvZtXL.js";
import "./pairing-token-Cs6U982f.js";
import "./net-BVkY67bp.js";
import "./ip-BkPdUc6e.js";
import "./tailnet-CBDDP2ef.js";
import { _ as loadOpenPawPlugins } from "./subagent-registry-CxSu1VdQ.js";
import "./sessions-DHAFOBA0.js";
import "./tokens-ZjGx7ut4.js";
import "./plugins-BOsODpl9.js";
import "./accounts-ZciIdins.js";
import "./bindings-CqMiIKM5.js";
import "./logging-CGlH1P7F.js";
import "./send-B3kZHiOq.js";
import "./send-CUkZT9uJ.js";
import "./with-timeout-CSlHvjbK.js";
import "./deliver-C6XlXNEG.js";
import "./diagnostic-dNzRjagQ.js";
import "./diagnostic-session-state-BPGgn8hZ.js";
import "./accounts-CxmFIdzG.js";
import "./send-DCHOQxuf.js";
import "./image-ops-CD21cBoz.js";
import "./pi-embedded-helpers-0uRstZmW.js";
import "./sandbox-lLs3oxDJ.js";
import "./chrome-DAZEL2P9.js";
import "./tailscale-QhdHV80-.js";
import "./auth-LAV7Qr_D.js";
import "./server-context-Vp197Jfw.js";
import "./routes-Cue3T4Lw.js";
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
import "./models-config-DsL-XOw3.js";
import "./exec-approvals-allowlist-BN0RHFKq.js";
import "./exec-safe-bin-runtime-policy-NaKy0Dfa.js";
import "./reply-prefix-BR6w-klU.js";
import "./memory-cli-Cq1LLSNk.js";
import "./manager-BKGTL4jm.js";
import "./gemini-auth-DsOU4McY.js";
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
import "./commands-registry-DHdKdxYt.js";
import "./image-DPkJaepE.js";
import "./tool-display-qnmuGsrD.js";
import "./runner-BJLKxoNh.js";
import "./model-catalog-CIioIMi0.js";
import "./session-utils-BETd5A0g.js";
import "./skill-commands-CAW-2yVH.js";
import "./workspace-dirs-XahlOvQp.js";
import "./pairing-store-Dktke6OC.js";
import "./fetch-CjnkV4k0.js";
import "./exec-approvals-CUBR7Atl.js";
import "./nodes-screen-CNrWLRSw.js";
import "./session-cost-usage-Dn_xGzv4.js";
import "./channel-activity-DVjNqtU-.js";
import "./tables-D2EB277q.js";
import "./control-service-Bwh1V-uQ.js";
import "./stagger-CacBBbof.js";
import "./channel-selection-BjRDmc1c.js";
import "./send-Dsi0rTfM.js";
import "./outbound-attachment-dCeJCXyv.js";
import "./delivery-queue-DQk6d_Ts.js";
import "./send-BwsoXhrs.js";
import "./resolve-route-ASm3WzJn.js";
import "./proxy-DyD4fJMf.js";
import "./links-CJOVG08v.js";
import "./cli-utils-B_gcZWk3.js";
import "./help-format-DhOc2v_u.js";
import "./progress-C3lmnWTa.js";
import "./replies-Byg5EBY-.js";
import "./onboard-helpers-CfGs7sWP.js";
import "./prompt-style-DmTpv6Qh.js";
import "./pairing-labels-CNVGG8qu.js";
import "./pi-tools.policy-B1slmWSE.js";

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