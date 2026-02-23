import { describe, expect, it } from "vitest";
import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it.each([
    {
      name: "help flag",
      argv: ["node", "openpaw", "--help"],
      expected: true,
    },
    {
      name: "version flag",
      argv: ["node", "openpaw", "-V"],
      expected: true,
    },
    {
      name: "normal command",
      argv: ["node", "openpaw", "status"],
      expected: false,
    },
    {
      name: "root -v alias",
      argv: ["node", "openpaw", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with profile",
      argv: ["node", "openpaw", "--profile", "work", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with log-level",
      argv: ["node", "openpaw", "--log-level", "debug", "-v"],
      expected: true,
    },
    {
      name: "subcommand -v should not be treated as version",
      argv: ["node", "openpaw", "acp", "-v"],
      expected: false,
    },
    {
      name: "root -v alias with equals profile",
      argv: ["node", "openpaw", "--profile=work", "-v"],
      expected: true,
    },
    {
      name: "subcommand path after global root flags should not be treated as version",
      argv: ["node", "openpaw", "--dev", "skills", "list", "-v"],
      expected: false,
    },
  ])("detects help/version flags: $name", ({ argv, expected }) => {
    expect(hasHelpOrVersion(argv)).toBe(expected);
  });

  it.each([
    {
      name: "single command with trailing flag",
      argv: ["node", "openpaw", "status", "--json"],
      expected: ["status"],
    },
    {
      name: "two-part command",
      argv: ["node", "openpaw", "agents", "list"],
      expected: ["agents", "list"],
    },
    {
      name: "terminator cuts parsing",
      argv: ["node", "openpaw", "status", "--", "ignored"],
      expected: ["status"],
    },
  ])("extracts command path: $name", ({ argv, expected }) => {
    expect(getCommandPath(argv, 2)).toEqual(expected);
  });

  it.each([
    {
      name: "returns first command token",
      argv: ["node", "openpaw", "agents", "list"],
      expected: "agents",
    },
    {
      name: "returns null when no command exists",
      argv: ["node", "openpaw"],
      expected: null,
    },
  ])("returns primary command: $name", ({ argv, expected }) => {
    expect(getPrimaryCommand(argv)).toBe(expected);
  });

  it.each([
    {
      name: "detects flag before terminator",
      argv: ["node", "openpaw", "status", "--json"],
      flag: "--json",
      expected: true,
    },
    {
      name: "ignores flag after terminator",
      argv: ["node", "openpaw", "--", "--json"],
      flag: "--json",
      expected: false,
    },
  ])("parses boolean flags: $name", ({ argv, flag, expected }) => {
    expect(hasFlag(argv, flag)).toBe(expected);
  });

  it.each([
    {
      name: "value in next token",
      argv: ["node", "openpaw", "status", "--timeout", "5000"],
      expected: "5000",
    },
    {
      name: "value in equals form",
      argv: ["node", "openpaw", "status", "--timeout=2500"],
      expected: "2500",
    },
    {
      name: "missing value",
      argv: ["node", "openpaw", "status", "--timeout"],
      expected: null,
    },
    {
      name: "next token is another flag",
      argv: ["node", "openpaw", "status", "--timeout", "--json"],
      expected: null,
    },
    {
      name: "flag appears after terminator",
      argv: ["node", "openpaw", "--", "--timeout=99"],
      expected: undefined,
    },
  ])("extracts flag values: $name", ({ argv, expected }) => {
    expect(getFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "openpaw", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "openpaw", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "openpaw", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it.each([
    {
      name: "missing flag",
      argv: ["node", "openpaw", "status"],
      expected: undefined,
    },
    {
      name: "missing value",
      argv: ["node", "openpaw", "status", "--timeout"],
      expected: null,
    },
    {
      name: "valid positive integer",
      argv: ["node", "openpaw", "status", "--timeout", "5000"],
      expected: 5000,
    },
    {
      name: "invalid integer",
      argv: ["node", "openpaw", "status", "--timeout", "nope"],
      expected: undefined,
    },
  ])("parses positive integer flag values: $name", ({ argv, expected }) => {
    expect(getPositiveIntFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("builds parse argv from raw args", () => {
    const cases = [
      {
        rawArgs: ["node", "openpaw", "status"],
        expected: ["node", "openpaw", "status"],
      },
      {
        rawArgs: ["node-22", "openpaw", "status"],
        expected: ["node-22", "openpaw", "status"],
      },
      {
        rawArgs: ["node-22.2.0.exe", "openpaw", "status"],
        expected: ["node-22.2.0.exe", "openpaw", "status"],
      },
      {
        rawArgs: ["node-22.2", "openpaw", "status"],
        expected: ["node-22.2", "openpaw", "status"],
      },
      {
        rawArgs: ["node-22.2.exe", "openpaw", "status"],
        expected: ["node-22.2.exe", "openpaw", "status"],
      },
      {
        rawArgs: ["/usr/bin/node-22.2.0", "openpaw", "status"],
        expected: ["/usr/bin/node-22.2.0", "openpaw", "status"],
      },
      {
        rawArgs: ["nodejs", "openpaw", "status"],
        expected: ["nodejs", "openpaw", "status"],
      },
      {
        rawArgs: ["node-dev", "openpaw", "status"],
        expected: ["node", "openpaw", "node-dev", "openpaw", "status"],
      },
      {
        rawArgs: ["openpaw", "status"],
        expected: ["node", "openpaw", "status"],
      },
      {
        rawArgs: ["bun", "src/entry.ts", "status"],
        expected: ["bun", "src/entry.ts", "status"],
      },
    ] as const;

    for (const testCase of cases) {
      const parsed = buildParseArgv({
        programName: "openpaw",
        rawArgs: [...testCase.rawArgs],
      });
      expect(parsed).toEqual([...testCase.expected]);
    }
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "openpaw",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "openpaw", "status"]);
  });

  it("decides when to migrate state", () => {
    const nonMutatingArgv = [
      ["node", "openpaw", "status"],
      ["node", "openpaw", "health"],
      ["node", "openpaw", "sessions"],
      ["node", "openpaw", "config", "get", "update"],
      ["node", "openpaw", "config", "unset", "update"],
      ["node", "openpaw", "models", "list"],
      ["node", "openpaw", "models", "status"],
      ["node", "openpaw", "memory", "status"],
      ["node", "openpaw", "agent", "--message", "hi"],
    ] as const;
    const mutatingArgv = [
      ["node", "openpaw", "agents", "list"],
      ["node", "openpaw", "message", "send"],
    ] as const;

    for (const argv of nonMutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(false);
    }
    for (const argv of mutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(true);
    }
  });

  it.each([
    { path: ["status"], expected: false },
    { path: ["config", "get"], expected: false },
    { path: ["models", "status"], expected: false },
    { path: ["agents", "list"], expected: true },
  ])("reuses command path for migrate state decisions: $path", ({ path, expected }) => {
    expect(shouldMigrateStateFromPath(path)).toBe(expected);
  });
});
