import { Dt as theme } from "./entry.js";
import "./auth-profiles-F3rq6gIp.js";
import "./agent-scope-Ch2id45o.js";
import "./exec-G9-WTRVN.js";
import "./github-copilot-token-RNgXBxZS.js";
import "./host-env-security-DyQuUnEd.js";
import "./manifest-registry-DqqQzpz1.js";
import "./config-DcMGW7oZ.js";
import "./version-C26Rk39r.js";
import "./env-vars-DiCRNmoj.js";
import "./ip-BkPdUc6e.js";
import { t as formatDocsLink } from "./links-CJOVG08v.js";
import { n as registerQrCli } from "./qr-cli-BSEhIAdJ.js";

//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
	registerQrCli(program.command("clawbot").description("Legacy clawbot command aliases").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.openpaw.ai/cli/clawbot")}\n`));
}

//#endregion
export { registerClawbotCli };