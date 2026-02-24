import "./paths-5liSMgvV.js";
import { B as theme, R as colorize, S as shortenHomePath, z as isRich } from "./utils-CLEQvfyB.js";
import "./agent-scope-DVw9WyO3.js";
import "./subsystem-BlU6Lg5x.js";
import "./exec-DkdDR1S0.js";
import "./model-selection-DBzxxd2t.js";
import "./github-copilot-token-V7Dgsl4R.js";
import { t as formatCliCommand } from "./command-format-BMHSLXMa.js";
import "./boolean-BgXe2hyu.js";
import "./env-BuaPy6k5.js";
import "./host-env-security-ljCLeQmh.js";
import "./message-channel-DlEv3rvX.js";
import { o as readConfigFileSnapshot } from "./config-BrzzL48f.js";
import "./version-CmTNPgEd.js";
import "./env-vars-CsJ4chkK.js";
import "./manifest-registry-fNuKu-JQ.js";
import "./dock-NIaOR0r_.js";
import "./sessions-CJHPvDu8.js";
import "./plugins-PixIvqwD.js";
import "./accounts-DQouuDyL.js";
import "./accounts-Cx7B1Aw-.js";
import "./accounts-B5K1ARxi.js";
import "./bindings-vqxtcSdy.js";
import "./logging-6RmrnEvA.js";
import "./paths-UwFQANoB.js";
import "./chat-envelope-Ddj7Occv.js";
import "./exec-approvals-allowlist-DrS302vF.js";
import "./exec-safe-bin-runtime-policy-CGgle7ZQ.js";
import "./prompt-style-DE_Wto62.js";
import { c as shouldMigrateStateFromPath } from "./argv-BGSpv_Aq.js";
import "./catalog-C4xsp0lG.js";
import "./note-UN8_Sj2N.js";
import "./plugin-auto-enable-CpQKk2Ow.js";
import { t as loadAndMaybeMigrateDoctorConfig } from "./doctor-config-flow-CvcWcolf.js";

//#region src/cli/program/config-guard.ts
const ALLOWED_INVALID_COMMANDS = new Set([
	"doctor",
	"logs",
	"health",
	"help",
	"status"
]);
const ALLOWED_INVALID_GATEWAY_SUBCOMMANDS = new Set([
	"status",
	"probe",
	"health",
	"discover",
	"call",
	"install",
	"uninstall",
	"start",
	"stop",
	"restart"
]);
let didRunDoctorConfigFlow = false;
let configSnapshotPromise = null;
function formatConfigIssues(issues) {
	return issues.map((issue) => `- ${issue.path || "<root>"}: ${issue.message}`);
}
async function getConfigSnapshot() {
	if (process.env.VITEST === "true") return readConfigFileSnapshot();
	configSnapshotPromise ??= readConfigFileSnapshot();
	return configSnapshotPromise;
}
async function ensureConfigReady(params) {
	const commandPath = params.commandPath ?? [];
	if (!didRunDoctorConfigFlow && shouldMigrateStateFromPath(commandPath)) {
		didRunDoctorConfigFlow = true;
		await loadAndMaybeMigrateDoctorConfig({
			options: { nonInteractive: true },
			confirm: async () => false
		});
	}
	const snapshot = await getConfigSnapshot();
	const commandName = commandPath[0];
	const subcommandName = commandPath[1];
	const allowInvalid = commandName ? ALLOWED_INVALID_COMMANDS.has(commandName) || commandName === "gateway" && subcommandName && ALLOWED_INVALID_GATEWAY_SUBCOMMANDS.has(subcommandName) : false;
	const issues = snapshot.exists && !snapshot.valid ? formatConfigIssues(snapshot.issues) : [];
	const legacyIssues = snapshot.legacyIssues.length > 0 ? snapshot.legacyIssues.map((issue) => `- ${issue.path}: ${issue.message}`) : [];
	if (!(snapshot.exists && !snapshot.valid)) return;
	const rich = isRich();
	const muted = (value) => colorize(rich, theme.muted, value);
	const error = (value) => colorize(rich, theme.error, value);
	const heading = (value) => colorize(rich, theme.heading, value);
	const commandText = (value) => colorize(rich, theme.command, value);
	params.runtime.error(heading("Config invalid"));
	params.runtime.error(`${muted("File:")} ${muted(shortenHomePath(snapshot.path))}`);
	if (issues.length > 0) {
		params.runtime.error(muted("Problem:"));
		params.runtime.error(issues.map((issue) => `  ${error(issue)}`).join("\n"));
	}
	if (legacyIssues.length > 0) {
		params.runtime.error(muted("Legacy config keys detected:"));
		params.runtime.error(legacyIssues.map((issue) => `  ${error(issue)}`).join("\n"));
	}
	params.runtime.error("");
	params.runtime.error(`${muted("Run:")} ${commandText(formatCliCommand("openpaw doctor --fix"))}`);
	if (!allowInvalid) params.runtime.exit(1);
}

//#endregion
export { ensureConfigReady };