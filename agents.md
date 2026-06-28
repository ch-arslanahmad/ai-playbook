# Agents & Subagents

## What Are Agents?

Agents are specialized AI assistants that can be invoked to handle specific tasks.

All the popular platforms have their own version of agents, generically there is,

- `plan` agent
- `build` agent

Some popular platform that allows us to create custom primary agents,

- **OpenCode** — Tab picker, `--agent`
- **GitHub Copilot** — agent picker

The following have subagents or session modes\*\* (no swappable primary mid-session):

- **Cursor** — subagents via Task tool; built-in modes (Ask, Plan, Agent, Debug). See [Cursor](#cursor) below.
- **Claude Code** — start as primary with `--agent` (startup only); delegate with `@name`. For example,

```bash
claude --agent agent-name
```

> [!note]
> In Claude Code, there is only one term, `agents` which can act as primary and subagent.

## Subagents

Subagents are delegated workers for subtasks, spawned by the main agent. Each spawn has ~10K fixed token overhead. Use them when context isolation matters or the work exceeds ~10K input tokens. Otherwise, stay inline in the main agent.

**When to use subagents:**

- Context isolation matters (reviewer shouldn't see implementation details)
- Work is large enough to justify the overhead (~10K+ tokens)
- Parallel independent tasks (fan-out)

**When to stay inline:**

- Fewer than ~8 files with predictable edits
- Simple, sequential work
- Context between steps matters

**Highest-leverage pattern:** Scout (cheap model) explores the codebase, Act (capable model) writes the code. Fan-out for parallel independent work. Inline for small, predictable changes.

See platform-specific sections below for how each tool spawns subagents.

---

## Taxonomy

| Term                    | Meaning                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| **Primary**             | Owns the chat thread                                                |
| **Subagent**            | Delegated worker for a subtask                                      |
| **Mode / skill / rule** | Built-in persona or project customization (not a custom agent file) |

**Skills and rules**: [skills.md](skills.md), platform sections below.

---

## Agent .md Format: Claude Code vs OpenCode

Almost all agents use `.md` files with YAML frontmatter, but the structure differs.

### Claude Code Format

`~/.claude/agents/code-reviewer.md`:

```markdown
---
name: code-reviewer
description: Expert code reviewer focusing on security, performance, and readability
tools: Read, Glob, Grep
model: sonnet
---

You are a senior code reviewer...
```

**Invoke:**

```bash
# As session primary:
claude --agent code-reviewer

# As subagent (mid-session):
@code-reviewer Please review src/auth.ts
```

### OpenCode Format

`~/.config/opencode/agents/code-reviewer.md`:

```markdown
---
description: Expert code reviewer for security, performance, readability
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
tools:
  read: true
  grep: true
  glob: true
  write: false
  edit: false
permission:
  edit: deny
  write: deny
---

You are a senior code reviewer...
```

Here `temperature` means random/creative the LLM's output is
**Invoke:**

```bash
# As session primary:
opencode --agent code-reviewer

# As subagent (mid-session):
@code-reviewer Please review src/auth.ts
```

> [!note]
> Both are `.md` files but they are not interchangeable. Claude Code format is more widely supported — tools like [crosstrain](https://github.com/fwdslsh/crosstrain) and [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) can convert Claude Code agents to other platforms. The reverse direction has little to no support. Write in Claude Code format first, convert when needed. See [cross-platform-agents.md](cross-platform-agents.md) for the full workflow.

---

## Agent vs skill vs AGENTS.md vs tools

For isolated context / parallel work / specialist model!

- **subagent**

Single-shot repeatable workflow in the same thread?

- [**skill**](skills.md)

Always-on project conventions, context, rules.

- rule / **AGENTS.md** / CLAUDE.md / `.cursor/rules/`

A specialist agent needed for the whole session? like `plan` & `build`?

- primary agent (if platform supports it, see [Platform Overview](#platform-overview) below; can also be emulated via subagents)

Require a tool to do a specific task, deterministic rather than probabilistic, `database` tool for managing a local database, `search` tool for searching a locally, `websearch` for searching the web.

- Use a `tool` as they are deterministic, most commonly, we use external tools, via MCP, to do a specific task. See [mcp.md](mcp.md) for more details.

---

## Creating Your First Agent

You define the agent's purpose, tools, and behavior in a `.md` file with frontmatter. See [Agent .md Format](#agent-md-format-claude-code-vs-opencode) above for the exact structure.

```bash
# Both platforms:
@code-reviewer review src/auth.ts

# Claude Code (session primary):
claude --agent code-reviewer

# OpenCode (session primary):
opencode --agent code-reviewer
```

> [!note]
> If you want to create a cross-platform way or want to migrate your existing agent to another platform, see [cross-platform-agents.md](cross-platform-agents.md) for the full workflow.

## Platform Comparison

| Platform    | Term              | Invocation                     | Config File                                                |
| ----------- | ----------------- | ------------------------------ | ---------------------------------------------------------- |
| OpenCode    | Agent/Subagents   | `@agent-name`, Tab, `--agent`  | `~/.config/opencode/agents/`, `opencode.json`, `AGENTS.md` |
| Claude Code | Agent             | `@agent-name`, Task, `--agent` | `~/.claude/agents/`, `.claude/agents/`                     |
| Copilot     | Custom agents     | Agent picker, `@name`          | `.github/agents/*.agent.md`, `~/.copilot/agents/`          |
| Gemini      | Session           | Separate session               | `GEMINI.md`                                                |
| Codex       | Subagent          | Explicit prompt, `/agent` CLI  | `.codex/agents/*.toml`, `~/.codex/agents/`                 |
| Cursor      | Agent + subagents | Task tool; modes in UI         | `.cursor/agents/`, rules, skills                           |
| Crush       | Single agent      | `agent` tool (search)          | `crush.json`, skills, MCP, hooks                           |

---

## Platform Overview

| Platform          | Custom primary                    | Custom subagent               | Config                                            |
| ----------------- | --------------------------------- | ----------------------------- | ------------------------------------------------- |
| OpenCode          | Yes                               | Yes                           | `~/.config/opencode/agents/`, `opencode.json`     |
| Claude Code       | Partial (`--agent` at start only) | Yes                           | `~/.claude/agents/`                               |
| Copilot / VS Code | Yes                               | Yes                           | `.github/agents/*.agent.md`, `~/.copilot/agents/` |
| Cursor            | No                                | Yes                           | `.cursor/agents/`, rules, skills, hooks           |
| Gemini            | Separate sessions                 | Separate sessions             | `GEMINI.md`                                       |
| Codex             | Yes                               | Yes                           | `.codex/agents/*.toml`, `~/.codex/agents/`        |
| Crush             | No                                | No (search-only `agent` tool) | Skills, MCP, hooks                                |

### Cursor

One primary per chat. Modes:

- Ask (read-only Q&A)
- Plan (read-only design)
- Agent (full tools)
- Debug (investigation)

#### Subagents

Spawned via Task tool with `subagent_type`, self-contained prompt. Foreground (block) or background (parallel OK). Custom: `.cursor/agents/*.md`, invoke with `/name`.

- Config: `.cursor/rules/`, `.cursor/skills/` (auto-load on task match), `.cursor/hooks.json`, `~/.cursor/cli-config.json`.

### Codex

One orchestrator session; subagents spawn only when you ask explicitly.
Built-in: `default`, `worker`, `explorer`.

Custom agents: `.codex/agents/<name>.toml` (in TOML, oddly).

> [!note]
> Codex can swap agent into a different primary agent mid-session. A custom agent like `openwork` can run as a spawned subagent, or it can be the primary by using, `/agent`

---

## Cross-Platform Patterns

### Testing Agent Compatibility

To make an agent work across platforms:

1. Remove platform-specific jargon
2. Use generic tool names in instructions
3. Test in each platform
4. Create in Claude format first, convert with [crosstrain](https://github.com/fwdslsh/crosstrain) or [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh), see [cross-platform-agents.md](cross-platform-agents.md)
