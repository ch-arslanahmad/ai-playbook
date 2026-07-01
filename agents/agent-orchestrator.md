---
title: Agent Orchestrator
description: Task dispatcher for routing work to AI CLI tools with failover
---

# Agent Orchestrator

Task dispatcher. Routes work to available AI CLI tools, tracks reliability, auto-failovers on errors. Works with single or multiple tasks, parallel or sequential.

> **Status:** Implemented (tool + agent)

## The Problem

Orchestrators hardcode CLI tools. `opencode`, `claude`, `gemini`, `copilot`. Some not installed. Some auth expired. Some rate limited. Tool fails silently, whole pipeline stuck.

## The Fix

Check what works first. Track it. Use it.
Swap broken ones automatically.

## Original Idea: daemon idea

Original plan was a Python daemon running in background, continuously monitoring tool status. However, I did not think through how agents would call it. The agent would have to call the daemon, which would have to call the tool. Too many moving parts.

```
┌────────────────────────────────────────┐
│  Daemon starts                         │
│       ▼                                │
│  1. Detect installed tools (live)      │
│       ▼                                │
│  2. Test all tools                     │
│       ▼                                │
│  3. Loop every 10s:                    │
│     - Check for new/removed tools      │
│     - Re-test working tools (60s)      │
│     - Retry failed tools (5min)        │
│       ▼                                │
│  4. Update reliability scores          │
│       ▼                                │
│  5. Auto-failover on failure           │
│       ▼                                │
│  6. Pick best tool for task            │
└────────────────────────────────────────┘
```

While implementing the tool, realized we only dispatch when we have a task. No need for background monitoring.

Deleted daemon. Kept tool.

## Architecture: Tool & Agent

The orchestrator should be a **tool**, but also an agent/subagent. Across all major platforms:

No need for a subagent inherently — the process is deterministic, probabilistic commands are handled by the invoker LLM already.

But we still need (sub)agent for cross-platform.

Made agent definitions too:

- `~/.claude/agents/agentDispatch.md`, Claude Code
- `~/.config/opencode/agents/agentDispatch.md`, OpenCode

Fallback for platforms that don't support custom tools.

## Workflow

Works with any number of tasks, single or multiple. Parallel is default and preferred.

### Step 1: Parse

Break prompt into tasks.

`"fix login bug, write tests, check security, update docs"` → 4 tasks

Single task works too, if explicitly called for it.

### Step 2: Assign & Execute

Read `ai.json` for reliability, pick best tool per task, execute:

> `ai.json` lives alongside `agentDispatch.ts` at `~/.config/opencode/tools/ai.json`. Created automatically on first run.

```bash
opencode run "fix login bug"
claude -p "check login security"
```

### Step 3: Consolidate

Return all results in organized format.

## Tool Routing

First version picked random tools. Broke often: ollama with no models downloaded, gemini hitting rate limits, copilot with expired auth. The tool would fail silently, everything would feel broken.

Added reliability tracking. Every execution updates `ai.json`:

```json
{
  "tools": {
    "opencode": { "status": "works", "success_count": 19, "failure_count": 1 },
    "ollama": { "status": "broken", "success_count": 3, "failure_count": 7 }
  }
}
```

- Routing reads this first, knows what worked before.
- Filters by success rate > 0.7, picks by keyword match to task (code, debug, refactor, etc.), falls back to highest success rate regardless of type.

### Auto-Failover

If chosen tool fails, increments failures, removes from eligible set, retries with next best option. If all tools fail or a tool fails 3-5 times, alerts user.

| Tool    | Common Issue         | What happened                   |
| ------- | -------------------- | ------------------------------- |
| ollama  | No models downloaded | Tried to run, silent failure    |
| gemini  | Rate limits          | Worked yesterday, blocked today |
| copilot | Auth issues          | Token expired, no error message |

## Supported Tools

```bash
opencode run "task" --print-logs
claude -p "task"
crush run "task" --yolo       # Crush = AI CLI tool, similar to opencode
copilot -p "task" --allow-all-tools
gemini -p "task" --output-format json
codex "task"
openclaw agent "task"
pi -p "task" --provider google
ollama run qwen2.5-coder:7b "task"
```

## Implementation

**File:** `~/.config/opencode/tools/agentDispatch.ts`

The core loop is simple: parse tasks → discover tools → execute → update registry. But each step had to be figured out.

### Guardrails

For now, no guardrails.

- No max task count, no blacklist, no allowlist, any task pattern allowed. Trust the user to know what they're doing.

## Summon as subagent

When you need dispatch as a subagent (not tool), call it directly:

```
Agent(
  subagent_type="agentDispatch",
  prompt="find best tool for complex task"
)
```

Works in OpenCode. For Claude Code, use the agent definition at `~/.claude/agents/agentDispatch.md`, however it needs a change of frontmatter.

## Future ideas

### ACPs

Recently heard about Agent Context Protocols (ACPs). Agents share context and state without a full MCP server. Could solve the cross-platform dispatch problem simpler than maintaining separate tool + agent definitions.

Haven't tried it yet. Worth exploring. Might make this whole tool unnecessary.

### Summon specific agent

Instead of dispatching to the best available tool, let the user pin a specific one:

```
Agent(
  subagent_type="agentDispatch",
  prompt="use only codex for this task"
)
```

Or: "only gemini", "only claude", "only opencode".

If tool not available, error tells you what's missing. No silent failures.

### Per-task preferences

Let user set preferred tool per task type. Code tasks → opencode. Creative tasks → claude. Reasoning → gemini. Tool learns from history.

### Known issues

- **No progress feedback.** Tool runs silently, user thinks it's stuck. OpenCode tool API is execute→return, no streaming or progress callbacks. Workarounds exist but none are clean. Waiting for OpenCode to support progress reporting in tools.
