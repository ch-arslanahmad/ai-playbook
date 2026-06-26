---
name: opencode
description: "OpenCode CLI reference - docs index, agents, commands"
version: "2.2.0"
---

# OpenCode

Quick reference. Use when user asks about OpenCode features, config, agents, etc.

## Quick Start

```bash
curl -fsSL https://opencode.ai/install | bash
opencode
/connect     # Add provider API key
/init        # Create AGENTS.md
```

**Locations:** Config `~/.config/opencode/opencode.json`, ~/.opencode/, Logs `~/.local/share/opencode/log/`

---

## Documentation Index

Key doc pages for finding any info. See https://opencode.ai/docs/ for full list.

OpenCode Docs `<base>` URL: https://opencode.ai/docs/

| Doc Area            | URL                        | Description                    |
| ------------------- | -------------------------- | ------------------------------ |
| **Config**          | `<base>/config/ `          | JSON config, locations, schema |
| **Tools**           | `<base>/tools/ `           | Built-in tools reference       |
| **Agents**          | `<base>/agents/ `          | Agent configuration            |
| **Commands**        | `<base>/commands/ `        | Custom slash commands          |
| **Skills**          | `<base>/skills/ `          | SKILL.md definitions           |
| **MCP Servers**     | `<base>/mcp-servers/ `     | MCP server setup               |
| **Permissions**     | `<base>/permissions/ `     | Tool permissions               |
| **Themes**          | `<base>/themes/ `          | UI themes                      |
| **Keybinds**        | `<base>/keybinds/ `        | Keyboard shortcuts             |
| **TUI**             | `<base>/tui/ `             | Terminal UI commands           |
| **Formatters**      | `<base>/formatters/ `      | Code formatters                |
| **LSP**             | `<base>/lsp/ `             | LSP server config              |
| **Custom Tools**    | `<base>/custom-tools/ `    | Custom tool creation           |
| **Ecosystem**       | `<base>/ecosystem/ `       | Community plugins              |
| **Troubleshooting** | `<base>/troubleshooting/ ` | Common issues                  |
| **Windows/WSL**     | `<base>/windows-wsl `      | Windows setup                  |
| **Providers**       | `<base>/providers/ `       | LLM providers                  |
| **Zen**             | `<base>/zen`               | Curated models                 |
| **Share**           | `<base>/share`             | Share sessions                 |
| **GitHub**          | `<base>/github/ `          | GitHub integration             |
| **GitLab**          | `<base>/gitlab/ `          | GitLab integration             |
| **Models**          | `<base>/models/`           | Model configuration            |
| **Server**          | `<base>/server/`           | Server config                  |
| **Plugins**         | `<base>/plugins/`          | Plugin dev                     |
| **SDK**             | `<base>/sdk/ `             | Software dev kit               |
| **Network**         | `<base>/network/`          | Network config                 |
| **Enterprise**      | `<base>/enterprise/`       | Enterprise features            |
| **CLI**             | `<base>/cli/ `             | Command-line                   |
| **Web**             | `<base>/web/ `             | Web interface                  |
| **IDE**             | `<base>/ide/ `             | IDE integration                |

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

| Command     | Description        |
| ----------- | ------------------ |
| `/init`     | Initialize project |
| `/undo`     | Undo last change   |
| `/redo`     | Redo               |
| `/share`    | Share conversation |
| `/sessions` | List sessions      |
| `/connect`  | Add provider       |
| `/models`   | List models        |
| `/themes`   | List themes        |
| `/new`      | New session        |

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
