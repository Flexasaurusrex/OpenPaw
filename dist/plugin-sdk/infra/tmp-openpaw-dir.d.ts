export declare const POSIX_OPENPAW_TMP_DIR = "/tmp/openpaw";
type ResolvePreferredOpenPawTmpDirOptions = {
    accessSync?: (path: string, mode?: number) => void;
    lstatSync?: (path: string) => {
        isDirectory(): boolean;
        isSymbolicLink(): boolean;
        mode?: number;
        uid?: number;
    };
    mkdirSync?: (path: string, opts: {
        recursive: boolean;
        mode?: number;
    }) => void;
    getuid?: () => number | undefined;
    tmpdir?: () => string;
};
export declare function resolvePreferredOpenPawTmpDir(options?: ResolvePreferredOpenPawTmpDirOptions): string;
export {};
