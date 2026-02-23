---
summary: "CLI reference for `openpaw daemon` (legacy alias for gateway service management)"
read_when:
  - You still use `openpaw daemon ...` in scripts
  - You need service lifecycle commands (install/start/stop/restart/status)
title: "daemon"
---

# `openpaw daemon`

Legacy alias for Gateway service management commands.

`openpaw daemon ...` maps to the same service control surface as `openpaw gateway ...` service commands.

## Usage

```bash
openpaw daemon status
openpaw daemon install
openpaw daemon start
openpaw daemon stop
openpaw daemon restart
openpaw daemon uninstall
```

## Subcommands

- `status`: show service install state and probe Gateway health
- `install`: install service (`launchd`/`systemd`/`schtasks`)
- `uninstall`: remove service
- `start`: start service
- `stop`: stop service
- `restart`: restart service

## Common options

- `status`: `--url`, `--token`, `--password`, `--timeout`, `--no-probe`, `--deep`, `--json`
- `install`: `--port`, `--runtime <node|bun>`, `--token`, `--force`, `--json`
- lifecycle (`uninstall|start|stop|restart`): `--json`

## Prefer

Use [`openpaw gateway`](/cli/gateway) for current docs and examples.
