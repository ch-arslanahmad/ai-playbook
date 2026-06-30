# OpenClaw Workspace & Memory

Sources: [Agent workspace](https://docs.openclaw.ai/concepts/agent-workspace) · [Memory](https://docs.openclaw.ai/concepts/memory) · [SOUL.md](https://docs.openclaw.ai/concepts/soul) · [Dreaming](https://docs.openclaw.ai/concepts/dreaming) · [Commitments](https://docs.openclaw.ai/concepts/commitments) · [System prompt](https://docs.openclaw.ai/concepts/system-prompt)

> Read the official docs for the most current info, this file may lag behind.

## Workspace location

> [Source: Agent workspace](https://docs.openclaw.ai/concepts/agent-workspace)

Default: `~/.openclaw/workspace`. Override with `openclaw config set agents.defaults.workspace "~/.openclaw/workspace"`. If `OPENCLAW_PROFILE` is set and not `"default"`, the default becomes `~/.openclaw/workspace-<profile>`.

## Workspace file map

| File                 | Purpose                                       | Loaded                     |
| -------------------- | --------------------------------------------- | -------------------------- |
| AGENTS.md            | Operating instructions for the agent          | Every session              |
| SOUL.md              | Persona, tone, and boundaries                 | Every session              |
| USER.md              | Who the user is and how to address them       | Every session              |
| IDENTITY.md          | Agent's name, vibe, and emoji                 | Every session              |
| TOOLS.md             | Notes about local tools and conventions       | Every session              |
| HEARTBEAT.md         | Optional tiny checklist for heartbeat runs    | When heartbeats fire       |
| BOOT.md              | Optional startup checklist on gateway restart | On restart                 |
| BOOTSTRAP.md         | One-time first-run ritual                     | First run only             |
| MEMORY.md            | Curated long-term memory                      | Main session only          |
| memory/YYYY-MM-DD.md | Daily memory logs                             | On demand via memory tools |
| DREAMS.md            | Dream Diary and dreaming summaries            | Human review               |
| skills/              | Workspace-specific skills                     | When invoked               |
| canvas/              | Canvas UI files for node displays             | When used                  |

**AGENTS.md**, operating rules, not personality. **SOUL.md**, voice, tone, opinions, boundaries. **IDENTITY.md**, name and vibe. **HEARTBEAT.md**, optional checklist, keep short. **BOOTSTRAP.md**, one-time first-run ritual, delete after. Run `openclaw onboard` to trigger setup, see [openclaw-basics.md](./openclaw-basics.md).

---

## Memory System

> [Source: Memory overview](https://docs.openclaw.ai/concepts/memory)

OpenClaw remembers by writing plain Markdown. No hidden state, only what's saved to disk.

**MEMORY.md**, long-term memory, durable facts and preferences. **memory/YYYY-MM-DD.md**, daily notes, auto-loaded for today and yesterday. **DREAMS.md**, optional dream diary summaries.

The agent distills useful material from daily notes into MEMORY.md over time. If MEMORY.md grows too large, OpenClaw truncates the in-context copy.

### Memory tools

- **memory_search**, semantic search across notes
- **memory_get**, read specific memory file or line range

### Action-sensitive memories

Notes involving approval requirements, temporary constraints, handoffs, expiry conditions, or instructions to avoid an action. Capture what changes future behavior, when it applies, when it expires.

### Inferred commitments

Short-lived follow-up memories. OpenClaw infers them in a hidden pass, scopes to agent and channel, delivers through heartbeat.

Enable: `openclaw config set commitments.enabled true` / `openclaw config set commitments.maxPerDay 3`

Manage: `openclaw commitments` / `openclaw commitments --all` / `openclaw commitments dismiss cm_abc123`

### Memory backends

| Backend | Description |
|---------|-------------|
| Builtin | SQLite-based, keyword + vector + hybrid search. Default. |
| QMD | Local sidecar with reranking, query expansion |
| Honcho | Cross-session memory with user modeling |
| LanceDB | LanceDB-backed with Ollama support |

### Dreaming

> [Source: Dreaming](https://docs.openclaw.ai/concepts/dreaming)

Dreaming is an optional background consolidation pass for memory. Disabled by default.

When enabled, it collects short-term signals, scores candidates, and promotes only qualified items into long-term memory (MEMORY.md). Designed to keep long-term memory high signal.

| Phase | Purpose                                   | Writes to MEMORY.md |
| ----- | ----------------------------------------- | ------------------- |
| Light | Sort and stage recent short-term material | No                  |
| Deep  | Score and promote durable candidates      | Yes                 |
| REM   | Reflect on themes and recurring ideas     | No                  |

Phases run in order: light → REM → deep. Each sweep covers all configured agent workspaces, deduped by path.

Dreaming also writes a Dream Diary in DREAMS.md for human review. Only grounded memory snippets are eligible to promote into MEMORY.md.

Enable: `openclaw config set plugins.entries.memory-core.config.dreaming.enabled true`

Default cadence: `0 3 * * *` (3 AM daily). Slash commands: `/dreaming status`, `/dreaming on`, `/dreaming off`.

### Memory CLI

```bash
openclaw memory status              # Check index status and provider
openclaw memory status --deep       # Detailed status including dreaming
openclaw memory search "query"      # Search from the command line
openclaw memory index --force       # Rebuild the index
openclaw memory promote             # Preview promotion candidates
openclaw memory promote --apply     # Apply promotions
openclaw memory promote --limit 5   # Limit number of promotions
openclaw memory promote-explain "topic"  # Explain why a candidate would or would not promote
```
