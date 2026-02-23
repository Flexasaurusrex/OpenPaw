import type { OpenPawConfig } from "../config/config.js";

export function setPluginEnabledInConfig(
  config: OpenPawConfig,
  pluginId: string,
  enabled: boolean,
): OpenPawConfig {
  return {
    ...config,
    plugins: {
      ...config.plugins,
      entries: {
        ...config.plugins?.entries,
        [pluginId]: {
          ...(config.plugins?.entries?.[pluginId] as object | undefined),
          enabled,
        },
      },
    },
  };
}
