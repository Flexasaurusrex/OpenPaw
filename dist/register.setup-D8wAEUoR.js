import { Dt as theme, lt as shortenHomePath, v as defaultRuntime } from "./entry.js";
import "./auth-profiles-F3rq6gIp.js";
import { h as DEFAULT_AGENT_WORKSPACE_DIR, w as ensureAgentWorkspace } from "./agent-scope-Ch2id45o.js";
import "./exec-G9-WTRVN.js";
import "./github-copilot-token-RNgXBxZS.js";
import "./host-env-security-DyQuUnEd.js";
import "./manifest-registry-DqqQzpz1.js";
import { l as writeConfigFile, r as createConfigIO } from "./config-DcMGW7oZ.js";
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
import "./sessions-DHAFOBA0.js";
import "./plugins-BOsODpl9.js";
import "./accounts-ZciIdins.js";
import "./bindings-CqMiIKM5.js";
import "./logging-CGlH1P7F.js";
import "./accounts-CxmFIdzG.js";
import "./redact-8ygXzN2c.js";
import "./errors-CAg9uklP.js";
import "./accounts-JARp6uPy.js";
import { s as resolveSessionTranscriptsDir } from "./paths-DXBvtSww.js";
import "./chat-envelope-GDr4Ob9e.js";
import { t as formatDocsLink } from "./links-CJOVG08v.js";
import { n as runCommandWithRuntime } from "./cli-utils-B_gcZWk3.js";
import "./progress-C3lmnWTa.js";
import "./onboard-helpers-CfGs7sWP.js";
import "./prompt-style-DmTpv6Qh.js";
import { t as hasExplicitOptions } from "./command-options-DMZnoQOj.js";
import "./note-DRZeK2VP.js";
import "./clack-prompter-Y1t9o76v.js";
import "./runtime-guard-BwjfOUlQ.js";
import "./onboarding-BZaZfNjb.js";
import { n as logConfigUpdated, t as formatConfigPath } from "./logging-D961S29j.js";
import { t as onboardCommand } from "./onboard-B7ibCX1s.js";
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