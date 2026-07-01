---
title: Skills
description: How skills work, markdown files that teach LLMs specific tasks
---

# Skills

Skills are basically `.md` files which LLMs can read to do a task on a specific topic.

- They are called skills, because the context of the `.md` allows them to do a task with some skill.

For Claude, they are also called `slash commands` (however, they are only a type of slash command, not the only one), because they are invoked with a slash command.

Skills were introduced by Claude, however they are cross-compatible with most AI tools:

- Gemini CLI (now Antigravity), OpenCode, Codex CLI, Cursor, Github Copilot, Charm Crush, Pi / OMP.

To note, the structure of the `.md` file is important, as it allows the LLM to understand the context and how to use the skill. The structure typically includes:

---

## Skill Structure

````markdown
---
name: skill-name
description: What this skill does, 1-2 sentences
origin: ECC (everything claude code repo) / Custom / from-source
---

# Skill Title

Brief overview of what this skill covers.

## When to Activate

Describe scenarios where agent should use this skill. This is critical for auto-activation.

## Core Concepts

Explain key patterns and guidelines.

## Code Examples

Include practical, tested examples:

```typescript
// Well-commented code
```
````

> [!note]
> Here the `origin` field is optional, but recommended. It indicates where the skill came from (e.g., ECC, custom, or from-source).

## Best Practices

- Keep skills focused on one domain/technology
- Include "When to Activate" for auto-activation
- Provide practical, copy-pasteable code examples
- Show anti-patterns (what NOT to do)
- Keep under 500 lines (800 max)
- Use clear section headers
- Link to related skills

## How to Use a Skill

When you want to do a repetitive or a specific task, you can use a skill.

You can use skills available across the web or from a skill repository, or you can create your own skill using the structure above. Most AI agents can generate skills automatically, as the format is standardized. If not, you can use Anthropic's native skill to [generate skills](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md).

Skills can be invoked in two ways:

Skills auto-activate when the AI detects relevant context. Invoke manually:

- **Claude Code**: `/skill-name`
- **OpenCode**: `/skill skill-name`

> [!tip]
> Most follow the Claude way of using a slash command, but some platforms have their own invocation methods. Check the platform's documentation.

---

## Example Skill: code-review

```markdown
---
name: code-review
description: Expert code review focusing on security, performance, and readability
---

# Code Review

You are a senior code reviewer. When this skill is active, review code for:

## Focus Areas

1. **Security**: OWASP Top 10, input validation, auth patterns
2. **Performance**: N+1 queries, memory leaks, unnecessary allocations
3. **Readability**: Naming, complexity > 3 levels deep, comments
4. **Best Practices**: Language idioms, framework conventions

## Output Format

Always structure reviews as:

### Summary

One-line verdict.

### Issues Found

| Severity | File:Line       | Issue              |
| -------- | --------------- | ------------------ |
| Critical | src/auth.ts:42  | SQL injection risk |
| Medium   | src/utils.ts:15 | Unnecessary loop   |

### Suggestions

Optional improvements.

## Anti-Patterns

- Don't suggest changes without explaining _why_
- Don't review generated/test files unless asked
- Don't flag style violations not in project config
```

Use it:

```bash
# In Claude Code or OpenCode:
/code-review Please review src/auth.ts

# Or just ask naturally (auto-detection):
"Review this authentication code for security issues"
```

**Pro tip:** Skills under ~100-200 lines are best. Over 300 and the AI starts ignoring parts.

---

## Tool Mapping for Different Platforms

`~/.claude/skills/` has become a de facto standard, most tools check it for skills.

The table below lists each tool's own directories on top of that:

| Platform    | Invocation                        | Own Skill Directories                              |
| ----------- | --------------------------------- | -------------------------------------------------- |
| Claude Code | `/skill-name` or via tool         | `~/.claude/skills/`                                |
| OpenCode    | `/skill {skill-name}` or via tool | `.opencode/skills/`                                |
| Gemini CLI  | `activate_skill` or via tool      | `~/.gemini/skills/`                                |
| Codex       | `$skill-name` or via tool         | `~/.codex/skills/`, `~/.agents/skills/`            |
| Cursor      | `/skill-name` or via tool         | `.cursor/skills/`, `.agents/skills/`               |
| Copilot     | Auto-loaded or via `/skill`       | `.github/instructions/`, `copilot-instructions.md` |

## Skill Repositories (Curated Collections)

### [Everything Claude Code (ECC)](https://github.com/affaan-m/ecc)

### [awesome-opencode-skills](https://github.com/TheArchitectit/awesome-opencode-skills)

A community skill marketplace with 25+ skills in categories: development, document processing, security, creative, productivity, business/marketing, writing, MCP.

**Notable skills in the collection:**

- `skill-creator` — guides building custom skills
- `code-security-auditor` — static analysis for supply chain risks
- `staff-engineer-review` — deep PR review as Staff+ engineer
- `changelog-generator` — git commits → customer-facing changelogs
- `file-organizer` / `invoice-organizer` — desktop/file organization
- `document-skills/` (docx, pdf, pptx, xlsx) — office document handling
- `mcp-builder` — scaffold MCP servers (Python/TypeScript)

Also ships MCP servers (TS + Python) for managing skills from within OpenCode.

I daily drive OpenCode and have curated a collection of skills. The `awesome-opencode-skills` repo is a curated collection for OpenCode, but you may use it with any other tool as well.

## My Install Skills

- [caveman](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md), to get to-the-point answers and output while saving tokens.
- [humanizer](https://github.com/blader/humanizer/blob/main/SKILL.md), to get humanized answers, output, and to write humanized documents.
- [frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md), to get frontend design-related answers and better-designed thinking & generation of UI/UX.

### Generated by me

- [opencode](.claude/skills/opencode/SKILL.md) — OpenCode reference, configs, features, commands
- [checkpoint-mode](.claude/skills/checkpoint-mode/SKILL.md) — incremental disclosure mode
