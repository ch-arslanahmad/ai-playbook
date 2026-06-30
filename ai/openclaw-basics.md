# OpenClaw Basics & CLI Command Reference

> Version observed: 2026.3.13
> Docs checked: [docs.openclaw.ai](https://docs.openclaw.ai)

This is a compact reference for the commands that are actually documented on the current site. When a command grows a lot of flags, the page behind `--help` is the source of truth.

The point of this file is to give a quick overview of the most useful commands without having to search for multiple docs for basic understanding, features, configs etc.

For the most detailed reference, see [openclaw-setup-guide-i-wish-i-had](https://github.com/ishwarjha/openclaw-setup-guide-i-wish-i-had) or for up-to-date info see official docs at [docs.openclaw.ai](https://docs.openclaw.ai).

## OpenClaw Taxonomy

OpenClaw has:

- a Control UI (dashboard)
- a Terminal UI (TUI)

Both are termed as **gateways**.

You can also access via external message services like Discord, Slack, or Telegram. These are called **channels**.

You connect to those channels through the gateway. The gateway handles auth, routing, and model access.

| Term            | Explanation                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Gateway**     | The main service. Runs locally or on a server. Handles all I/O.                                                                       |
| **Channel**     | An external service (Discord, Slack, Telegram) connected to the gateway.                                                              |
| **Agent**       | An AI instance with its own workspace, personality, and memory.                                                                       |
| **Workspace**   | `~/.openclaw/workspace`. Contains SOUL.md, MEMORY.md, and other config files.                                                         |
| **Session**     | A conversation thread. Stored locally as markdown.                                                                                    |
| **Model**       | The LLM powering the agent (OpenAI, Anthropic, Google, etc.).                                                                         |
| **Profile**     | Tool availability preset: `minimal`, `coding`, `messaging`, `full`.                                                                   |
| **Heartbeat**   | Periodic check-in where the agent runs proactive tasks (email, calendar, etc.).                                                       |
| **Dreaming**    | Background memory consolidation. Three phases: light (sort), deep (promote to MEMORY.md), REM (reflect). Opt-in, disabled by default. |
| **Commitments** | Tasks the agent promises to do later. Stored in workspace.                                                                            |
| **Sandbox**     | Isolated execution environment for tools. Docker, SSH, or OpenShell backends.                                                         |
| **Plugin**      | Extends OpenClaw with extra channels, tools, or integrations.                                                                         |
| **Skill**       | Reusable prompt templates and workflows. Installed from the skill marketplace.                                                        |
| **Node**        | Paired iOS or Android device. Provides camera, canvas, location, screen recording.                                                    |
| **Cron**        | Scheduled tasks. Runs agent actions on a timer.                                                                                       |

### Channels

Group chats use mention-based activation. DMs use allowlists and pairing.

### Providers

35+ model providers. Supports OAuth subscription auth, custom endpoints, and self-hosted (Ollama & anything OpenAI/Anthropic-compatible).

## Common Commands

- `openclaw onboard` runs the full guided first-run flow (gateway, model auth, workspace, channels, skills, health). Start here.
- `openclaw dashboard` opens the Control UI.
- `openclaw tui` opens the terminal UI. `chat` and `terminal` are aliases for `openclaw tui --local`.
- `openclaw gateway` runs or manages the Gateway.
- `openclaw logs` tails Gateway logs.
- `openclaw config validate` checks the config file.
- `openclaw channels status --probe` checks live channel connectivity.
- `openclaw sessions` shows stored sessions; it is not a channel health check.

## Gateway

`openclaw gateway` is the main service command. The docs list these entry points:

- `openclaw gateway`
- `openclaw gateway status`
- `openclaw gateway probe`
- `openclaw gateway discover`
- `openclaw gateway call <method>`
- `openclaw gateway install`
- `openclaw gateway start|stop|restart|uninstall`

A few practical rules:

- Use `gateway status` when you want the service and auth state.
- Use `gateway probe` when you want the broader reachability picture.
- Use `gateway call` for low-level RPCs.
- Use `gateway discover` to find other gateways on the network.

## `openclaw pairing`

Handles pairing requests for channel access:

```bash
openclaw pairing list [channel]
openclaw pairing approve [channel] <code>
```

## Models, channels, approvals

`openclaw models` covers model discovery, status, scans, aliases, fallbacks, image fallbacks, and auth helpers.
`openclaw channels` covers list, status, capabilities, resolve, logs, add, remove, login, and logout.
`openclaw approvals` manages exec approvals and allowlists. `openclaw exec-policy` is the local helper that keeps the requested policy and the host approvals file aligned.

## Config, logs, sessions

- `openclaw config validate` checks the active config against the schema.
- `openclaw logs` tails logs. `--follow`, `--json`, `--plain`, and `--local-time` are the common flags.
- `openclaw security audit` checks the setup. `--deep` adds live probes. `--fix` applies remediations automatically. Review what it plans to change before running it.
- `openclaw sessions` lists stored conversation sessions. `openclaw sessions cleanup` runs maintenance.
- `openclaw config get` fails with "Config path not found" for any key that was never explicitly set. Use `openclaw doctor` to see effective values with defaults merged.

## Dreaming

Background memory consolidation. Opt-in, disabled by default.

Three phases run in order:

- light
- REM
- deep.

Only deep promotes to MEMORY.md. A sweep is one full run through all three phases.

| Phase | What it does                                                               |
| ----- | -------------------------------------------------------------------------- |
| Light | Sort and stage recent material                                             |
| REM   | Reflect on themes and patterns                                             |
| Deep  | Score and promote durable candidates, only phase that writes to `MEMORY.md` |

Enable in config (`dreaming.enabled: true`). Default sweep: `0 3 * * *` (3 AM daily).

> [!note]
> Promotion moves short-term candidates into MEMORY.md. The dreaming sweep auto-promotes during its deep phase. You can also run `memory promote` manually anytime, independent of the sweep, to preview and control what gets promoted.

```bash
openclaw memory status              # Check dreaming status
openclaw memory promote             # Preview promotion candidates
openclaw memory promote --apply     # Apply promotions
openclaw memory promote-explain "topic"  # Why it would/wouldn't promote
```

Slash commands: `/dreaming status`, `/dreaming on`, `/dreaming off`.

For full details about memory, context & workspace, see [openclaw-workspace.md](./openclaw-workspace.md).

## Config tools & permissions

See [openclaw-config.md](./openclaw-config.md) for `tools.profile`, `tools.exec`, sandbox config, and `config get` behavior.
