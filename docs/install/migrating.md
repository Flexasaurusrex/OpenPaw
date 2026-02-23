---
summary: "Move (migrate) a OpenPaw install from one machine to another"
read_when:
  - You are moving OpenPaw to a new laptop/server
  - You want to preserve sessions, auth, and channel logins (WhatsApp, etc.)
title: "Migration Guide"
---

# Migrating OpenPaw to a new machine

This guide migrates a OpenPaw Gateway from one machine to another **without redoing onboarding**.

The migration is simple conceptually:

- Copy the **state directory** (`$OPENPAW_STATE_DIR`, default: `~/.openpaw/`) — this includes config, auth, sessions, and channel state.
- Copy your **workspace** (`~/.openpaw/workspace/` by default) — this includes your agent files (memory, prompts, etc.).

But there are common footguns around **profiles**, **permissions**, and **partial copies**.

## Before you start (what you are migrating)

### 1) Identify your state directory

Most installs use the default:

- **State dir:** `~/.openpaw/`

But it may be different if you use:

- `--profile <name>` (often becomes `~/.openpaw-<profile>/`)
- `OPENPAW_STATE_DIR=/some/path`

If you’re not sure, run on the **old** machine:

```bash
openpaw status
```

Look for mentions of `OPENPAW_STATE_DIR` / profile in the output. If you run multiple gateways, repeat for each profile.

### 2) Identify your workspace

Common defaults:

- `~/.openpaw/workspace/` (recommended workspace)
- a custom folder you created

Your workspace is where files like `MEMORY.md`, `USER.md`, and `memory/*.md` live.

### 3) Understand what you will preserve

If you copy **both** the state dir and workspace, you keep:

- Gateway configuration (`openpaw.json`)
- Auth profiles / API keys / OAuth tokens
- Session history + agent state
- Channel state (e.g. WhatsApp login/session)
- Your workspace files (memory, skills notes, etc.)

If you copy **only** the workspace (e.g., via Git), you do **not** preserve:

- sessions
- credentials
- channel logins

Those live under `$OPENPAW_STATE_DIR`.

## Migration steps (recommended)

### Step 0 — Make a backup (old machine)

On the **old** machine, stop the gateway first so files aren’t changing mid-copy:

```bash
openpaw gateway stop
```

(Optional but recommended) archive the state dir and workspace:

```bash
# Adjust paths if you use a profile or custom locations
cd ~
tar -czf openpaw-state.tgz .openpaw

tar -czf openpaw-workspace.tgz .openpaw/workspace
```

If you have multiple profiles/state dirs (e.g. `~/.openpaw-main`, `~/.openpaw-work`), archive each.

### Step 1 — Install OpenPaw on the new machine

On the **new** machine, install the CLI (and Node if needed):

- See: [Install](/install)

At this stage, it’s OK if onboarding creates a fresh `~/.openpaw/` — you will overwrite it in the next step.

### Step 2 — Copy the state dir + workspace to the new machine

Copy **both**:

- `$OPENPAW_STATE_DIR` (default `~/.openpaw/`)
- your workspace (default `~/.openpaw/workspace/`)

Common approaches:

- `scp` the tarballs and extract
- `rsync -a` over SSH
- external drive

After copying, ensure:

- Hidden directories were included (e.g. `.openpaw/`)
- File ownership is correct for the user running the gateway

### Step 3 — Run Doctor (migrations + service repair)

On the **new** machine:

```bash
openpaw doctor
```

Doctor is the “safe boring” command. It repairs services, applies config migrations, and warns about mismatches.

Then:

```bash
openpaw gateway restart
openpaw status
```

## Common footguns (and how to avoid them)

### Footgun: profile / state-dir mismatch

If you ran the old gateway with a profile (or `OPENPAW_STATE_DIR`), and the new gateway uses a different one, you’ll see symptoms like:

- config changes not taking effect
- channels missing / logged out
- empty session history

Fix: run the gateway/service using the **same** profile/state dir you migrated, then rerun:

```bash
openpaw doctor
```

### Footgun: copying only `openpaw.json`

`openpaw.json` is not enough. Many providers store state under:

- `$OPENPAW_STATE_DIR/credentials/`
- `$OPENPAW_STATE_DIR/agents/<agentId>/...`

Always migrate the entire `$OPENPAW_STATE_DIR` folder.

### Footgun: permissions / ownership

If you copied as root or changed users, the gateway may fail to read credentials/sessions.

Fix: ensure the state dir + workspace are owned by the user running the gateway.

### Footgun: migrating between remote/local modes

- If your UI (WebUI/TUI) points at a **remote** gateway, the remote host owns the session store + workspace.
- Migrating your laptop won’t move the remote gateway’s state.

If you’re in remote mode, migrate the **gateway host**.

### Footgun: secrets in backups

`$OPENPAW_STATE_DIR` contains secrets (API keys, OAuth tokens, WhatsApp creds). Treat backups like production secrets:

- store encrypted
- avoid sharing over insecure channels
- rotate keys if you suspect exposure

## Verification checklist

On the new machine, confirm:

- `openpaw status` shows the gateway running
- Your channels are still connected (e.g. WhatsApp doesn’t require re-pair)
- The dashboard opens and shows existing sessions
- Your workspace files (memory, configs) are present

## Related

- [Doctor](/gateway/doctor)
- [Gateway troubleshooting](/gateway/troubleshooting)
- [Where does OpenPaw store its data?](/help/faq#where-does-openpaw-store-its-data)
