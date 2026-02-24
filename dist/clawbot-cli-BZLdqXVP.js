import "./paths-5liSMgvV.js";
import { B as theme } from "./utils-CLEQvfyB.js";
import "./agent-scope-DVw9WyO3.js";
import "./subsystem-BlU6Lg5x.js";
import "./exec-DkdDR1S0.js";
import "./model-selection-DBzxxd2t.js";
import "./github-copilot-token-V7Dgsl4R.js";
import "./boolean-BgXe2hyu.js";
import "./env-BuaPy6k5.js";
import "./host-env-security-ljCLeQmh.js";
import "./config-BrzzL48f.js";
import "./version-CmTNPgEd.js";
import "./env-vars-CsJ4chkK.js";
import "./manifest-registry-fNuKu-JQ.js";
import "./ip-9Ji2ZKmK.js";
import { t as formatDocsLink } from "./links-Om7vMhDC.js";
import { n as registerQrCli } from "./qr-cli--Of3MtlY.js";

//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
	registerQrCli(program.command("clawbot").description("Legacy clawbot command aliases").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.openpaw.ai/cli/clawbot")}\n`));
}

//#endregion
export { registerClawbotCli };