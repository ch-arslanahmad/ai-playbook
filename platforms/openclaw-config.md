---
title: OpenClaw Config
description: Configuration reference for OpenClaw settings and options
---

# OpenClaw Config

> Read the official docs for the most current info, this file may lag behind.

Validate config with:

```bash
openclaw config validate
openclaw doctor  # show effective config with defaults merged
```

## Config basics

> [Source: Configuration](https://docs.openclaw.ai/gateway/configuration)

Config lives at `~/.openclaw/openclaw.json` (JSON5 format). If missing, OpenClaw uses safe defaults. The Gateway watches the file and applies changes automatically (hot reload).

Strict validation: unknown keys or invalid values prevent Gateway startup. Only `$schema` is exempt. Run `openclaw doctor --fix` to repair.

### Editing config

```bash
openclaw onboard       # full onboarding flow
openclaw configure     # targeted config wizard
openclaw config set agents.defaults.heartbeat.every "2h"
openclaw config get agents.defaults.workspace
openclaw config unset agents.defaults.heartbeat.every
openclaw config schema          # print config JSON schema
```

Or edit `~/.openclaw/openclaw.json` directly.

---

## Tool profiles

> [Source: Tools](https://docs.openclaw.ai/tools)

`tools.profile` sets which tools the agent can use:

| Profile     | Includes                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `minimal`   | `session_status` only                                                                                                           |
| `coding`    | `group:fs`, `group:runtime`, `group:web`, `group:sessions`, `group:memory`, `cron`, `image`, `image_generate`, `video_generate` |
| `messaging` | `group:messaging`, sessions_list, sessions_history, sessions_send, session_status                                               |
| `full`      | No restriction                                                                                                                  |

```bash
openclaw config set tools.profile coding
```

## Tool allow/deny

Global tool allow/deny policy. Deny wins. Case-insensitive, supports `*` wildcards.

```json
{
  "tools": {
    "allow": ["exec", "read", "write", "edit"],
    "deny": ["browser", "canvas"]
  }
}
```

Tool policy is enforced before the model call. If a tool is denied, the model doesn't see its schema for the turn. Multiple layers can remove tools: global config, per-agent config, channel policy, provider restrictions, sandbox rules, or plugin availability.

## `tools.exec`

Controls exec behavior (timeouts, cleanup, notifications):

```json
{
  "tools": {
    "exec": {
      "backgroundMs": 10000,
      "timeoutSec": 1800,
      "cleanupMs": 1800000,
      "notifyOnExit": true,
      "notifyOnExitEmptySuccess": false,
      "commandHighlighting": false
    }
  }
}
```

## `tools.elevated`

Explicit escape hatch that runs `exec` outside the sandbox. Routes through the Gateway by default, or through the node when the exec target is `node`.

If sandboxing is off, `tools.elevated` doesn't change execution (already on host).

Use for commands that need host access. Use sparingly; this bypasses sandbox isolation.

---

## Sandbox

> [Source: Sandboxing](https://docs.openclaw.ai/gateway/sandboxing)

Runs tool execution in isolated sandbox backends to reduce blast radius. Optional. If off, tools run on the host. Gateway stays on host.

What gets sandboxed: `exec`, `read`, `write`, `edit`, `apply_patch`, `process`.

However the Gateway itself, and `tools.elevated` are not sandboxed.

### Modes, scope, workspace access

| Setting                   | Options                      | Default    |
| ------------------------- | ---------------------------- | ---------- |
| `sandbox.mode`            | `off`, `non-main`, `all`     | `non-main` |
| `sandbox.scope`           | `session`, `agent`, `shared` | `agent`    |
| `sandbox.workspaceAccess` | `none`, `ro`, `rw`           | `none`     |

`non-main` is based on `session.mainKey` (default `"main"`), not agent id. Group/channel sessions count as non-main.

### Backends

| Backend     | Best for                            | Setup                      |
| ----------- | ----------------------------------- | -------------------------- |
| `docker`    | Local dev, full isolation (default) | `scripts/sandbox-setup.sh` |
| `ssh`       | Offloading to a remote machine      | SSH key + target host      |
| `openshell` | Managed remote sandboxes            | OpenShell plugin enabled   |

Docker is the default. Run `scripts/sandbox-setup.sh` before first use. Default containers run with **no network**, override with `sandbox.docker.network`.

### Bind mounts

Add host directories via `sandbox.docker.binds`. Global and per-agent binds are merged. Binds bypass sandbox isolation, OpenClaw blocks dangerous sources (`docker.sock`, `/etc`, `/proc`, `~/.ssh`, etc.). Use `:ro` for sensitive mounts.

### Setup command

`sandbox.docker.setupCommand` runs once after container creation via `sh -lc`. Default network is `"none"`, package installs fail unless you set `docker.network` first.

### Network, overrides, debugging

- `network: "host"` is blocked. `network: "container:<id>"` blocked by default.
- Per-agent overrides: `agents.list[].sandbox` and `agents.list[].tools`.
- `openclaw sandbox list | recreate | explain`

---

## Providers & Fallbacks

> [Source: Configuration](https://docs.openclaw.ai/gateway/configuration)

### Available providers

35+ built-in: `anthropic`, `openai`, `github-copilot` etc.

### Adding providers

```bash
openclaw onboard --auth-choice <provider>
```

### Setting models and fallbacks

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-6",
        "fallbacks": ["openai/gpt-5.4"]
      },
      "models": {
        "anthropic/claude-sonnet-4-6": { "alias": "Sonnet" },
        "openai/gpt-5.4": { "alias": "GPT" }
      }
    }
  }
}
```

Model refs use `provider/model` format. `agents.defaults.models` defines the catalog and acts as the allowlist for `/model`.

### Memory embeddings

Memory search needs an embedding provider. Options:

- `OPENAI_API_KEY`: uses `text-embedding-3-small`
- `GEMINI_API_KEY` / `GOOGLE_API_KEY`
- `VOYAGE_API_KEY`
- Or configure via `agents.defaults.memorySearch.provider`

If none are set, memory search fails silently. If memory feels broken, check that at least one key is set.

It is better to use memory embeddings as they are more efficient (faster) and cheaper than using the model itself for search.

---

## Environment variables

OpenClaw reads env vars from the parent process plus `.env` from the current directory and `~/.openclaw/.env` (global fallback).

Set inline env vars in config:

```bash
openclaw config set env.OPENROUTER_API_KEY "sk-or-..."
openclaw config set env.vars.GROQ_API_KEY "gsk-..."
```

### Secret refs

For sensitive fields, use SecretRef objects with three sources: `env`, `file`, `exec`. See [Secrets](https://docs.openclaw.ai/gateway/secrets) for details.

## Hot reload

The Gateway watches `openclaw.json` and applies changes automatically. Most fields hot-apply without downtime. `gateway.*` and infrastructure (`discovery`, `plugins`) need a restart.

```bash
openclaw config set gateway.reload.mode hybrid
```
