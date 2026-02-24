import "./paths-5liSMgvV.js";
import { B as theme, S as shortenHomePath } from "./utils-CLEQvfyB.js";
import { h as DEFAULT_AGENT_WORKSPACE_DIR, w as ensureAgentWorkspace } from "./agent-scope-DVw9WyO3.js";
import { f as defaultRuntime } from "./subsystem-BlU6Lg5x.js";
import "./exec-DkdDR1S0.js";
import "./model-selection-DLFgSmxJ.js";
import "./github-copilot-token-V7Dgsl4R.js";
import "./boolean-BgXe2hyu.js";
import "./env-BuaPy6k5.js";
import "./host-env-security-ljCLeQmh.js";
import "./message-channel-DlEv3rvX.js";
import { l as writeConfigFile, r as createConfigIO } from "./config-D2VtfSUL.js";
import "./version-CmTNPgEd.js";
import "./env-vars-CsJ4chkK.js";
import "./manifest-registry-fNuKu-JQ.js";
import "./dock-NIaOR0r_.js";
import "./ip-9Ji2ZKmK.js";
import "./tailnet-CfnDL3PT.js";
import "./ws-DI10x-Zu.js";
import "./redact-iq6ANRhF.js";
import "./errors-DZpIsD32.js";
import "./sessions-DrdLhqGQ.js";
import "./plugins-PixIvqwD.js";
import "./accounts-DQouuDyL.js";
import "./accounts-Cx7B1Aw-.js";
import "./accounts-B5K1ARxi.js";
import "./bindings-vqxtcSdy.js";
import "./logging-6RmrnEvA.js";
import { s as resolveSessionTranscriptsDir } from "./paths-UwFQANoB.js";
import "./chat-envelope-Ddj7Occv.js";
import "./client-8n3vPrA3.js";
import "./call-qMGOPQLT.js";
import "./pairing-token-B9zvy9za.js";
import { t as formatDocsLink } from "./links-Om7vMhDC.js";
import { n as runCommandWithRuntime } from "./cli-utils-CbnnSB38.js";
import "./progress-BrNyn1gy.js";
import "./onboard-helpers-C5liWlpx.js";
import "./prompt-style-DE_Wto62.js";
import "./runtime-guard-DPIiNxP-.js";
import { t as hasExplicitOptions } from "./command-options-D1vpSf2D.js";
import "./note-UN8_Sj2N.js";
import "./clack-prompter-7NUHBvOR.js";
import "./onboarding-CkGtxQsK.js";
import { n as logConfigUpdated, t as formatConfigPath } from "./logging-CZH6rk0L.js";
import { t as onboardCommand } from "./onboard-BleCWe7x.js";
import JSON5 from "json5";
import fs from "node:fs/promises";

//#region src/commands/setup.ts
async function readConfigFileRaw(configPath) {
	try {
		const raw = await fs.readFile(configPath, "utf-8");
		const parsed = JSON5.parse(raw);
		if (parsed && typeof parsed === "object") return {
			exists: true,
			parsed
		};
		return {
			exists: true,
			parsed: {}
		};
	} catch {
		return {
			exists: false,
			parsed: {}
		};
	}
}
async function setupCommand(opts, runtime = defaultRuntime) {
	const desiredWorkspace = typeof opts?.workspace === "string" && opts.workspace.trim() ? opts.workspace.trim() : void 0;
	const configPath = createConfigIO().configPath;
	const existingRaw = await readConfigFileRaw(configPath);
	const cfg = existingRaw.parsed;
	const defaults = cfg.agents?.defaults ?? {};
	const workspace = desiredWorkspace ?? defaults.workspace ?? DEFAULT_AGENT_WORKSPACE_DIR;
	const next = {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...defaults,
				workspace
			}
		}
	};
	if (!existingRaw.exists || defaults.workspace !== workspace) {
		await writeConfigFile(next);
		if (!existingRaw.exists) runtime.log(`Wrote ${formatConfigPath(configPath)}`);
		else logConfigUpdated(runtime, {
			path: configPath,
			suffix: "(set agents.defaults.workspace)"
		});
	} else runtime.log(`Config OK: ${formatConfigPath(configPath)}`);
	const ws = await ensureAgentWorkspace({
		dir: workspace,
		ensureBootstrapFiles: !next.agents?.defaults?.skipBootstrap
	});
	runtime.log(`Workspace OK: ${shortenHomePath(ws.dir)}`);
	const sessionsDir = resolveSessionTranscriptsDir();
	await fs.mkdir(sessionsDir, { recursive: true });
	runtime.log(`Sessions OK: ${shortenHomePath(sessionsDir)}`);
}

//#endregion
//#region src/cli/program/register.setup.ts
function registerSetupCommand(program) {
	program.command("setup").description("Initialize ~/.openpaw/openpaw.json and the agent workspace").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/setup", "docs.openpaw.ai/cli/setup")}\n`).option("--workspace <dir>", "Agent workspace directory (default: ~/.openpaw/workspace; stored as agents.defaults.workspace)").option("--wizard", "Run the interactive onboarding wizard", false).option("--non-interactive", "Run the wizard without prompts", false).option("--mode <mode>", "Wizard mode: local|remote").option("--remote-url <url>", "Remote Gateway WebSocket URL").option("--remote-token <token>", "Remote Gateway token (optional)").action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const hasWizardFlags = hasExplicitOptions(command, [
				"wizard",
				"nonInteractive",
				"mode",
				"remoteUrl",
				"remoteToken"
			]);
			if (opts.wizard || hasWizardFlags) {
				await onboardCommand({
					workspace: opts.workspace,
					nonInteractive: Boolean(opts.nonInteractive),
					mode: opts.mode,
					remoteUrl: opts.remoteUrl,
					remoteToken: opts.remoteToken
				}, defaultRuntime);
				return;
			}
			await setupCommand({ workspace: opts.workspace }, defaultRuntime);
		});
	});
}

//#endregion
export { registerSetupCommand };