import type { ChannelPlugin, OpenPawPluginApi } from "openpaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openpaw/plugin-sdk";
import { ircPlugin } from "./src/channel.js";
import { setIrcRuntime } from "./src/runtime.js";

const plugin = {
  id: "irc",
  name: "IRC",
  description: "IRC channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenPawPluginApi) {
    setIrcRuntime(api.runtime);
    api.registerChannel({ plugin: ircPlugin as ChannelPlugin });
  },
};

export default plugin;
