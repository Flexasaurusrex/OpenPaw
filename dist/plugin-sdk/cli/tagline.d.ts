declare const DEFAULT_TAGLINE = "All your chats, one OpenPaw.";
declare const TAGLINES: string[];
type HolidayRule = (date: Date) => boolean;
declare const HOLIDAY_RULES: Map<string, HolidayRule>;
export interface TaglineOptions {
    env?: NodeJS.ProcessEnv;
    random?: () => number;
    now?: () => Date;
}
export declare function activeTaglines(options?: TaglineOptions): string[];
export declare function pickTagline(options?: TaglineOptions): string;
export { TAGLINES, HOLIDAY_RULES, DEFAULT_TAGLINE };
