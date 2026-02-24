import { t as createSubsystemLogger } from "./subsystem-BlU6Lg5x.js";
import { Lt as resolveOpenPawAgentDir } from "./model-selection-DLFgSmxJ.js";
import { i as loadConfig } from "./config-D2VtfSUL.js";
import { t as ensureOpenPawModelsJson } from "./models-config-Dg8Kg5A3.js";

//#region src/agents/model-catalog.ts
const log = createSubsystemLogger("model-catalog");
let modelCatalogPromise = null;
let hasLoggedModelCatalogError = false;
const defaultImportPiSdk = () => import("./pi-model-discovery-Cojifu4Y.js").then((n) => n.r);
let importPiSdk = defaultImportPiSdk;
const CODEX_PROVIDER = "openai-codex";
const OPENAI_CODEX_GPT53_MODEL_ID = "gpt-5.3-codex";
const OPENAI_CODEX_GPT53_SPARK_MODEL_ID = "gpt-5.3-codex-spark";
function applyOpenAICodexSparkFallback(models) {
	if (models.some((entry) => entry.provider === CODEX_PROVIDER && entry.id.toLowerCase() === OPENAI_CODEX_GPT53_SPARK_MODEL_ID)) return;
	const baseModel = models.find((entry) => entry.provider === CODEX_PROVIDER && entry.id.toLowerCase() === OPENAI_CODEX_GPT53_MODEL_ID);
	if (!baseModel) return;
	models.push({
		...baseModel,
		id: OPENAI_CODEX_GPT53_SPARK_MODEL_ID,
		name: OPENAI_CODEX_GPT53_SPARK_MODEL_ID
	});
}
function createAuthStorage(AuthStorageLike, path) {
	const withFactory = AuthStorageLike;
	if (typeof withFactory.create === "function") return withFactory.create(path);
	return new AuthStorageLike(path);
}
async function loadModelCatalog(params) {
	if (params?.useCache === false) modelCatalogPromise = null;
	if (modelCatalogPromise) return modelCatalogPromise;
	modelCatalogPromise = (async () => {
		const models = [];
		const sortModels = (entries) => entries.sort((a, b) => {
			const p = a.provider.localeCompare(b.provider);
			if (p !== 0) return p;
			return a.name.localeCompare(b.name);
		});
		try {
			await ensureOpenPawModelsJson(params?.config ?? loadConfig());
			await (await import("./pi-auth-json-Pvzmgsn3.js")).ensurePiAuthJsonFromAuthProfiles(resolveOpenPawAgentDir());
			const piSdk = await importPiSdk();
			const agentDir = resolveOpenPawAgentDir();
			const { join } = await import("node:path");
			const authStorage = createAuthStorage(piSdk.AuthStorage, join(agentDir, "auth.json"));
			const registry = new piSdk.ModelRegistry(authStorage, join(agentDir, "models.json"));
			const entries = Array.isArray(registry) ? registry : registry.getAll();
			for (const entry of entries) {
				const id = String(entry?.id ?? "").trim();
				if (!id) continue;
				const provider = String(entry?.provider ?? "").trim();
				if (!provider) continue;
				const name = String(entry?.name ?? id).trim() || id;
				const contextWindow = typeof entry?.contextWindow === "number" && entry.contextWindow > 0 ? entry.contextWindow : void 0;
				const reasoning = typeof entry?.reasoning === "boolean" ? entry.reasoning : void 0;
				const input = Array.isArray(entry?.input) ? entry.input : void 0;
				models.push({
					id,
					name,
					provider,
					contextWindow,
					reasoning,
					input
				});
			}
			applyOpenAICodexSparkFallback(models);
			if (models.length === 0) modelCatalogPromise = null;
			return sortModels(models);
		} catch (error) {
			if (!hasLoggedModelCatalogError) {
				hasLoggedModelCatalogError = true;
				log.warn(`Failed to load model catalog: ${String(error)}`);
			}
			modelCatalogPromise = null;
			if (models.length > 0) return sortModels(models);
			return [];
		}
	})();
	return modelCatalogPromise;
}
/**
* Check if a model supports image input based on its catalog entry.
*/
function modelSupportsVision(entry) {
	return entry?.input?.includes("image") ?? false;
}
/**
* Find a model in the catalog by provider and model ID.
*/
function findModelInCatalog(catalog, provider, modelId) {
	const normalizedProvider = provider.toLowerCase().trim();
	const normalizedModelId = modelId.toLowerCase().trim();
	return catalog.find((entry) => entry.provider.toLowerCase() === normalizedProvider && entry.id.toLowerCase() === normalizedModelId);
}

//#endregion
export { loadModelCatalog as n, modelSupportsVision as r, findModelInCatalog as t };