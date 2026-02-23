import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  resolveDefaultConfigCandidates,
  resolveConfigPathCandidate,
  resolveConfigPath,
  resolveOAuthDir,
  resolveOAuthPath,
  resolveStateDir,
} from "./paths.js";

describe("oauth paths", () => {
  it("prefers OPENPAW_OAUTH_DIR over OPENPAW_STATE_DIR", () => {
    const env = {
      OPENPAW_OAUTH_DIR: "/custom/oauth",
      OPENPAW_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.resolve("/custom/oauth"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join(path.resolve("/custom/oauth"), "oauth.json"),
    );
  });

  it("derives oauth path from OPENPAW_STATE_DIR when unset", () => {
    const env = {
      OPENPAW_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.join("/custom/state", "credentials"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join("/custom/state", "credentials", "oauth.json"),
    );
  });
});

describe("state + config path candidates", () => {
  async function withTempRoot(prefix: string, run: (root: string) => Promise<void>): Promise<void> {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
    try {
      await run(root);
    } finally {
      await fs.rm(root, { recursive: true, force: true });
    }
  }

  function expectOpenPawHomeDefaults(env: NodeJS.ProcessEnv): void {
    const configuredHome = env.OPENPAW_HOME;
    if (!configuredHome) {
      throw new Error("OPENPAW_HOME must be set for this assertion helper");
    }
    const resolvedHome = path.resolve(configuredHome);
    expect(resolveStateDir(env)).toBe(path.join(resolvedHome, ".openpaw"));

    const candidates = resolveDefaultConfigCandidates(env);
    expect(candidates[0]).toBe(path.join(resolvedHome, ".openpaw", "openpaw.json"));
  }

  it("uses OPENPAW_STATE_DIR when set", () => {
    const env = {
      OPENPAW_STATE_DIR: "/new/state",
    } as NodeJS.ProcessEnv;

    expect(resolveStateDir(env, () => "/home/test")).toBe(path.resolve("/new/state"));
  });

  it("uses OPENPAW_HOME for default state/config locations", () => {
    const env = {
      OPENPAW_HOME: "/srv/openpaw-home",
    } as NodeJS.ProcessEnv;
    expectOpenPawHomeDefaults(env);
  });

  it("prefers OPENPAW_HOME over HOME for default state/config locations", () => {
    const env = {
      OPENPAW_HOME: "/srv/openpaw-home",
      HOME: "/home/other",
    } as NodeJS.ProcessEnv;
    expectOpenPawHomeDefaults(env);
  });

  it("orders default config candidates in a stable order", () => {
    const home = "/home/test";
    const resolvedHome = path.resolve(home);
    const candidates = resolveDefaultConfigCandidates({} as NodeJS.ProcessEnv, () => home);
    const expected = [
      path.join(resolvedHome, ".openpaw", "openpaw.json"),
      path.join(resolvedHome, ".openpaw", "pawbot.json"),
      path.join(resolvedHome, ".openpaw", "moldbot.json"),
      path.join(resolvedHome, ".openpaw", "pawbot.json"),
      path.join(resolvedHome, ".pawbot", "openpaw.json"),
      path.join(resolvedHome, ".pawbot", "pawbot.json"),
      path.join(resolvedHome, ".pawbot", "moldbot.json"),
      path.join(resolvedHome, ".pawbot", "pawbot.json"),
      path.join(resolvedHome, ".moldbot", "openpaw.json"),
      path.join(resolvedHome, ".moldbot", "pawbot.json"),
      path.join(resolvedHome, ".moldbot", "moldbot.json"),
      path.join(resolvedHome, ".moldbot", "pawbot.json"),
      path.join(resolvedHome, ".pawbot", "openpaw.json"),
      path.join(resolvedHome, ".pawbot", "pawbot.json"),
      path.join(resolvedHome, ".pawbot", "moldbot.json"),
      path.join(resolvedHome, ".pawbot", "pawbot.json"),
    ];
    expect(candidates).toEqual(expected);
  });

  it("prefers ~/.openpaw when it exists and legacy dir is missing", async () => {
    await withTempRoot("openpaw-state-", async (root) => {
      const newDir = path.join(root, ".openpaw");
      await fs.mkdir(newDir, { recursive: true });
      const resolved = resolveStateDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(newDir);
    });
  });

  it("falls back to existing legacy state dir when ~/.openpaw is missing", async () => {
    await withTempRoot("openpaw-state-legacy-", async (root) => {
      const legacyDir = path.join(root, ".pawbot");
      await fs.mkdir(legacyDir, { recursive: true });
      const resolved = resolveStateDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(legacyDir);
    });
  });

  it("CONFIG_PATH prefers existing config when present", async () => {
    await withTempRoot("openpaw-config-", async (root) => {
      const legacyDir = path.join(root, ".openpaw");
      await fs.mkdir(legacyDir, { recursive: true });
      const legacyPath = path.join(legacyDir, "openpaw.json");
      await fs.writeFile(legacyPath, "{}", "utf-8");

      const resolved = resolveConfigPathCandidate({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(legacyPath);
    });
  });

  it("respects state dir overrides when config is missing", async () => {
    await withTempRoot("openpaw-config-override-", async (root) => {
      const legacyDir = path.join(root, ".openpaw");
      await fs.mkdir(legacyDir, { recursive: true });
      const legacyConfig = path.join(legacyDir, "openpaw.json");
      await fs.writeFile(legacyConfig, "{}", "utf-8");

      const overrideDir = path.join(root, "override");
      const env = { OPENPAW_STATE_DIR: overrideDir } as NodeJS.ProcessEnv;
      const resolved = resolveConfigPath(env, overrideDir, () => root);
      expect(resolved).toBe(path.join(overrideDir, "openpaw.json"));
    });
  });
});
