import { Q as isRecord } from "./entry.js";
import { E as resolveOpenPawAgentDir, at as resolveImplicitCopilotProvider, it as resolveImplicitBedrockProvider, ot as resolveImplicitProviders, rt as normalizeProviders } from "./auth-profiles-F3rq6gIp.js";
import { i as loadConfig } from "./config-DcMGW7oZ.js";
import path from "node:path";
import fs from "node:fs/promises";

//#region src/agents/models-config.ts
const DEFAULT_MODE = "merge";
function mergeProviderModels(implicit, explicit) {
	const implicitModels = Array.isArray(implicit.models) ? implicit.models : [];
	const explicitModels = Array.isArray(explicit.models) ? explicit.models : [];
	if (implicitModels.length === 0) return {
		...implicit,
		...explicit
	};
	const getId = (model) => {
		if (!model || typeof model !== "object") return "";
		const id = model.id;
		return typeof id === "string" ? id.trim() : "";
	};
	const implicitById = new Map(implicitModels.map((model) => [getId(model), model]).filter(([id]) => Boolean(id)));
	const seen = /* @__PURE__ */ new Set();
	const mergedModels = explicitModels.map((explicitModel) => {
		const id = getId(explicitModel);
		if (!id) return explicitModel;
		seen.add(id);
		const implicitModel = implicitById.get(id);
		if (!implicitModel) return explicitModel;
		return {
			...explicitModel,
			input: implicitModel.input,
			reasoning: implicitModel.reasoning,
			contextWindow: implicitModel.contextWindow,
			maxTokens: implicitModel.maxTokens
		};
	});
	for (const implicitModel of implicitModels) {
		const id = getId(implicitModel);
		if (!id || seen.has(id)) continue;
		seen.add(id);
		mergedModels.push(implicitModel);
	}
	return {
		...implicit,
		...explicit,
		models: mergedModels
	};
}
function mergeProviders(params) {
	const out = params.implicit ? { ...params.implicit } : {};
	for (const [key, explicit] of Object.entries(params.explicit ?? {})) {
		const providerKey = key.trim();
		if (!providerKey) continue;
		const implicit = out[providerKey];
		out[providerKey] = implicit ? mergeProviderModels(implicit, explicit) : explicit;
	}
	return out;
}
async function readJson(pathname) {
	try {
		const raw = await fs.readFile(pathname, "utf8");
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
async function ensureOpenPawModelsJson(config, agentDirOverride) {
	const cfg = config ?? loadConfig();
	const agentDir = agentDirOverride?.trim() ? agentDirOverride.trim() : resolveOpenPawAgentDir();
	const explicitProviders = cfg.models?.providers ?? {};
	const providers = mergeProviders({
		implicit: await resolveImplicitProviders({
			agentDir,
			explicitProviders
		}),
		explicit: explicitProviders
	});
	const implicitBedrock = await resolveImplicitBedrockProvider({
		agentDir,
		config: cfg
	});
	if (implicitBedrock) {
		const existing = providers["amazon-bedrock"];
		providers["amazon-bedrock"] = existing ? mergeProviderModels(implicitBedrock, existing) : implicitBedrock;
	}
	const implicitCopilot = await resolveImplicitCopilotProvider({ agentDir });
	if (implicitCopilot && !providers["github-copilot"]) providers["github-copilot"] = implicitCopilot;
	if (Object.keys(providers).length === 0) return {
		agentDir,
		wrote: false
	};
	const mode = cfg.models?.mode ?? DEFAULT_MODE;
	const targetPath = path.join(agentDir, "models.json");
	let mergedProviders = providers;
	let existingRaw = "";
	if (mode === "merge") {
		const existing = await readJson(targetPath);
		if (isRecord(existing) && isRecord(existing.providers)) mergedProviders = {
			...existing.providers,
			...providers
		};
	}
	const normalizedProviders = normalizeProviders({
		providers: mergedProviders,
		agentDir
	});
	const next = `${JSON.stringify({ providers: normalizedProviders }, null, 2)}\n`;
	try {
		existingRaw = await fs.readFile(targetPath, "utf8");
	} catch {
		existingRaw = "";
	}
	if (existingRaw === next) return {
		agentDir,
		wrote: false
	};
	await fs.mkdir(agentDir, {
		recursive: true,
		mode: 448
	});
	await fs.writeFile(targetPath, next, { mode: 384 });
	return {
		agentDir,
		wrote: true
	};
}

//#endregion
export { ensureOpenPawModelsJson as t };