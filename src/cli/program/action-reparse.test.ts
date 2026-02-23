import { Command } from "commander";
import { beforeEach, describe, expect, it, vi } from "vitest";

const buildParseArgvMock = vi.fn();
const resolveActionArgsMock = vi.fn();

vi.mock("../argv.js", () => ({
  buildParseArgv: buildParseArgvMock,
}));

vi.mock("./helpers.js", () => ({
  resolveActionArgs: resolveActionArgsMock,
}));

const { reparseProgramFromActionArgs } = await import("./action-reparse.js");

describe("reparseProgramFromActionArgs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    buildParseArgvMock.mockReturnValue(["node", "openpaw", "status"]);
    resolveActionArgsMock.mockReturnValue([]);
  });

  it("uses action command name + args as fallback argv", async () => {
    const program = new Command().name("openpaw");
    const parseAsync = vi.spyOn(program, "parseAsync").mockResolvedValue(program);
    const actionCommand = {
      name: () => "status",
      parent: {
        rawArgs: ["node", "openpaw", "status", "--json"],
      },
    } as unknown as Command;
    resolveActionArgsMock.mockReturnValue(["--json"]);

    await reparseProgramFromActionArgs(program, [actionCommand]);

    expect(buildParseArgvMock).toHaveBeenCalledWith({
      programName: "openpaw",
      rawArgs: ["node", "openpaw", "status", "--json"],
      fallbackArgv: ["status", "--json"],
    });
    expect(parseAsync).toHaveBeenCalledWith(["node", "openpaw", "status"]);
  });

  it("falls back to action args without command name when action has no name", async () => {
    const program = new Command().name("openpaw");
    const parseAsync = vi.spyOn(program, "parseAsync").mockResolvedValue(program);
    const actionCommand = {
      name: () => "",
      parent: {},
    } as unknown as Command;
    resolveActionArgsMock.mockReturnValue(["--json"]);

    await reparseProgramFromActionArgs(program, [actionCommand]);

    expect(buildParseArgvMock).toHaveBeenCalledWith({
      programName: "openpaw",
      rawArgs: undefined,
      fallbackArgv: ["--json"],
    });
    expect(parseAsync).toHaveBeenCalledWith(["node", "openpaw", "status"]);
  });

  it("uses program root when action command is missing", async () => {
    const program = new Command().name("openpaw");
    const parseAsync = vi.spyOn(program, "parseAsync").mockResolvedValue(program);

    await reparseProgramFromActionArgs(program, []);

    expect(resolveActionArgsMock).toHaveBeenCalledWith(undefined);
    expect(buildParseArgvMock).toHaveBeenCalledWith({
      programName: "openpaw",
      rawArgs: [],
      fallbackArgv: [],
    });
    expect(parseAsync).toHaveBeenCalledWith(["node", "openpaw", "status"]);
  });
});
