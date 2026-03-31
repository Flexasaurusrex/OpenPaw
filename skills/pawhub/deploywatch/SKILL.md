---
name: deploywatch
description: "GitHub Actions and deployment monitoring. Get notified when builds fail, deploys succeed, or tests break. Use when: managing CI/CD pipelines, tracking deployments, or debugging build failures. NOT for: running CI/CD itself, managing infrastructure, or container orchestration."
metadata:
  {
    "openpaw":
      {
        "emoji": "🚀",
        "requires": { "bins": ["gh", "curl"] },
        "install":
          [
            {
              "id": "npm",
              "kind": "node",
              "package": "@pawhub/deploywatch",
              "bins": ["deploywatch"],
              "label": "Install DeployWatch (npm)",
            },
          ],
        "homepage": "https://pawhub.ai/deploywatch",
      },
  }
---

# DeployWatch

GitHub Actions monitoring with intelligent alerts. Watch repositories for workflow failures, deploy completions, and test breakages — get notified without polling the Actions tab.

## When to Use

- Monitoring GitHub Actions workflows and deployment status
- Getting notified of build/test failures in real time
- Debugging CI/CD issues by inspecting run logs
- Tracking deployments across multiple repositories

## When NOT to Use

- Running CI/CD itself — use GitHub Actions directly
- Managing infrastructure — use Terraform, Pulumi
- Container orchestration — use Kubernetes

## Commands

```bash
# Watch a repository for workflow events
deploywatch add owner/repo

# Remove a watched repository
deploywatch remove owner/repo

# List all watched repositories
deploywatch list

# Configure which events trigger alerts
deploywatch alerts config --on failure,success,timeout

# Show recent workflow runs for a repo
deploywatch runs --repo owner/repo

# Show runs filtered by status
deploywatch runs --repo owner/repo --status failure

# View full logs for a specific run
deploywatch logs <run-id>

# Rerun only the failed jobs in a run
deploywatch rerun <run-id> --failed

# Rerun an entire workflow run
deploywatch rerun <run-id> --all

# Show the diff for the commit that triggered a run
deploywatch diff <run-id>
```

## Alert Configuration

DeployWatch sends alerts based on configurable event types:

| Event | Default | Description |
|-------|---------|-------------|
| `failure` | on | Workflow run failed |
| `success` | off | Workflow run succeeded |
| `timeout` | on | Run exceeded expected duration |
| `cancelled` | off | Run was manually cancelled |

Configure per-repo overrides:

```bash
deploywatch alerts config --repo owner/repo --on failure,timeout --off success
```

## Example Interaction

**User:** Watch my repo: owner/repo

**DeployWatch:**

```
Watching: owner/repo

Active workflows:
  Deploy to production  — last run: 2h ago (success)
  Run tests             — last run: 15m ago (passed)
  Build Docker image    — last run: 3d ago (success)

Alerts enabled: failure, timeout
```

**Later — build failure notification:**

```
BUILD FAILED: owner/repo
Workflow: Run tests
Commit:   def5678 — "feat: add new feature"
Failed:   "Run unit tests"

Error: TypeError: Cannot read property 'foo' of undefined
       at tests/feature.test.js:42:18

Actions:
  deploywatch logs <run-id>
  deploywatch rerun <run-id> --failed
  deploywatch diff <run-id>
```

## Prerequisites

- `gh` CLI authenticated with access to target repositories
- `curl` available on PATH
- Install: `npm install -g @pawhub/deploywatch`
