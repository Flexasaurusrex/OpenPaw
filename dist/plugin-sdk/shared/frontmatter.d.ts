export declare function normalizeStringList(input: unknown): string[];
export declare function getFrontmatterString(frontmatter: Record<string, unknown>, key: string): string | undefined;
export declare function parseFrontmatterBool(value: string | undefined, fallback: boolean): boolean;
export declare function resolveOpenPawManifestBlock(params: {
    frontmatter: Record<string, unknown>;
    key?: string;
}): Record<string, unknown> | undefined;
export type OpenPawManifestRequires = {
    bins: string[];
    anyBins: string[];
    env: string[];
    config: string[];
};
export declare function resolveOpenPawManifestRequires(metadataObj: Record<string, unknown>): OpenPawManifestRequires | undefined;
export declare function resolveOpenPawManifestInstall<T>(metadataObj: Record<string, unknown>, parseInstallSpec: (input: unknown) => T | undefined): T[];
export declare function resolveOpenPawManifestOs(metadataObj: Record<string, unknown>): string[];
export type ParsedOpenPawManifestInstallBase = {
    raw: Record<string, unknown>;
    kind: string;
    id?: string;
    label?: string;
    bins?: string[];
};
export declare function parseOpenPawManifestInstallBase(input: unknown, allowedKinds: readonly string[]): ParsedOpenPawManifestInstallBase | undefined;
