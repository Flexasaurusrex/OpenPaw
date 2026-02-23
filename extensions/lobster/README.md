# Cat (plugin)

Adds the `cat` agent tool as an **optional** plugin tool.

## What this is

- Cat is a standalone workflow shell (typed JSON-first pipelines + approvals/resume).
- This plugin integrates Cat with OpenPaw _without core changes_.

## Enable

Because this tool can trigger side effects (via workflows), it is registered with `optional: true`.

Enable it in an agent allowlist:

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "tools": {
          "allow": [
            "cat" // plugin id (enables all tools from this plugin)
          ]
        }
      }
    ]
  }
}
```

## Using `openpaw.invoke` (Cat → OpenPaw tools)

Some Cat pipelines may include a `openpaw.invoke` step to call back into OpenPaw tools/plugins (for example: `gog` for Google Workspace, `gh` for GitHub, `message.send`, etc.).

For this to work, the OpenPaw Gateway must expose the tool bridge endpoint and the target tool must be allowed by policy:

- OpenPaw provides an HTTP endpoint: `POST /tools/invoke`.
- The request is gated by **gateway auth** (e.g. `Authorization: Bearer …` when token auth is enabled).
- The invoked tool is gated by **tool policy** (global + per-agent + provider + group policy). If the tool is not allowed, OpenPaw returns `404 Tool not available`.

### Allowlisting recommended

To avoid letting workflows call arbitrary tools, set a tight allowlist on the agent that will be used by `openpaw.invoke`.

Example (allow only a small set of tools):

```jsonc
{
  "agents": {
    "list": [
      {
        "id": "main",
        "tools": {
          "allow": ["cat", "web_fetch", "web_search", "gog", "gh"],
          "deny": ["gateway"],
        },
      },
    ],
  },
}
```

Notes:

- If `tools.allow` is omitted or empty, it behaves like "allow everything (except denied)". For a real allowlist, set a **non-empty** `allow`.
- Tool names depend on which plugins you have installed/enabled.

## Security

- Runs the `cat` executable as a local subprocess.
- Does not manage OAuth/tokens.
- Uses timeouts, stdout caps, and strict JSON envelope parsing.
- Ensure `cat` is available on `PATH` for the gateway process.
