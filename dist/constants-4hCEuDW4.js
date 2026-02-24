//#region src/daemon/constants.ts
const GATEWAY_LAUNCH_AGENT_LABEL = "ai.openpaw.gateway";
const GATEWAY_SYSTEMD_SERVICE_NAME = "openpaw-gateway";
const GATEWAY_WINDOWS_TASK_NAME = "OpenPaw Gateway";
const GATEWAY_SERVICE_MARKER = "openpaw";
const GATEWAY_SERVICE_KIND = "gateway";
const NODE_LAUNCH_AGENT_LABEL = "ai.openpaw.node";
const NODE_SYSTEMD_SERVICE_NAME = "openpaw-node";
const NODE_WINDOWS_TASK_NAME = "OpenPaw Node";
const NODE_SERVICE_MARKER = "openpaw";
const NODE_SERVICE_KIND = "node";
const NODE_WINDOWS_TASK_SCRIPT_NAME = "node.cmd";
const LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES = ["pawbot-gateway", "pawbot-gateway"];
function normalizeGatewayProfile(profile) {
	const trimmed = profile?.trim();
	if (!trimmed || trimmed.toLowerCase() === "default") return null;
	return trimmed;
}
function resolveGatewayProfileSuffix(profile) {
	const normalized = normalizeGatewayProfile(profile);
	return normalized ? `-${normalized}` : "";
}
function resolveGatewayLaunchAgentLabel(profile) {
	const normalized = normalizeGatewayProfile(profile);
	if (!normalized) return GATEWAY_LAUNCH_AGENT_LABEL;
	return `ai.openpaw.${normalized}`;
}
function resolveLegacyGatewayLaunchAgentLabels(profile) {
	return [];
}
function resolveGatewaySystemdServiceName(profile) {
	const suffix = resolveGatewayProfileSuffix(profile);
	if (!suffix) return GATEWAY_SYSTEMD_SERVICE_NAME;
	return `openpaw-gateway${suffix}`;
}
function resolveGatewayWindowsTaskName(profile) {
	const normalized = normalizeGatewayProfile(profile);
	if (!normalized) return GATEWAY_WINDOWS_TASK_NAME;
	return `OpenPaw Gateway (${normalized})`;
}
function formatGatewayServiceDescription(params) {
	const profile = normalizeGatewayProfile(params?.profile);
	const version = params?.version?.trim();
	const parts = [];
	if (profile) parts.push(`profile: ${profile}`);
	if (version) parts.push(`v${version}`);
	if (parts.length === 0) return "OpenPaw Gateway";
	return `OpenPaw Gateway (${parts.join(", ")})`;
}
function resolveGatewayServiceDescription(params) {
	return params.description ?? formatGatewayServiceDescription({
		profile: params.env.OPENPAW_PROFILE,
		version: params.environment?.OPENPAW_SERVICE_VERSION ?? params.env.OPENPAW_SERVICE_VERSION
	});
}
function resolveNodeLaunchAgentLabel() {
	return NODE_LAUNCH_AGENT_LABEL;
}
function resolveNodeSystemdServiceName() {
	return NODE_SYSTEMD_SERVICE_NAME;
}
function resolveNodeWindowsTaskName() {
	return NODE_WINDOWS_TASK_NAME;
}
function formatNodeServiceDescription(params) {
	const version = params?.version?.trim();
	if (!version) return "OpenPaw Node Host";
	return `OpenPaw Node Host (v${version})`;
}

//#endregion
export { resolveNodeWindowsTaskName as _, NODE_SERVICE_KIND as a, formatNodeServiceDescription as c, resolveGatewayServiceDescription as d, resolveGatewaySystemdServiceName as f, resolveNodeSystemdServiceName as g, resolveNodeLaunchAgentLabel as h, LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES as i, resolveGatewayLaunchAgentLabel as l, resolveLegacyGatewayLaunchAgentLabels as m, GATEWAY_SERVICE_KIND as n, NODE_SERVICE_MARKER as o, resolveGatewayWindowsTaskName as p, GATEWAY_SERVICE_MARKER as r, NODE_WINDOWS_TASK_SCRIPT_NAME as s, GATEWAY_LAUNCH_AGENT_LABEL as t, resolveGatewayProfileSuffix as u };