export type OpenPawVersion = {
    major: number;
    minor: number;
    patch: number;
    revision: number;
};
export declare function parseOpenPawVersion(raw: string | null | undefined): OpenPawVersion | null;
export declare function compareOpenPawVersions(a: string | null | undefined, b: string | null | undefined): number | null;
