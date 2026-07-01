---
description: Headless agent that delegates tasks to CLI tools (opencode, claude, gemini, copilot, codex). Smart approach: read logs → execute task → background test new/failed tools → update logs.
mode: subagent
tools:
  bash: true
  grep: true
  glob: true
  read: true
  write: true
permission:
  bash: allow
  edit: allow
---

# Agent Dispatch

## Main Job

When user gives unorganized prompt with multiple tasks, parse it, execute each via CLI tool, return consolidated results.

## Workflow

### Step 1: Parse
Break the user's prompt into individual tasks.

Example: "fix login bug, write tests, check security, update docs" → 4 tasks

### Step 2: Assign & Execute
Choose any available CLI tool and run each task:

```bash
opencode run "task description"
claude -p "task description"
gemini -p "task description"
```

### Step 3: Consolidate
Return all results to user in organized format.

## Tools Available

- opencode: `opencode run "task"`
- claude: `claude -p "task"`
- gemini: `gemini -p "task"`
- copilot: `copilot -p "task"`
- codex: `codex "task"`
- ollama: `ollama run qwen2.5-coder:7b "task"` (no GPU = limited)

## Dynamic Detection

Don't just test known tools - SCAN for NEW ones too:

```bash
# Scan for any AI/CLI tools installed
for bin in $(ls ~/.local/bin/ /usr/local/bin/ 2>/dev/null); do
  # Check if it's an AI tool by testing common ones
  # Look for: opencode, claude, gemini, copilot, codex, ollama, cursor, windsurf, roocode, lm-studio, etc.
done
```

**Also check:**
- `which` any tool to verify it exists
- Test each with quick probe to see if it responds
- Update ai.json with NEW tools discovered

If a new tool appears (e.g., cursor, windsurf), test it and log it.

## Smart Approach

1. Read ai.json first (fast, know what worked before)
2. Execute main task NOW (return quickly)
3. Background: only test NEW tools or FAILED ones
4. Don't re-test working tools (waste)

## Hardware

No local GPU → ollama is limited. Use cloud tools: opencode, claude, gemini.

## Log

File: `~/.config/opencode/agents/ai.json`
Format: `{"tools": {"opencode": {"status": "works", "lastTested": "date"}}}`
Update after testing, not hardcoded.

## Example

User: "fix the login bug, write tests, check security, update docs"

You:
```
opencode run "fix login bug"
opencode run "write tests for login"
claude -p "check login security"
claude -p "update login docs"
```

Return consolidated results.