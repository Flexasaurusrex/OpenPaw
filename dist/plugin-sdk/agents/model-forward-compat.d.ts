import type { Api, Model } from "@mariozechner/pi-ai";
import type { ModelRegistry } from "./pi-model-discovery.js";
export declare function resolveForwardCompatModel(provider: string, modelId: string, modelRegistry: ModelRegistry): Model<Api> | undefined;
