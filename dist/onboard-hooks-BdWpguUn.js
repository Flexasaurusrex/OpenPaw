import "./paths-5liSMgvV.js";
import "./utils-CLEQvfyB.js";
import { l as resolveAgentWorkspaceDir, u as resolveDefaultAgentId } from "./agent-scope-DVw9WyO3.js";
import "./subsystem-BlU6Lg5x.js";
import "./exec-DkdDR1S0.js";
import { t as formatCliCommand } from "./command-format-BMHSLXMa.js";
import "./boolean-BgXe2hyu.js";
import "./frontmatter-BAu7PLcH.js";
import "./workspace-BLa0Bzoq.js";
import { t as buildWorkspaceHookStatus } from "./hooks-status-DWHRA0ab.js";

//#region src/commands/onboard-hooks.ts
async function setupInternalHooks(cfg, runtime, prompter) {
	await prompter.note([
		"Hooks let you automate actions when agent commands are issued.",
		"Example: Save session context to memory when you issue /new or /reset.",
		"",
		"Learn more: https://docs.openpaw.ai/automation/hooks"
	].join("\n"), "Hooks");
	const eligibleHooks = buildWorkspaceHookStatus(resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)), { config: cfg }).hooks.filter((h) => h.eligible);
	if (eligibleHooks.length === 0) {
		await prompter.note("No eligible hooks found. You can configure hooks later in your config.", "No Hooks Available");
		return cfg;
	}
	const selected = (await prompter.multiselect({
		message: "Enable hooks?",
		options: [{
			value: "__skip__",
			label: "Skip for now"
		}, ...eligibleHooks.map((hook) => ({
			value: hook.name,
			label: `${hook.emoji ?? "🔗"} ${hook.name}`,
			hint: hook.description
		}))]
	})).filter((name) => name !== "__skip__");
	if (selected.length === 0) return cfg;
	const entries = { ...cfg.hooks?.internal?.entries };
	for (const name of selected) entries[name] = { enabled: true };
	const next = {
		...cfg,
		hooks: {
			...cfg.hooks,
			internal: {
				enabled: true,
				entries
			}
		}
	};
	await prompter.note([
		`Enabled ${selected.length} hook${selected.length > 1 ? "s" : ""}: ${selected.join(", ")}`,
		"",
		"You can manage hooks later with:",
		`  ${formatCliCommand("openpaw hooks list")}`,
		`  ${formatCliCommand("openpaw hooks enable <name>")}`,
		`  ${formatCliCommand("openpaw hooks disable <name>")}`
	].join("\n"), "Hooks Configured");
	return next;
}

//#endregion
export { setupInternalHooks };