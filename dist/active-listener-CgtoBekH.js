import { f as DEFAULT_ACCOUNT_ID } from "./session-key-BlAu1iW4.js";
import { r as formatCliCommand } from "./env-DiD38AJD.js";

//#region src/web/active-listener.ts
const listeners = /* @__PURE__ */ new Map();
function resolveWebAccountId(accountId) {
	return (accountId ?? "").trim() || DEFAULT_ACCOUNT_ID;
}
function requireActiveWebListener(accountId) {
	const id = resolveWebAccountId(accountId);
	const listener = listeners.get(id) ?? null;
	if (!listener) throw new Error(`No active WhatsApp Web listener (account: ${id}). Start the gateway, then link WhatsApp with: ${formatCliCommand(`openpaw channels login --channel whatsapp --account ${id}`)}.`);
	return {
		accountId: id,
		listener
	};
}
function setActiveWebListener(accountIdOrListener, maybeListener) {
	const { accountId, listener } = typeof accountIdOrListener === "string" ? {
		accountId: accountIdOrListener,
		listener: maybeListener ?? null
	} : {
		accountId: DEFAULT_ACCOUNT_ID,
		listener: accountIdOrListener ?? null
	};
	const id = resolveWebAccountId(accountId);
	if (!listener) listeners.delete(id);
	else listeners.set(id, listener);
	if (id === DEFAULT_ACCOUNT_ID) {}
}
function getActiveWebListener(accountId) {
	const id = resolveWebAccountId(accountId);
	return listeners.get(id) ?? null;
}

//#endregion
export { requireActiveWebListener as n, setActiveWebListener as r, getActiveWebListener as t };