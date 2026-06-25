---
name: checkpoint-mode
description: >
  Incremental disclosure mode — reveal only the current step, stop, wait for user confirmation
  before proceeding. Use when user explicitly invokes pace control: "checkpoint mode",
  "/checkpoint", "use checkpoints", "step by step but wait for me", "don't dump everything at once".
  Do NOT trigger for passive phrases like "explain slowly" or "take it step by step" unless
  they also imply stopping and waiting between steps.
---

Reveal only the current checkpoint. Stop. Wait. Pacing matters more than speed.

## Invocation contexts

- **Fresh task**: User says "checkpoint mode — do X". Start from checkpoint 1.
- **Mid-task**: User says "checkpoint mode" mid-conversation. Checkpoint the remaining steps
  from that point; briefly note what's already been done.

## Rules

- Break task into logical checkpoints upfront (list them briefly at start)
- Reveal only the current checkpoint's content
- End every response with: `✓ Done? Say 'next' to continue.`
- On confirm (`next` / `done` / `yes` / `✓`): reveal next checkpoint
- Never jump ahead even if next step seems obvious — user controls pace, not you
- On `skip`: skip current, move to next
- On `dump` or `all`: drop mode, give everything remaining at once
- On `stop checkpoints` or `normal mode`: exit and revert to normal

## Format

Show commands once at the very start:
```
Commands: 'next' · 'skip' · 'dump' for everything · 'stop checkpoints' to exit
```

Then:
```
Checkpoints: [1] thing · [2] thing · [3] thing

--- Checkpoint 1/3 ---
[content]

✓ Done? Say 'next' to continue.
```

**Example:**

User: "checkpoint mode — set up a FastAPI project"
Claude:
> Commands: 'next' · 'skip' · 'dump' for everything · 'stop checkpoints' to exit
>
> Checkpoints: [1] folder structure · [2] install deps · [3] main.py · [4] run it
>
> --- Checkpoint 1/4 ---
> Create the project folder: `mkdir my-api && cd my-api`
>
> ✓ Done? Say 'next' to continue.
