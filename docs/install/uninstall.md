---
summary: "Uninstall OpenPaw completely (CLI, service, state, workspace)"
read_when:
  - You want to remove OpenPaw from a machine
  - The gateway service is still running after uninstall
title: "Uninstall"
---

# Uninstall

Two paths:

- **Easy path** if `openpaw` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
openpaw uninstall
```

Non-interactive (automation / npx):

```bash
openpaw uninstall --all --yes --non-interactive
npx -y openpaw uninstall --all --yes --non-interactive
```

Manual steps (same result):

1. Stop the gateway service:

```bash
openpaw gateway stop
```

2. Uninstall the gateway service (launchd/systemd/schtasks):

```bash
openpaw gateway uninstall
```

3. Delete state + config:

```bash
rm -rf "${OPENPAW_STATE_DIR:-$HOME/.openpaw}"
```

If you set `OPENPAW_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4. Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/.openpaw/workspace
```

5. Remove the CLI install (pick the one you used):

```bash
npm rm -g openpaw
pnpm remove -g openpaw
bun remove -g openpaw
```

6. If you installed the macOS app:

```bash
rm -rf /Applications/OpenPaw.app
```

Notes:

- If you used profiles (`--profile` / `OPENPAW_PROFILE`), repeat step 3 for each state dir (defaults are `~/.openpaw-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `openpaw` is missing.

### macOS (launchd)

Default label is `bot.molt.gateway` (or `bot.molt.<profile>`; legacy `com.openpaw.*` may still exist):

```bash
launchctl bootout gui/$UID/bot.molt.gateway
rm -f ~/Library/LaunchAgents/bot.molt.gateway.plist
```

If you used a profile, replace the label and plist name with `bot.molt.<profile>`. Remove any legacy `com.openpaw.*` plists if present.

### Linux (systemd user unit)

Default unit name is `openpaw-gateway.service` (or `openpaw-gateway-<profile>.service`):

```bash
systemctl --user disable --now openpaw-gateway.service
rm -f ~/.config/systemd/user/openpaw-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `OpenPaw Gateway` (or `OpenPaw Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "OpenPaw Gateway"
Remove-Item -Force "$env:USERPROFILE\.openpaw\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.openpaw-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://openpaw.ai/install.sh` or `install.ps1`, the CLI was installed with `npm install -g openpaw@latest`.
Remove it with `npm rm -g openpaw` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `openpaw ...` / `bun run openpaw ...`):

1. Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2. Delete the repo directory.
3. Remove state + workspace as shown above.
