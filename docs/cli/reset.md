---
summary: "CLI reference for `openpaw reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `openpaw reset`

Reset local config/state (keeps the CLI installed).

```bash
openpaw reset
openpaw reset --dry-run
openpaw reset --scope config+creds+sessions --yes --non-interactive
```
