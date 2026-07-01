---
title: Decision Log
description: Why certain choices were made and what problem they solve for agents
---

# DECISION.md

## Problem

OpenCode (Claude etc.) or your agent keeps changing its mind, even though a decision was already made. It tends to repeat the same discussion every session, which is frustrating and inefficient.


## Solution

Give it a decision log. Add `DECISION.md` to your project. This file records the choices you already made so that it does not keep relitigating them every session. Use three columns: decision, reason, and date.

So agents know what you already chose & why.

Follow this format or something similar:
```
decision | reason | date
```

For example, use **SQLite** because this is a local prototype or no login system until version II of the project.

This is marked as a decision with reason + date.


## Use Case

At the start of a session, tell your agent to read `project_brief.md` or `DECISION.md` before it plans. Now it knows both the goal and the trade-offs. This matters because AI will happily suggest a cleaner architecture that ruins the thing you actually chose.

A decision log gives it memory with a reason attached. So your starter stack is now simple. `AGENTS.md` for rules, project_brief for the target, and `DECISION.md` for trade-offs. 

> [!tip]
> You should reference an ADR directory (Architectural Decision Record) if you use it within your code base or your project, which is recommended.