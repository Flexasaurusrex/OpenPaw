import { t as __exportAll } from "./rolldown-runtime-Cbj13DAv.js";
import { createRequire } from "node:module";

//#region src/version.ts
var version_exports = /* @__PURE__ */ __exportAll({
	VERSION: () => VERSION,
	readVersionFromBuildInfoForModuleUrl: () => readVersionFromBuildInfoForModuleUrl,
	readVersionFromPackageJsonForModuleUrl: () => readVersionFromPackageJsonForModuleUrl,
	resolveRuntimeServiceVersion: () => resolveRuntimeServiceVersion,
	resolveVersionFromModuleUrl: () => resolveVersionFromModuleUrl
});
const CORE_PACKAGE_NAME = "openpaw";
const PACKAGE_JSON_CANDIDATES = [
	"../package.json",
	"../../package.json",
	"../../../package.json",
	"./package.json"
];
const BUILD_INFO_CANDIDATES = [
	"../build-info.json",
	"../../build-info.json",
	"./build-info.json"
];
function readVersionFromJsonCandidates(moduleUrl, candidates, opts = {}) {
	try {
		const require = createRequire(moduleUrl);
		for (const candidate of candidates) try {
			const parsed = require(candidate);
			const version = parsed.version?.trim();
			if (!version) continue;
			if (opts.requirePackageName && parsed.name !== CORE_PACKAGE_NAME) continue;
			return version;
		} catch {}
		return null;
	} catch {
		return null;
	}
}
function firstNonEmpty(...values) {
	for (const value of values) {
		const trimmed = value?.trim();
		if (trimmed) return trimmed;
	}
}
function readVersionFromPackageJsonForModuleUrl(moduleUrl) {
	return readVersionFromJsonCandidates(moduleUrl, PACKAGE_JSON_CANDIDATES, { requirePackageName: true });
}
function readVersionFromBuildInfoForModuleUrl(moduleUrl) {
	return readVersionFromJsonCandidates(moduleUrl, BUILD_INFO_CANDIDATES);
}
function resolveVersionFromModuleUrl(moduleUrl) {
	return readVersionFromPackageJsonForModuleUrl(moduleUrl) || readVersionFromBuildInfoForModuleUrl(moduleUrl);
}
function resolveRuntimeServiceVersion(env = process.env, fallback = "dev") {
	return firstNonEmpty(env["OPENPAW_VERSION"], env["OPENPAW_SERVICE_VERSION"], env["npm_package_version"]) ?? fallback;
}
const VERSION = typeof __OPENPAW_VERSION__ === "string" && __OPENPAW_VERSION__ || process.env.OPENPAW_BUNDLED_VERSION || resolveVersionFromModuleUrl(import.meta.url) || "0.0.0";

//#endregion
export { resolveRuntimeServiceVersion as n, version_exports as r, VERSION as t };