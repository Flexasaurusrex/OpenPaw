import type { OpenPawPluginApi } from "openpaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openpaw/plugin-sdk";
import { createSynologyChatPlugin } from "./src/channel.js";
import { setSynologyRuntime } from "./src/runtime.js";

const plugin = {
  id: "synology-chat",
  name: "Synology Chat",
  description: "Native Synology Chat channel plugin for OpenPaw",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenPawPluginApi) {
    setSynologyRuntime(api.runtime);
    api.registerChannel({ plugin: createSynologyChatPlugin() });
  },
};

export default plugin;
