# OpenCode Plugins

Learn more about [OpenCode Plugins.](https://opencode.ai/docs/plugins/)

Plugins extend OpenCode with custom tools, hooks, and integrations. Add to `"plugin"` array in `opencode.json`.

## Configuring Plugins

Add to `opencode.json` (local `.opencode/` or global `~/.config/opencode/`):

```json
{
  "plugin": [
    "opencode-agent-skills",
    "superpowers@git+https://github.com/obra/superpowers.git",
    "@zenobius/opencode-skillful"
  ]
}
```

OpenCode auto-installs npm plugins (by default) on startup.

Git URL plugins auto-install too Format is, `<name>@git+<url>` (e.g. `superpowers@git+https://github.com/obra/superpowers.git`)

## Installed Plugins

### opencode-agent-skills

- **Repo:** [joshuadavidthomas/opencode-agent-skills](https://github.com/joshuadavidthomas/opencode-agent-skills)
- **Unique:** Auto skill matching (semantic detection), compaction resilience, `run_skill_script`

### Superpowers

- **Repo:** [obra/superpowers](https://github.com/obra/superpowers)
- **Unique:** Full dev methodology (brainstorming → TDD → subagent-driven development)
- **Strict mode:** `export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`
  - Forces Superpowers prompt injection on session start + after compaction
  - Without it: skills available but NOT auto-triggered
- **Verify:** Ask OpenCode `"Tell me about your superpowers"`
- **Use:** `"I want to build X"` → auto-triggers full workflow

### @zenobius/opencode-skillful

- **Repo:** [@zenobius/opencode-skillful](https://www.npmjs.com/package/@zenobius/opencode-skillful)
- **Unique:** `skill_find` (natural language search, UNIQUE - not in others), lazy loading

### opentmux

- **Repo:** [opentmux/opentmux](https://github.com/AnganSamadder/opentmux)
- **Unique:** Terminal multiplexer for OpenCode sessions, manage multiple sessions in one terminal window

Installed via the pnpm, `pnpm install -g opentmux`, then run opentmux in terminal to manage sessions.

## Quick Usage

**Enable Superpowers:** `export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true && opencode`. Better yet add to `.bashrc` or `.zshrc`.
**OpenTmux:** `opentmux`, then use normally , it will open opencode in tmux and you can manage multiple sessions in one terminal window.

## Popular Community Plugins

- [skillz](https://github.com/intellectronica/skillz) - MCP server exposing skills to any MCP client
- [Oh-my-OpenAgent](https://github.com/code-yeongyu/oh-my-openagent)
