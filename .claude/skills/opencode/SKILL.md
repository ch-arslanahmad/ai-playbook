---
name: opencode
description: "OpenCode CLI reference — docs index, agents, commands, config. Use when user asks about OpenCode features, setup, configuration, or usage."
version: "2.3"
---

# OpenCode

Quick reference. Use when user asks about OpenCode features, config, agents, etc.

## References

- `references/basics.md` — TUI commands, permissions, first run, tips
- `references/cli-commands.md` — headless run, sessions, models, stats, MCP, debugging, web server


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

## Keybinds

`Tab` (switch agents), `ctrl+x u` (undo), `ctrl+x r` (redo), `@filename` (reference file)

## Skills (SKILL.md)

**Preferred:** `~/.claude/skills/<name>/SKILL.md` (universal, works across tools)

Also: `~/.config/opencode/skills/<name>/SKILL.md` or `.opencode/skills/<name>/SKILL.md`

## Link Validity Rule

If any doc link returns non-200 HTTP status, **immediately inform user** so they can:

- `remove` the broken link
- `correct` with new URL
- `update` with fix

Check manually: `curl -s -o /dev/null -w "%{http_code}" <url>`

## Self-Improvement Rule

When using this skill, if you see documentation that is incorrect, outdated, or lacking — fix it directly. Update the reference files or SKILL.md as needed. Don't just report issues, correct them.
