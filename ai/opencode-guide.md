# OpenCode

OpenCode is a powerful CLI tool that lets you run AI agents directly from your terminal. It’s great for quick tasks, code generation, and even local code assistance.

It works inside the terminal but allows you to manage AI models, run conversations, and even attach files for context.


## OpenCode CLI Guide

To open the TUI, just run:

```bash
opencode run
```

It will open a terminal UI where you can interact with the AI.

You can also run one-shot commands directly from the terminal without opening the TUI.

```bash
opencode run "{prompt}"
```


`-c` = **continue last session**

So instead of sending the whole prompt again, you can keep chatting with the previous run.

```bash

opencode run "Explain git branches simply"
opencode run -c "Now give an example"

```

It becomes a **terminal AI conversation** instead of one-shot commands. Much smoother.


This is especially useful for quick tasks or when you want to integrate it into scripts.
