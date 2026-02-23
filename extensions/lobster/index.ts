import type {
  AnyAgentTool,
  OpenPawPluginApi,
  OpenPawPluginToolFactory,
} from "../../src/plugins/types.js";
import { createCatTool } from "./src/cat-tool.js";

export default function register(api: OpenPawPluginApi) {
  api.registerTool(
    ((ctx) => {
      if (ctx.sandboxed) {
        return null;
      }
      return createCatTool(api) as AnyAgentTool;
    }) as OpenPawPluginToolFactory,
    { optional: true },
  );
}
