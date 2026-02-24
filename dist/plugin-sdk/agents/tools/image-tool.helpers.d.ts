import type { AssistantMessage } from "@mariozechner/pi-ai";
import type { OpenPawConfig } from "../../config/config.js";
export type ImageModelConfig = {
    primary?: string;
    fallbacks?: string[];
};
export declare function decodeDataUrl(dataUrl: string): {
    buffer: Buffer;
    mimeType: string;
    kind: "image";
};
export declare function coerceImageAssistantText(params: {
    message: AssistantMessage;
    provider: string;
    model: string;
}): string;
export declare function coerceImageModelConfig(cfg?: OpenPawConfig): ImageModelConfig;
export declare function resolveProviderVisionModelFromConfig(params: {
    cfg?: OpenPawConfig;
    provider: string;
}): string | null;
