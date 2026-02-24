import { Container } from "@buape/carbon";
import type { OpenPawConfig } from "../config/config.js";
type DiscordContainerComponents = ConstructorParameters<typeof Container>[0];
type ResolveDiscordAccentColorParams = {
    cfg: OpenPawConfig;
    accountId?: string | null;
};
export declare function normalizeDiscordAccentColor(raw?: string | null): string | null;
export declare function resolveDiscordAccentColor(params: ResolveDiscordAccentColorParams): string;
export declare class DiscordUiContainer extends Container {
    constructor(params: {
        cfg: OpenPawConfig;
        accountId?: string | null;
        components?: DiscordContainerComponents;
        accentColor?: string;
        spoiler?: boolean;
    });
}
export {};
