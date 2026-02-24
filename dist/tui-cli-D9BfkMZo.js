import "./paths-5liSMgvV.js";
import { B as theme } from "./utils-CLEQvfyB.js";
import "./thinking-EAliFiVK.js";
import "./agent-scope-DVw9WyO3.js";
import { f as defaultRuntime } from "./subsystem-BlU6Lg5x.js";
import "./exec-DkdDR1S0.js";
import "./model-selection-DBzxxd2t.js";
import "./github-copilot-token-V7Dgsl4R.js";
import "./boolean-BgXe2hyu.js";
import "./env-BuaPy6k5.js";
import "./host-env-security-ljCLeQmh.js";
import "./message-channel-DlEv3rvX.js";
import "./config-BrzzL48f.js";
import "./version-CmTNPgEd.js";
import "./env-vars-CsJ4chkK.js";
import "./manifest-registry-fNuKu-JQ.js";
import "./dock-NIaOR0r_.js";
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
import "./paths-UwFQANoB.js";
import "./chat-envelope-Ddj7Occv.js";
import "./tool-images-B_Tq_5hY.js";
import "./tool-display-VQ2UFB5v.js";
import "./commands-C3u9scYW.js";
import "./commands-registry-BsIe9-uz.js";
import "./client-8n3vPrA3.js";
import "./call-DHXpVMRJ.js";
import "./pairing-token-B9zvy9za.js";
import { t as formatDocsLink } from "./links-Om7vMhDC.js";
import { t as parseTimeoutMs } from "./parse-timeout-DDSWreYs.js";
import { t as runTui } from "./tui-Ba-DTwec.js";

//#region src/cli/tui-cli.ts
function registerTuiCli(program) {
	program.command("tui").description("Open a terminal UI connected to the Gateway").option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--password <password>", "Gateway password (if required)").option("--session <key>", "Session key (default: \"main\", or \"global\" when scope is global)").option("--deliver", "Deliver assistant replies", false).option("--thinking <level>", "Thinking level override").option("--message <text>", "Send an initial message after connecting").option("--timeout-ms <ms>", "Agent timeout in ms (defaults to agents.defaults.timeoutSeconds)").option("--history-limit <n>", "History entries to load", "200").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/tui", "docs.openpaw.ai/cli/tui")}\n`).action(async (opts) => {
		try {
			const timeoutMs = parseTimeoutMs(opts.timeoutMs);
			if (opts.timeoutMs !== void 0 && timeoutMs === void 0) defaultRuntime.error(`warning: invalid --timeout-ms "${String(opts.timeoutMs)}"; ignoring`);
			const historyLimit = Number.parseInt(String(opts.historyLimit ?? "200"), 10);
			await runTui({
				url: opts.url,
				token: opts.token,
				password: opts.password,
				session: opts.session,
				deliver: Boolean(opts.deliver),
				thinking: opts.thinking,
				message: opts.message,
				timeoutMs,
				historyLimit: Number.isNaN(historyLimit) ? void 0 : historyLimit
			});
		} catch (err) {
			defaultRuntime.error(String(err));
			defaultRuntime.exit(1);
		}
	});
}

//#endregion
export { registerTuiCli };