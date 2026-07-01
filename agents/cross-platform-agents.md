---
title: Cross-Platform Agents
description: Strategies for building agents that work across multiple AI platforms
---

# Cross-Platform Agents

## Strategy

Write agents in **Claude Code format first**, it's the most portable source. Convert to other platforms when needed.

Alternatively, use **AGENTS.md** as the portable standard (supported by 60+ tools, zero conversion).

Claude Code is the universal source because it has the most conversion tooling. GitHub/VSCode natively reuse `.claude/agents/*.md` in some cases.

---

## Migration

### Claude → OpenCode

| Name                                                  | Description                                                            |
| ----------------------------------------------------- | ---------------------------------------------------------------------- |
| [crosstrain](https://github.com/fwdslsh/crosstrain)   | Converts agents, skills, commands, hooks, MCP servers, and plugins.    |
| [oc-convert](https://github.com/OpeOginni/oc-convert) | Simple Claude → OpenCode only. Converts agents, skills, MCP, settings. |

### Others → OpenCode

| Tool                                                                  | Description                              |
| --------------------------------------------------------------------- | ---------------------------------------- |
| [claude-code-migration](https://github.com/fxp/claude-code-migration) | Migrates sessions, hooks, MCP, env vars. |

---

## AGENTS.md: The Portable Standard

[AGENTS.md](https://agents.md/), write once, run everywhere. Supported by 60+ tools including Codex, Claude Code, OpenCode, Cursor, Windsurf, Aider, Goose, Devin, and more.

Place `AGENTS.md` in your project root. Most tools auto-detect it.

---

## Codex CLI Built-in Migration (v0.128+)

Codex CLI natively imports Claude Code config:

| Source                  | Destination                      |
| ----------------------- | -------------------------------- |
| `CLAUDE.md`             | `AGENTS.md`                      |
| `settings.json`         | `config.toml`                    |
| Skills                  | `.agents/skills/`                |
| Hooks                   | Native hooks                     |
| MCP servers             | `[mcp_servers.*]` in config.toml |
| Sessions (last 30 days) | Codex threads                    |

**Requires:** Codex CLI v0.128.0+

---

## Feature Comparison: What Gets Migrated

| Feature          | agency-agents-zh   | crosstrain              | claude-code-migration              |
| ---------------- | ------------------ | ----------------------- | ---------------------------------- |
| Agents           | Yes (266 built-in) | Yes                     | Yes                                |
| Hooks            | No                 | Yes                     | Yes                                |
| MCP servers      | No                 | Yes                     | Yes                                |
| Skills           | Yes                | Yes                     | Yes                                |
| Sessions         | No                 | No                      | Yes                                |
| Platform targets | 18 platforms       | Claude, OpenCode, +more | Hermes, OpenCode, Cursor, Windsurf |

---

## Pre-Converted Collections

There are also pre-converted agent collections available for reuse. These are often more complete than what you can generate with a converter.

| Repo                                                                             | Contents                                     |
| -------------------------------------------------------------------------------- | -------------------------------------------- |
| [**agency-agents-zh**](https://github.com/jnMetaCode/agency-agents-zh)           | 266 agents, auto-converts to 18 platforms    |
| [**everything-opencode**](https://github.com/monch1962/everything-opencode)      | 16 agents, 25 commands, 24 skills (OpenCode) |
| [**everything-claude-code**](https://github.com/affaan-m/everything-claude-code) | 47 agents (Claude Code source)               |

---
