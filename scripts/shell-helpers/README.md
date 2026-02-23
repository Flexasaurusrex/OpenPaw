# ClawDock <!-- omit in toc -->

Stop typing `docker-compose` commands. Just type `pawock-start`.

Inspired by Simon Willison's [Running OpenPaw in Docker](https://til.simonwillison.net/llms/openpaw-docker).

- [Quickstart](#quickstart)
- [Available Commands](#available-commands)
  - [Basic Operations](#basic-operations)
  - [Container Access](#container-access)
  - [Web UI \& Devices](#web-ui--devices)
  - [Setup \& Configuration](#setup--configuration)
  - [Maintenance](#maintenance)
  - [Utilities](#utilities)
- [Common Workflows](#common-workflows)
  - [Check Status and Logs](#check-status-and-logs)
  - [Set Up WhatsApp Bot](#set-up-whatsapp-bot)
  - [Troubleshooting Device Pairing](#troubleshooting-device-pairing)
  - [Fix Token Mismatch Issues](#fix-token-mismatch-issues)
  - [Permission Denied](#permission-denied)
- [Requirements](#requirements)

## Quickstart

**Install:**

```bash
mkdir -p ~/.pawock && curl -sL https://raw.githubusercontent.com/openpaw/openpaw/main/scripts/shell-helpers/pawock-helpers.sh -o ~/.pawock/pawock-helpers.sh
```

```bash
echo 'source ~/.pawock/pawock-helpers.sh' >> ~/.zshrc && source ~/.zshrc
```

**See what you get:**

```bash
pawock-help
```

On first command, ClawDock auto-detects your OpenPaw directory:

- Checks common paths (`~/openpaw`, `~/workspace/openpaw`, etc.)
- If found, asks you to confirm
- Saves to `~/.pawock/config`

**First time setup:**

```bash
pawock-start
```

```bash
pawock-fix-token
```

```bash
pawock-dashboard
```

If you see "pairing required":

```bash
pawock-devices
```

And approve the request for the specific device:

```bash
pawock-approve <request-id>
```

## Available Commands

### Basic Operations

| Command            | Description                     |
| ------------------ | ------------------------------- |
| `pawock-start`   | Start the gateway               |
| `pawock-stop`    | Stop the gateway                |
| `pawock-restart` | Restart the gateway             |
| `pawock-status`  | Check container status          |
| `pawock-logs`    | View live logs (follows output) |

### Container Access

| Command                   | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `pawock-shell`          | Interactive shell inside the gateway container |
| `pawock-cli <command>`  | Run OpenPaw CLI commands                      |
| `pawock-exec <command>` | Execute arbitrary commands in the container    |

### Web UI & Devices

| Command                 | Description                                |
| ----------------------- | ------------------------------------------ |
| `pawock-dashboard`    | Open web UI in browser with authentication |
| `pawock-devices`      | List device pairing requests               |
| `pawock-approve <id>` | Approve a device pairing request           |

### Setup & Configuration

| Command              | Description                                       |
| -------------------- | ------------------------------------------------- |
| `pawock-fix-token` | Configure gateway authentication token (run once) |

### Maintenance

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `pawock-rebuild` | Rebuild the Docker image                         |
| `pawock-clean`   | Remove all containers and volumes (destructive!) |

### Utilities

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `pawock-health`    | Run gateway health check                  |
| `pawock-token`     | Display the gateway authentication token  |
| `pawock-cd`        | Jump to the OpenPaw project directory    |
| `pawock-config`    | Open the OpenPaw config directory        |
| `pawock-workspace` | Open the workspace directory              |
| `pawock-help`      | Show all available commands with examples |

## Common Workflows

### Check Status and Logs

**Restart the gateway:**

```bash
pawock-restart
```

**Check container status:**

```bash
pawock-status
```

**View live logs:**

```bash
pawock-logs
```

### Set Up WhatsApp Bot

**Shell into the container:**

```bash
pawock-shell
```

**Inside the container, login to WhatsApp:**

```bash
openpaw channels login --channel whatsapp --verbose
```

Scan the QR code with WhatsApp on your phone.

**Verify connection:**

```bash
openpaw status
```

### Troubleshooting Device Pairing

**Check for pending pairing requests:**

```bash
pawock-devices
```

**Copy the Request ID from the "Pending" table, then approve:**

```bash
pawock-approve <request-id>
```

Then refresh your browser.

### Fix Token Mismatch Issues

If you see "gateway token mismatch" errors:

```bash
pawock-fix-token
```

This will:

1. Read the token from your `.env` file
2. Configure it in the OpenPaw config
3. Restart the gateway
4. Verify the configuration

### Permission Denied

**Ensure Docker is running and you have permission:**

```bash
docker ps
```

## Requirements

- Docker and Docker Compose installed
- Bash or Zsh shell
- OpenPaw project (from `docker-setup.sh`)

## Development

**Test with fresh config (mimics first-time install):**

```bash
unset PAWOCK_DIR && rm -f ~/.pawock/config && source scripts/shell-helpers/pawock-helpers.sh
```

Then run any command to trigger auto-detect:

```bash
pawock-start
```
