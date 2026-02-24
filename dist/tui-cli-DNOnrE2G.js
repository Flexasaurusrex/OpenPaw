import { Dt as theme, v as defaultRuntime } from "./entry.js";
import "./auth-profiles-F3rq6gIp.js";
import "./agent-scope-Ch2id45o.js";
import "./exec-G9-WTRVN.js";
import "./github-copilot-token-RNgXBxZS.js";
import "./host-env-security-DyQuUnEd.js";
import "./frontmatter-C-mnS1Ag.js";
import "./skills-DhLwpMz_.js";
import "./manifest-registry-DqqQzpz1.js";
import "./config-DcMGW7oZ.js";
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
import "./commands-LMwKegSD.js";
import "./commands-registry-DHdKdxYt.js";
import "./tool-display-qnmuGsrD.js";
import { t as parseTimeoutMs } from "./parse-timeout-U3P8xqXu.js";
import { t as formatDocsLink } from "./links-CJOVG08v.js";
import { t as runTui } from "./tui-C7NLg_OT.js";

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