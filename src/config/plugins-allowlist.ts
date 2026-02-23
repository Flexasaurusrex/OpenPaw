import type { OpenPawConfig } from "./config.js";

export function ensurePluginAllowlisted(cfg: OpenPawConfig, pluginId: string): OpenPawConfig {
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) {
    return cfg;
  }
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  };
}
