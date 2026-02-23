---
summary: "CLI reference for `openpaw config` (get/set/unset config values)"
read_when:
  - You want to read or edit config non-interactively
title: "config"
---

# `openpaw config`

Config helpers: get/set/unset values by path. Run without a subcommand to open
the configure wizard (same as `openpaw configure`).

## Examples

```bash
openpaw config get browser.executablePath
openpaw config set browser.executablePath "/usr/bin/google-chrome"
openpaw config set agents.defaults.heartbeat.every "2h"
openpaw config set agents.list[0].tools.exec.node "node-id-or-name"
openpaw config unset tools.web.search.apiKey
```

## Paths

Paths use dot or bracket notation:

```bash
openpaw config get agents.defaults.workspace
openpaw config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
openpaw config get agents.list
openpaw config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--strict-json` to require JSON5 parsing. `--json` remains supported as a legacy alias.

```bash
openpaw config set agents.defaults.heartbeat.every "0m"
openpaw config set gateway.port 19001 --strict-json
openpaw config set channels.whatsapp.groups '["*"]' --strict-json
```

Restart the gateway after edits.
