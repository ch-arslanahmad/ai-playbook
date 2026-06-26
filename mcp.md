# MCP

MCP means Model Context Protocol, introduced by Anthropic (Claude).

- It is a standard way for AI models to talk to external tools, devices, or interfaces, allowing for a wide range of applications.
- It defines how the model can send requests and receive responses from these external entities.

These are also called connectors in some platforms.

## How MCP Works

```
┌─────────────┐     MCP     ┌─────────────────┐
│   AI Model  │ ──────────→ │    MCP Server   │
│             │ ←────────── │ (External Tool) │
└─────────────┘   Response  └─────────────────┘
```

1. **MCP Client**: Built into the AI tool (OpenCode, Claude Code, etc.)
2. **MCP Server**: External service that exposes tools/resources
3. **Transport**: stdio (local) or HTTP (remote)

> [!note]
> **Claude Desktop** has no built-in tools for read/write/execute within filesystem, it relies entirely on MCP servers for filesystem, git, bash, etc. In contrast, **Claude Code** and **OpenCode** and other AI-agents ship with native tools (`Read`, `Write`, `Edit`, `Bash`, etc.) and use MCP only for external services (databases, APIs, etc.).
> Learn about [tools](ai/tools.md) here.

The reason I told you about the tools with MCP is that MCP servers are external tools not built-in to the AI model, agent, or harness.

For example, if you want to access a database, perform web scraping, or automate a browser, you would use an MCP server that exposes those capabilities:

- Claude Desktop → uses MCP for filesystem, git, bash, etc.
- OpenCode → uses MCP for external services like databases, APIs, etc.

## Popular MCP Servers

- **Filesystem**: Read/write/execute files, programs (primarily for Claude Desktop)
- [**Context7**](https://context7.com/): Live, version-specific library/framework docs injected directly into AI context. Covers 9,000+ libraries. Prevents hallucinated APIs, functions, features etc.
- **Playwright**: Web browser automation
- **Exa**: Neural web search, code search, also available as a tool in OpenCode (`websearch` tool) & Charm's Crush
- **Firecrawl**: Web scraping, content extraction
- **Puppeteer**: Headless Chrome operations
- [**GitHub MCP**](https://github.com/github/github-mcp-server): Issues, PRs, repos — however installing `gh` CLI is faster & better in most cases.

See more online or on GitHub.

## Configuration

MCP servers are configured per tool & there are 2 types:

- **Local MCP servers:** run on your machine, communicate via stdio
- **Remote MCP servers:** run on a remote machine, communicate via HTTP

The configuration of any MCP regardless of the platform is done in a JSON file, which is usually located in the user's home directory:

| Platform       | Configuration File                                                |
| -------------- | ----------------------------------------------------------------- |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| OpenCode       | `~/.config/opencode/opencode.json`                                |
| Charm's Crush  | `~/.config/crush/crush.json`                                      |

> [!note]
> Unlike Skills, MCPs do not have a unified configuration file or path across platforms. Each platform has its own config file and format. The above table shows the default locations for each platform.

For example, lets install Context7 MCP.

### Context7

**Installation** (persistent global install):

```bash
pnpm add -g ctx7
ctx7 setup
ctx7 setup --opencode
```

Runs OAuth, generates an API key, and auto-adds the entry to `opencode.json`. Choose **MCP server** mode when prompted.

The `ctx7` CLI can also be used with `pnpm dlx ctx7` or `npx ctx7`.

### OpenCode

```json
// ~/.config/opencode/opencode.json
{
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/filesystem"]
    },
    "context7": {
      "type": "remote",
      "enabled": true,
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "sk-..."
      }
    },
    "my-db": {
      "type": "local",
      "enabled": true,
      "command": ["python", "path/to/server.py"]
    }
  }
}
```

`type` is either `"local"` (stdio transport) or `"remote"` (HTTP with `url` + optional `headers`). `enabled` toggles the server on/off.

### Claude Desktop

```json
// %APPDATA%\Claude\claude_desktop_config.json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\username\\Desktop",
        "C:\\Users\\username\\Downloads"
      ]
    }
  }
}
```

---

## Transport: stdio vs Streamable HTTP

MCP supports two transports.
- **stdio** spawns the server as a local child process (dies with client, no port management).
- **Streamable HTTP** runs as a long-lived server (testable with curl, multi-client, needs network config).

| Scenario                        | Transport | Why                           |
| ------------------------------- | --------- | ----------------------------- |
| Local development, personal use | stdio     | Zero config, dies with client |
| Testing MCP tools with curl     | HTTP      | Can send requests manually    |
| Claude web / remote client      | HTTP      | Needs a reachable endpoint    |
| CI/CD pipelines                 | stdio     | No port mgmt, clean lifecycle |
| Shared team server              | HTTP      | Long-lived, multi-client      |
| Learning / debugging MCP        | HTTP      | Inspect requests/responses    |

---


