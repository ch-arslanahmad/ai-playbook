# OpenCode CLI Commands

Detailed command reference. Load when user asks about specific CLI commands or flags.

## Headless Run

Run OpenCode non-interactively. Most useful command.

```bash
opencode run "summarize this file"
opencode run -m anthropic/claude-sonnet-4-20250514 "explain this code"
opencode run -c "now also check the tests"              # Continue last session
opencode run -f src/main.py "review this file"          # Attach files
opencode run -f src/*.ts --format json "find bugs"      # JSON output
opencode run --agent explore "find all API endpoints"   # Use specific agent
```

**Key flags:** `-m` (model), `-c` (continue), `-s` (specific session), `-f` (file), `--format json`, `--dangerously-skip-permissions`

## Sessions

```bash
opencode session list
opencode run -s <sessionID> "follow up question"
opencode export <sessionID> --sanitize    # Redact secrets before sharing
```

## Models

```bash
opencode models                          # List all
opencode models anthropic                # Filter by provider
```

## Stats

```bash
opencode stats                           # All-time
opencode stats --days 30                 # Last 30 days
opencode stats --project ""              # Current project only
```

## MCP Servers

```bash
opencode mcp list                        # List servers
opencode mcp add                         # Interactive setup
```

## Debugging

```bash
opencode debug config                    # Show resolved config (most useful)
opencode debug skill                     # List available skills
```

## Web Server

```bash
opencode web                  # Start web UI (auto-opens browser)
opencode serve                # Start headless HTTP API server
opencode web --port 4096      # Custom port
opencode web --hostname 0.0.0.0  # Accessible on network
OPENCODE_SERVER_PASSWORD=secret opencode web  # Password-protected
opencode attach <url>         # Attach TUI to running web server
```
