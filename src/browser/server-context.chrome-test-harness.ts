import { vi } from "vitest";
import { installChromeUserDataDirHooks } from "./chrome-user-data-dir.test-harness.js";

const chromeUserDataDir = { dir: "/tmp/openpaw" };
installChromeUserDataDirHooks(chromeUserDataDir);

vi.mock("./chrome.js", () => ({
  isChromeCdpReady: vi.fn(async () => true),
  isChromeReachable: vi.fn(async () => true),
  launchOpenPawChrome: vi.fn(async () => {
    throw new Error("unexpected launch");
  }),
  resolveOpenPawUserDataDir: vi.fn(() => chromeUserDataDir.dir),
  stopOpenPawChrome: vi.fn(async () => {}),
}));
