---
summary: "CLI reference for `openpaw agents` (list/add/delete/set identity)"
read_when:
  - You want multiple isolated agents (workspaces + routing + auth)
title: "agents"
---

# `openpaw agents`

Manage isolated agents (workspaces + auth + routing).

Related:

- Multi-agent routing: [Multi-Agent Routing](/concepts/multi-agent)
- Agent workspace: [Agent workspace](/concepts/agent-workspace)

## Examples

```bash
openpaw agents list
openpaw agents add work --workspace ~/.openpaw/workspace-work
openpaw agents set-identity --workspace ~/.openpaw/workspace --from-identity
openpaw agents set-identity --agent main --avatar avatars/openpaw.png
openpaw agents delete work
```

## Identity files

Each agent workspace can include an `IDENTITY.md` at the workspace root:

- Example path: `~/.openpaw/workspace/IDENTITY.md`
- `set-identity --from-identity` reads from the workspace root (or an explicit `--identity-file`)

Avatar paths resolve relative to the workspace root.

## Set identity

`set-identity` writes fields into `agents.list[].identity`:

- `name`
- `theme`
- `emoji`
- `avatar` (workspace-relative path, http(s) URL, or data URI)

Load from `IDENTITY.md`:

```bash
openpaw agents set-identity --workspace ~/.openpaw/workspace --from-identity
```

Override fields explicitly:

```bash
openpaw agents set-identity --agent main --name "OpenPaw" --emoji "🐾" --avatar avatars/openpaw.png
```

Config sample:

```json5
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "OpenPaw",
          theme: "space cat",
          emoji: "🐾",
          avatar: "avatars/openpaw.png",
        },
      },
    ],
  },
}
```
