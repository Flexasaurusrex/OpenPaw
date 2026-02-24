import { t as __exportAll } from "./rolldown-runtime-Cbj13DAv.js";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

//#region src/infra/git-root.ts
const DEFAULT_GIT_DISCOVERY_MAX_DEPTH = 12;
function walkUpFrom(startDir, opts, resolveAtDir) {
	let current = path.resolve(startDir);
	const maxDepth = opts.maxDepth ?? DEFAULT_GIT_DISCOVERY_MAX_DEPTH;
	for (let i = 0; i < maxDepth; i += 1) {
		const resolved = resolveAtDir(current);
		if (resolved !== null && resolved !== void 0) return resolved;
		const parent = path.dirname(current);
		if (parent === current) break;
		current = parent;
	}
	return null;
}
function hasGitMarker(repoRoot) {
	const gitPath = path.join(repoRoot, ".git");
	try {
		const stat = fs.statSync(gitPath);
		return stat.isDirectory() || stat.isFile();
	} catch {
		return false;
	}
}
function findGitRoot(startDir, opts = {}) {
	return walkUpFrom(startDir, opts, (repoRoot) => hasGitMarker(repoRoot) ? repoRoot : null);
}
function resolveGitDirFromMarker(repoRoot) {
	const gitPath = path.join(repoRoot, ".git");
	try {
		const stat = fs.statSync(gitPath);
		if (stat.isDirectory()) return gitPath;
		if (!stat.isFile()) return null;
		const match = fs.readFileSync(gitPath, "utf-8").match(/gitdir:\s*(.+)/i);
		if (!match?.[1]) return null;
		return path.resolve(repoRoot, match[1].trim());
	} catch {
		return null;
	}
}
function resolveGitHeadPath(startDir, opts = {}) {
	return walkUpFrom(startDir, opts, (repoRoot) => {
		const gitDir = resolveGitDirFromMarker(repoRoot);
		return gitDir ? path.join(gitDir, "HEAD") : null;
	});
}

//#endregion
//#region src/infra/git-commit.ts
var git_commit_exports = /* @__PURE__ */ __exportAll({ resolveCommitHash: () => resolveCommitHash });
const formatCommit = (value) => {
	if (!value) return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	return trimmed.length > 7 ? trimmed.slice(0, 7) : trimmed;
};
let cachedCommit;
const readCommitFromPackageJson = () => {
	try {
		const pkg = createRequire(import.meta.url)("../../package.json");
		return formatCommit(pkg.gitHead ?? pkg.githead ?? null);
	} catch {
		return null;
	}
};
const readCommitFromBuildInfo = () => {
	try {
		const require = createRequire(import.meta.url);
		for (const candidate of ["../build-info.json", "./build-info.json"]) try {
			const formatted = formatCommit(require(candidate).commit ?? null);
			if (formatted) return formatted;
		} catch {}
		return null;
	} catch {
		return null;
	}
};
const resolveCommitHash = (options = {}) => {
	if (cachedCommit !== void 0) return cachedCommit;
	const env = options.env ?? process.env;
	const normalized = formatCommit(env.GIT_COMMIT?.trim() || env.GIT_SHA?.trim());
	if (normalized) {
		cachedCommit = normalized;
		return cachedCommit;
	}
	const buildInfoCommit = readCommitFromBuildInfo();
	if (buildInfoCommit) {
		cachedCommit = buildInfoCommit;
		return cachedCommit;
	}
	const pkgCommit = readCommitFromPackageJson();
	if (pkgCommit) {
		cachedCommit = pkgCommit;
		return cachedCommit;
	}
	try {
		const headPath = resolveGitHeadPath(options.cwd ?? process.cwd());
		if (!headPath) {
			cachedCommit = null;
			return cachedCommit;
		}
		const head = fs.readFileSync(headPath, "utf-8").trim();
		if (!head) {
			cachedCommit = null;
			return cachedCommit;
		}
		if (head.startsWith("ref:")) {
			const ref = head.replace(/^ref:\s*/i, "").trim();
			const refPath = path.resolve(path.dirname(headPath), ref);
			cachedCommit = formatCommit(fs.readFileSync(refPath, "utf-8").trim());
			return cachedCommit;
		}
		cachedCommit = formatCommit(head);
		return cachedCommit;
	} catch {
		cachedCommit = null;
		return cachedCommit;
	}
};

//#endregion
export { resolveCommitHash as n, findGitRoot as r, git_commit_exports as t };