import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "openpaw",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "openpaw", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "openpaw", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "openpaw", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "openpaw", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "openpaw", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "openpaw", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it.each([
    ["--dev first", ["node", "openpaw", "--dev", "--profile", "work", "status"]],
    ["--profile first", ["node", "openpaw", "--profile", "work", "--dev", "status"]],
  ])("rejects combining --dev with --profile (%s)", (_name, argv) => {
    const res = parseCliProfileArgs(argv);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join(path.resolve("/home/peter"), ".openpaw-dev");
    expect(env.OPENPAW_PROFILE).toBe("dev");
    expect(env.OPENPAW_STATE_DIR).toBe(expectedStateDir);
    expect(env.OPENPAW_CONFIG_PATH).toBe(path.join(expectedStateDir, "openpaw.json"));
    expect(env.OPENPAW_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      OPENPAW_STATE_DIR: "/custom",
      OPENPAW_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.OPENPAW_STATE_DIR).toBe("/custom");
    expect(env.OPENPAW_GATEWAY_PORT).toBe("19099");
    expect(env.OPENPAW_CONFIG_PATH).toBe(path.join("/custom", "openpaw.json"));
  });

  it("uses OPENPAW_HOME when deriving profile state dir", () => {
    const env: Record<string, string | undefined> = {
      OPENPAW_HOME: "/srv/openpaw-home",
      HOME: "/home/other",
    };
    applyCliProfileEnv({
      profile: "work",
      env,
      homedir: () => "/home/fallback",
    });

    const resolvedHome = path.resolve("/srv/openpaw-home");
    expect(env.OPENPAW_STATE_DIR).toBe(path.join(resolvedHome, ".openpaw-work"));
    expect(env.OPENPAW_CONFIG_PATH).toBe(
      path.join(resolvedHome, ".openpaw-work", "openpaw.json"),
    );
  });
});

describe("formatCliCommand", () => {
  it.each([
    {
      name: "no profile is set",
      cmd: "openpaw doctor --fix",
      env: {},
      expected: "openpaw doctor --fix",
    },
    {
      name: "profile is default",
      cmd: "openpaw doctor --fix",
      env: { OPENPAW_PROFILE: "default" },
      expected: "openpaw doctor --fix",
    },
    {
      name: "profile is Default (case-insensitive)",
      cmd: "openpaw doctor --fix",
      env: { OPENPAW_PROFILE: "Default" },
      expected: "openpaw doctor --fix",
    },
    {
      name: "profile is invalid",
      cmd: "openpaw doctor --fix",
      env: { OPENPAW_PROFILE: "bad profile" },
      expected: "openpaw doctor --fix",
    },
    {
      name: "--profile is already present",
      cmd: "openpaw --profile work doctor --fix",
      env: { OPENPAW_PROFILE: "work" },
      expected: "openpaw --profile work doctor --fix",
    },
    {
      name: "--dev is already present",
      cmd: "openpaw --dev doctor",
      env: { OPENPAW_PROFILE: "dev" },
      expected: "openpaw --dev doctor",
    },
  ])("returns command unchanged when $name", ({ cmd, env, expected }) => {
    expect(formatCliCommand(cmd, env)).toBe(expected);
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("openpaw doctor --fix", { OPENPAW_PROFILE: "work" })).toBe(
      "openpaw --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("openpaw doctor --fix", { OPENPAW_PROFILE: "  jbopenpaw  " })).toBe(
      "openpaw --profile jbopenpaw doctor --fix",
    );
  });

  it("handles command with no args after openpaw", () => {
    expect(formatCliCommand("openpaw", { OPENPAW_PROFILE: "test" })).toBe(
      "openpaw --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm openpaw doctor", { OPENPAW_PROFILE: "work" })).toBe(
      "pnpm openpaw --profile work doctor",
    );
  });
});
