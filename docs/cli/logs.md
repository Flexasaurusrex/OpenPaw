---
summary: "CLI reference for `openpaw logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
title: "logs"
---

# `openpaw logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
openpaw logs
openpaw logs --follow
openpaw logs --json
openpaw logs --limit 500
openpaw logs --local-time
openpaw logs --follow --local-time
```

Use `--local-time` to render timestamps in your local timezone.
