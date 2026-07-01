# OpenCode Basics

Beginner reference. Load when user is new to OpenCode or asks about basic usage.

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

## Permissions

Controls what OpenCode can do without asking you. Set in `opencode.json`.

Three modes per tool:
- **`allow`** — runs automatically
- **`ask`** — prompts for approval before running
- **`deny`** — blocked entirely

```json
{
  "permission": {
    "bash": "ask",
    "edit": "allow",
    "webfetch": "deny"
  }
}
```

Tools: `read`, `edit`, `bash`, `glob`, `grep`, `webfetch`, `websearch`, `task`, `skill`, `lsp`, `question`, `external_directory`

Granular rules with patterns:
```json
{
  "permission": {
    "bash": {
      "*": "ask",
      "git *": "allow",
      "rm *": "deny"
    }
  }
}
```

Defaults: most tools `allow`, `external_directory` and `doom_loop` `ask`, `.env` files denied for `read`.

Agent permissions override global ones.

## First Run

1. Install: `curl -fsSL https://opencode.ai/install | bash`
2. Run `opencode`
3. `/connect` to add provider API key
4. `/init` to create AGENTS.md

## Tips

- `@filename` — reference a file in your prompt
- `Tab` — switch between agents
- `ctrl+x u` — undo last change
- `ctrl+x r` — redo
