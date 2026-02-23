---
summary: "Health check steps for channel connectivity"
read_when:
  - Diagnosing WhatsApp channel health
title: "Health Checks"
---

# Health Checks (CLI)

Short guide to verify channel connectivity without guessing.

## Quick checks

- `openpaw status` — local summary: gateway reachability/mode, update hint, linked channel auth age, sessions + recent activity.
- `openpaw status --all` — full local diagnosis (read-only, color, safe to paste for debugging).
- `openpaw status --deep` — also probes the running Gateway (per-channel probes when supported).
- `openpaw health --json` — asks the running Gateway for a full health snapshot (WS-only; no direct Baileys socket).
- Send `/status` as a standalone message in WhatsApp/WebChat to get a status reply without invoking the agent.
- Logs: tail `/tmp/openpaw/openpaw-*.log` and filter for `web-heartbeat`, `web-reconnect`, `web-auto-reply`, `web-inbound`.

## Deep diagnostics

- Creds on disk: `ls -l ~/.openpaw/credentials/whatsapp/<accountId>/creds.json` (mtime should be recent).
- Session store: `ls -l ~/.openpaw/agents/<agentId>/sessions/sessions.json` (path can be overridden in config). Count and recent recipients are surfaced via `status`.
- Relink flow: `openpaw channels logout && openpaw channels login --verbose` when status codes 409–515 or `loggedOut` appear in logs. (Note: the QR login flow auto-restarts once for status 515 after pairing.)

## When something fails

- `logged out` or status 409–515 → relink with `openpaw channels logout` then `openpaw channels login`.
- Gateway unreachable → start it: `openpaw gateway --port 18789` (use `--force` if the port is busy).
- No inbound messages → confirm linked phone is online and the sender is allowed (`channels.whatsapp.allowFrom`); for group chats, ensure allowlist + mention rules match (`channels.whatsapp.groups`, `agents.list[].groupChat.mentionPatterns`).

## Dedicated "health" command

`openpaw health --json` asks the running Gateway for its health snapshot (no direct channel sockets from the CLI). It reports linked creds/auth age when available, per-channel probe summaries, session-store summary, and a probe duration. It exits non-zero if the Gateway is unreachable or the probe fails/timeouts. Use `--timeout <ms>` to override the 10s default.
