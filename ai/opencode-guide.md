# OpenCode

OpenCode is a powerful CLI tool that lets you run AI agents directly from your terminal. It’s great for quick tasks, code generation, and even local code assistance.

It works inside the terminal but allows you to manage AI models, run conversations, and even attach files for context.

> [!note]
> Verify any command and for comprehensive help,
> ```bash
> opencode run --help
> ```
## OpenCode CLI Guide

To open the TUI, just run:

```bash
opencode run
```

It will open a terminal UI where you can interact with the AI.

You can also run one-shot commands directly from the terminal without opening the TUI.

```bash
opencode run "$prompt"
opencode run $prompt
```

`-c` = **continue last session**

So instead of starting over, you can continue from where you left off.

```bash

opencode run "Explain git branches simply"
opencode run -c "Now give an example"

```

It becomes a **terminal AI conversation** instead of one-shot commands. Much smoother.

This is especially useful for quick tasks or when you want to integrate it into scripts.

## Scripting with OpenCode

On the topic of scripts, you can also use it in a more structured way with the `--format json` flag, which outputs the response in JSON format, making it easier to parse and use in other tools.

```bash
opencode run "Introduce how knowing github, gitlab and version control is nothing special" --format json
```
or

```bash
opencode run --format json "Introduce how knowing github, gitlab and version control is nothing special"
```

### API OpenCode (scripting, dev tools, etc)

```bash
opencode run 'say "Hello, World!"' --format json | jq -c 'select(.type=="text") | {result: .part.text}'
```

The output will be,

```output
{"result":"Hello, World!"}
```

# Link Files/Folders for Context

Run the agent **inside a project directory**:

```bash
opencode run --dir . # run inside the directory
opencode run --dir ~/projects/myapp "Explain this codebase" # run inside the specific directory
```

You can also attach files:

```bash
opencode run "Explain how this program works" -f main.rs -f Cargo.toml # attach specific files for context 
```

Now it behaves like a **local code assistant**. It can read your files, understand the codebase, and give you insights and help you with coding tasks.


## OpenCode tools

Find all the tools available in OpenCode with:

```bash
opencode --tools
```

![OpenCode Tools](opencode-tools.png)

## Export Context

You can export chat context in two ways:

1. **From TUI** (inside OpenCode): `/export` - exports as Markdown
2. **From CLI**: `opencode export [sessionID]` - exports as JSON

If no session ID is provided, you'll be prompted to select a session.
