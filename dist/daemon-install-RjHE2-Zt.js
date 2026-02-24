import "./paths-5liSMgvV.js";
import "./utils-CLEQvfyB.js";
import "./subsystem-BlU6Lg5x.js";
import "./exec-DkdDR1S0.js";
import "./host-env-security-ljCLeQmh.js";
import "./version-CmTNPgEd.js";
import "./env-vars-CsJ4chkK.js";
import "./prompt-style-DE_Wto62.js";
import "./runtime-guard-DPIiNxP-.js";
import "./note-UN8_Sj2N.js";
import { n as gatewayInstallErrorHint, t as buildGatewayInstallPlan } from "./daemon-install-helpers-CUrSwNMr.js";
import { r as isGatewayDaemonRuntime, t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-DG_wSD1u.js";
import { r as isSystemdUserServiceAvailable } from "./systemd-DwAFBjTQ.js";
import { t as resolveGatewayService } from "./service-C4VX1Mu3.js";
import { n as ensureSystemdUserLingerNonInteractive } from "./systemd-linger-vJVhrluo.js";

//#region src/commands/onboard-non-interactive/local/daemon-install.ts
async function installGatewayDaemonNonInteractive(params) {
	const { opts, runtime, port, gatewayToken } = params;
	if (!opts.installDaemon) return;
	const daemonRuntimeRaw = opts.daemonRuntime ?? DEFAULT_GATEWAY_DAEMON_RUNTIME;
	const systemdAvailable = process.platform === "linux" ? await isSystemdUserServiceAvailable() : true;
	if (process.platform === "linux" && !systemdAvailable) {
		runtime.log("Systemd user services are unavailable; skipping service install.");
		return;
	}
	if (!isGatewayDaemonRuntime(daemonRuntimeRaw)) {
		runtime.error("Invalid --daemon-runtime (use node or bun)");
		runtime.exit(1);
		return;
	}
	const service = resolveGatewayService();
	const { programArguments, workingDirectory, environment } = await buildGatewayInstallPlan({
		env: process.env,
		port,
		token: gatewayToken,
		runtime: daemonRuntimeRaw,
		warn: (message) => runtime.log(message),
		config: params.nextConfig
	});
	try {
		await service.install({
			env: process.env,
			stdout: process.stdout,
			programArguments,
			workingDirectory,
			environment
		});
	} catch (err) {
		runtime.error(`Gateway service install failed: ${String(err)}`);
		runtime.log(gatewayInstallErrorHint());
		return;
	}
	await ensureSystemdUserLingerNonInteractive({ runtime });
}

//#endregion
export { installGatewayDaemonNonInteractive };