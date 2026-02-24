import { Dt as theme, Et as isRich, fn as hasRootVersionAlias, g as visibleWidth } from "./entry.js";
import { n as resolveCommitHash } from "./git-commit-EV8KJ5xc.js";
import { t as pickTagline } from "./tagline-DooArC9V.js";

//#region src/cli/banner.ts
let bannerEmitted = false;
const graphemeSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
const hasJsonFlag = (argv) => argv.some((arg) => arg === "--json" || arg.startsWith("--json="));
const hasVersionFlag = (argv) => argv.some((arg) => arg === "--version" || arg === "-V") || hasRootVersionAlias(argv);
function formatCliBannerLine(version, options = {}) {
	const commitLabel = options.commit ?? resolveCommitHash({ env: options.env }) ?? "unknown";
	const tagline = pickTagline(options);
	const rich = options.richTty ?? isRich();
	const title = "🐾 OpenPaw";
	const columns = options.columns ?? process.stdout.columns ?? 120;
	const plainFullLine = `${title} ${version} (${commitLabel}) — ${tagline}`;
	const fitsOnOneLine = visibleWidth(plainFullLine) <= columns;
	if (rich) {
		if (fitsOnOneLine) return `${theme.heading(title)} ${theme.info(version)} ${theme.muted(`(${commitLabel})`)} ${theme.muted("—")} ${theme.accentDim(tagline)}`;
		return `${`${theme.heading(title)} ${theme.info(version)} ${theme.muted(`(${commitLabel})`)}`}\n${`${" ".repeat(3)}${theme.accentDim(tagline)}`}`;
	}
	if (fitsOnOneLine) return plainFullLine;
	return `${`${title} ${version} (${commitLabel})`}\n${`${" ".repeat(3)}${tagline}`}`;
}
function emitCliBanner(version, options = {}) {
	if (bannerEmitted) return;
	const argv = options.argv ?? process.argv;
	if (!process.stdout.isTTY) return;
	if (hasJsonFlag(argv)) return;
	if (hasVersionFlag(argv)) return;
	const line = formatCliBannerLine(version, options);
	process.stdout.write(`\n${line}\n\n`);
	bannerEmitted = true;
}
function hasEmittedCliBanner() {
	return bannerEmitted;
}

//#endregion
export { formatCliBannerLine as n, hasEmittedCliBanner as r, emitCliBanner as t };