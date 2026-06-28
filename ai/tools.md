# Tools

Tools are deterministic functions the LLM can call during a session, defined schemas, one input, one output, no autonomy.

For example:

- `read("file.py")` → returns file content.
- `bash("git status")` → returns stdout.

Built-in tools ship with the platform. However they are limited in functionality. A custom local tool can validate inputs, hide auth details, or enforce domain logic that `bash` can't.

MCP tools are runtime plugins. OpenCode also defines custom tools via TypeScript/JS files in the `.opencode/tools/` folder.

Subagent spawning is itself a tool. Claude Code has a Task tool, Gemini CLI uses `invoke_agent`, OpenCode has agents in config. All invoked the same way: the LLM calls the agent, passes a task, gets results back.

## Tools vs MCP

**Tools** are built into the platform or defined as code files.

**MCP** is a protocol for registering external tools with the LLM. It requires a running server. See [mcp.md](../mcp.md) for how it works, configuration, and transport.

| Category   | Tools                                               | MCP                                            |
| ---------- | --------------------------------------------------- | ---------------------------------------------- |
| Definition | Functions the LLM calls                             | Protocol to expose functions                   |
| Location   | Built-in or code files (`.opencode/tools/`, config) | External servers, local processes, remote APIs |
| Scope      | Platform-specific                                   | Cross-platform standard                        |
| Examples   | `bash`, `read`, `edit`, `grep`                      | Database queries, Jira, Slack, custom APIs     |
| Dependency | Part of the agent runtime                           | Requires a separate server process             |

> [!note]
> It is better to use tools in the following order,
>
> - built-in tool then
> - installable CLI tools
> - MCPs as its crossplatform & extensive feature
> - only use local tools when strictly needed.

The LLM doesn't know or care if a tool is built-in or came via MCP, it just calls it.

---

## Custom Local Tools (Without MCP)

Some platforms let you define custom tools directly, no MCP server required. For platforms that don't, **MCP is the fallback**.

| Platform    | Custom Local Tools | How                                                                 |
| ----------- | ------------------ | ------------------------------------------------------------------- |
| OpenCode    | **Yes**            | `.opencode/tools/` via raw `.ts` or via SDK (`@opencode-ai/plugin`) |
| Cursor      | **Yes** (v3.7+)    | `local.customTools` on `Agent.create()`, inline, session-scoped     |
| Claude Code | **No**             | MCP                                                                 |
| Crush       | **No**             | MCP                                                                 |
| Copilot     | **No**             | MCP or extensions                                                   |
| Codex       | **No**             | MCP                                                                 |
| Gemini      | **No**             | MCP                                                                 |

> [!tip]
> If your platform isn't in the table above, assume it requires MCP for custom tools.

### OpenCode

Create a `.ts` file in `.opencode/tools/`:

```typescript
import { tool } from "@opencode-ai/plugin";

export default tool({
  description: "Query the project database",
  args: { query: tool.schema.string().describe("SQL query to execute") },
  async execute(args) {
    return `Executed: ${args.query}`;
  },
});
```

- Docs: [opencode.ai/docs/plugins](https://opencode.ai/docs/plugins)
- Repo: [github.com/anomalyco/opencode](https://github.com/anomalyco/opencode)

### Cursor

Cursor SDK (v3.7+) passes tools inline to `Agent.create()`:

```typescript
Agent.create({
  local.customTools: [{
    name: "myTool",
    description: "Does something",
    parameters: { type: "object", properties: { ... } },
    execute: async (args) => { return result }
  }]
})
```

- Docs: [cursor.com/docs/custom-tools](https://cursor.com/docs/custom-tools) (SDK v3.7+, June 2026)
- Repo: [github.com/getcursor/cursor](https://github.com/getcursor/cursor)

### Claude Code

No native custom tools. Use MCP or encode workflows as [skills](../skills.md):

- Docs: [docs.anthropic.com/en/docs/claude-code/skills](https://docs.anthropic.com/en/docs/claude-code/skills)
- MCP setup: [mcp.md](../mcp.md)

---
