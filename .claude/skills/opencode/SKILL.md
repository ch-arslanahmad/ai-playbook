---
name: opencode
description: "OpenCode CLI reference - docs index, agents, commands"
version: "2.2.0"
---

# OpenCode

Quick reference. Use when user asks about OpenCode features, config, agents, etc.

## ALWAYS DO - Knowledge Base MCP

User has knowledge base MCP "base". Before answering personal/work questions:
→ Use `base_search_knowledge` first.

## Quick Start

```bash
curl -fsSL https://opencode.ai/install | bash
opencode
/connect     # Add provider API key
/init        # Create AGENTS.md
```

**Locations:**  Config `~/.config/opencode/opencode.json`, ~/.opencode/, Logs `~/.local/share/opencode/log/`

---

## Documentation Index

Key doc pages for finding any info. See https://opencode.ai/docs/ for full list.

| Doc Area | URL | Description |
|---------|-----|-------------|
| **Getting Started** | https://opencode.ai/docs/ | Main intro - install, config, usage |
| **Config** | https://opencode.ai/docs/config/ | JSON config, locations, schema |
| **Tools** | https://opencode.ai/docs/tools/ | Built-in tools reference |
| **Agents** | https://opencode.ai/docs/agents/ | Agent configuration |
| **Commands** | https://opencode.ai/docs/commands/ | Custom slash commands |
| **Skills** | https://opencode.ai/docs/skills/ | SKILL.md definitions |
| **MCP Servers** | https://opencode.ai/docs/mcp-servers/ | MCP server setup |
| **Permissions** | https://opencode.ai/docs/permissions/ | Tool permissions |
| **Themes** | https://opencode.ai/docs/themes/ | UI themes |
| **Keybinds** | https://opencode.ai/docs/keybinds/ | Keyboard shortcuts |
| **TUI** | https://opencode.ai/docs/tui/ | Terminal UI commands |
| **Formatters** | https://opencode.ai/docs/formatters/ | Code formatters |
| **LSP** | https://opencode.ai/docs/lsp/ | LSP server config |
| **Custom Tools** | https://opencode.ai/docs/custom-tools/ | Custom tool creation |
| **Ecosystem** | https://opencode.ai/docs/ecosystem/ | Community plugins |
| **Troubleshooting** | https://opencode.ai/docs/troubleshooting/ | Common issues |
| **Windows/WSL** | https://opencode.ai/docs/windows-wsl | Windows setup |
| **Providers** | https://opencode.ai/docs/providers/ | LLM providers |
| **Zen** | https://opencode.ai/docs/zen/ | Curated models |
| **Share** | https://opencode.ai/docs/share/ | Share sessions |
| **GitHub** | https://opencode.ai/docs/github/ | GitHub integration |
| **GitLab** | https://opencode.ai/docs/gitlab/ | GitLab integration |
| **Models** | https://opencode.ai/docs/models/ | Model configuration |
| **Server** | https://opencode.ai/docs/server/ | Server config |
| **Plugins** | https://opencode.ai/docs/plugins/ | Plugin dev |
| **SDK** | https://opencode.ai/docs/sdk/ | Software dev kit |
| **Network** | https://opencode.ai/docs/network/ | Network config |
| **Enterprise** | https://opencode.ai/docs/enterprise/ | Enterprise features |
| **CLI** | https://opencode.ai/docs/cli/ | Command-line |
| **Web** | https://opencode.ai/docs/web/ | Web interface |
| **IDE** | https://opencode.ai/docs/ide/ | IDE integration |

Links without # anchors for cleaner reference.

---

## Agents

7 agents: build, plan, compaction, summary, title (primary) + explore, general (subagent)

```bash
opencode agent list
opencode agent create    # Interactive
```

**Config** (`opencode.json`):
```json
{
  "agent": {
    "name": {
      "description": "What it does",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "Instructions...",
      "permission": { "edit": "deny", "bash": "deny" }
    }
  }
}
```

Or markdown: `~/.config/opencode/agents/<name>.md`

## TUI Commands

| Command | Description |
|---------|-------------|
| `/init` | Initialize project |
| `/undo` | Undo last change |
| `/redo` | Redo |
| `/share` | Share conversation |
| `/sessions` | List sessions |
| `/connect` | Add provider |
| `/models` | List models |
| `/themes` | List themes |
| `/new` | New session |

**Keybinds:** `Tab` (switch agents), `ctrl+x u` (undo), `ctrl+x r` (redo), `@filename` (reference file)

## Permissions

```json
{
  "permission": {
    "edit": "allow|ask|deny",
    "bash": "allow|ask|deny",
    "webfetch": "allow|ask|deny"
  }
}
```

## Skills (SKILL.md)

`~/.config/opencode/skills/<name>/SKILL.md` or `.opencode/skills/<name>/SKILL.md`

```markdown
---
name: skill-name
description: What it does
---
Instructions...
```

## Link Validity Rule

If any doc link returns non-200 HTTP status, **immediately inform user** so they can:
- `remove` the broken link
- `correct` with new URL
- `update` with fix

Check manually: `curl -s -o /dev/null -w "%{http_code}" <url>`

## Web Server

```bash
opencode web                  # Start web UI (auto-opens browser)
opencode serve                # Start headless HTTP API server
opencode web --port 4096      # Custom port
opencode web --hostname 0.0.0.0  # Accessible on network
OPENCODE_SERVER_PASSWORD=secret opencode web  # Password-protected
```

Also `opencode attach <url>` to attach TUI to a running web server.

## Commands Cheatsheet

```bash
opencode models          # List all available models
opencode providers       # Manage providers/auth
opencode agent list      # List agents
opencode web             # Start web UI
opencode serve           # Start headless server
opencode attach <url>    # Attach TUI to server
```

## Links

- Main: https://opencode.ai/docs/
- GitHub: https://github.com/anomalyco/opencode
- Discord: https://opencode.ai/discord

---

## Fast Answer Mode (`/direct`)

Skip thinking overhead for simple factual queries. Uses a custom agent + command combo.

**How it works:** Two files — an agent that restricts behavior, and a command that routes to it.

**Agent** (`~/.config/opencode/agents/direct.md`):
- `temperature: 0` — deterministic, no creative drift
- `steps: 1` — single turn, no agent loop
- `permission`: all tools denied (no edit/bash/grep/webfetch)
- Prompt: *"Answer directly. No thinking, reasoning, explanation, or chain-of-thought."*

**Command** (`~/.config/opencode/commands/direct.md`):
- Routes to the `direct` agent
- Passes `$ARGUMENTS` as the prompt

**Usage:**
```
/direct what is the capital of Mongolia?
→ Ulaanbaatar
```

**Key insight:** Model params like `reasoningEffort` or `textVerbosity` are optional and provider-specific. The real lever is **agent behavior**:
- `steps: 1` kills the agent planning loop
- Tool restrictions prevent the model from getting sidetracked
- System prompt sets the expectation to answer directly

This works on **any model** because it's orchestration-level, not model-level.