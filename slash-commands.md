# Slash Commands

A slash command can be platform-specific as well while some platforms do not have slash commands like Charm's Crush.

While, A slash command can be:


While a slash command can be:
- a skill (like `/ask` or `/refine`)
- a MCP prompt (like `/mcp-name {args}`)
- a built-in command (like `/btw`, `help`, `/skills` in Claude Code)
- a custom command file (like `/refine` in OpenCode)

In some cases, it can trigger agents, subagents, tools, MCPs etc or they can act as an alias for a bigger prompt..


Before,

```bash
/review this code for security issues
```

After,

```bash
You are a senior video production reviewer. You have been given a prompt that is about to be sent to HeyGen's Video Agent API for one-shot video generation. This is a one-shot API — there is no back-and-forth. The prompt must be as good as possible on the first attempt.

Your job: review this prompt objectively and provide a professional assessment. Be specific. Be critical. Don't rubber-stamp.

# this code for security issues
```

This especially happens inside OpenCode.

> [!important]
> You can create a MCP prompt which in certain platforms can act as a slash command.

## OpenCode

You can define your own slash commands without a skill as well, which may be flagged as `subtask` in the `.md` file.

- [OpenCode Commands Documentation](https://opencode.ai/docs/commands/)

