#!/usr/bin/env node
import { tool } from "@opencode-ai/plugin"
import { spawn } from "child_process"
import * as fs from "fs"
import * as path from "path"

const MIN_SUCCESS_RATE = 0.7
const AGENTS_MD_PATH = path.join(process.env.HOME || "", "AGENTS.md")
const AI_JSON_PATH = path.join(process.env.HOME || "", ".config/opencode/tools/ai.json")
const AGENTS_AI_JSON_PATH = path.join(process.env.HOME || "", ".config/opencode/agents/ai.json")

interface ToolDef {
  name: string
  cmd: string
  args: string[]
  legacy?: boolean
  strengths?: string[]
}

const HARDCODED_TOOLS: ToolDef[] = [
  { name: "opencode", cmd: "opencode", args: ["run"], strengths: ["code", "refactor", "test", "explain", "debug"] },
  { name: "gemini", cmd: "gemini", args: ["-p"], legacy: true, strengths: ["reasoning", "analysis", "explain"] },
  { name: "claude", cmd: "claude", args: ["-p"], strengths: ["write", "code", "creative", "explain"] },
  { name: "ollama", cmd: "ollama", args: ["run", "qwen2.5-coder:7b"], strengths: ["code", "debug"] },
  { name: "codex", cmd: "codex", args: ["exec"], strengths: ["code", "refactor"] },
  { name: "crush", cmd: "crush", args: ["run"], strengths: ["code", "review"] },
  { name: "copilot", cmd: "copilot", args: ["-p"], strengths: ["code", "explain"] },
  { name: "pi", cmd: "pi", args: ["-p", "--provider", "google"], strengths: ["reasoning", "analysis"] },
  { name: "agent", cmd: "agent", args: ["-p"], strengths: ["code", "debug", "refactor", "test"] },
  { name: "omp", cmd: "omp", args: ["-p"], strengths: ["code", "explain", "reasoning"] },
]

const KNOWN_TOOLS = loadToolConfig()

interface ToolStatus {
  status: string
  success_count: number
  failure_count: number
  lastTested: string | null
}

interface ToolRegistry {
  version: string
  lastUpdated: string
  tools: Record<string, ToolStatus>
}

interface DispatchResult {
  tool: string
  task: string
  success: boolean
  output: string
  error?: string
  durationMs: number
}

const TASK_KEYWORDS: Record<string, string[]> = {
  code: ["write", "implement", "create", "build", "code", "function", "component"],
  refactor: ["refactor", "clean", "restructure", "simplify", "optimize"],
  debug: ["bug", "fix", "error", "crash", "broken", "issue", "debug"],
  test: ["test", "spec", "coverage", "assert"],
  explain: ["explain", "what", "how", "why", "describe", "understand"],
  reasoning: ["reason", "analyze", "compare", "evaluate", "think", "plan"],
  review: ["review", "audit", "check", "inspect"],
  creative: ["design", "style", "ui", "layout", "creative"],
  analysis: ["analyze", "data", "stats", "metrics", "performance"],
}

function scoreToolFit(tool: ToolDef, task: string): number {
  if (!tool.strengths || tool.strengths.length === 0) return 0.5
  const lower = task.toLowerCase()
  let score = 0
  for (const strength of tool.strengths) {
    const keywords = TASK_KEYWORDS[strength]
    if (!keywords) continue
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        score += 1
        break
      }
    }
  }
  return score
}

export default tool({
  description: "Dispatch multiple tasks to available AI CLI tools in parallel, track reliability in ai.json, auto-failover on errors.",
  args: {
    prompt: tool.schema.string().describe("Multi-task prompt (e.g., 'fix login bug, write tests, check security')"),
    mode: tool.schema.string().optional().default("parallel").describe("'parallel' or 'sequential' execution"),
    timeout: tool.schema.number().optional().default(90).describe("Timeout per task in seconds (50-180 recommended for agent CLIs)"),
    maxOutput: tool.schema.number().optional().default(3000).describe("Max output chars per result"),
  },
  async execute(args) {
    const tasks = args.prompt
      .split("\n")
      .flatMap(line => line.split(/[,;]/))
      .map(t => t.trim())
      .filter(t => t.length > 0 && !t.startsWith("#"))
      .map(t => t.replace(/^\d+[\.\)]\s*/, "").trim())

    if (tasks.length === 0) {
      return JSON.stringify({ error: "No tasks found in prompt" })
    }

    const registry = loadRegistry()
    const discovered = await discoverNewTools(registry)
    for (const tool of discovered) {
      registry.tools[tool.name] = {
        status: "unknown", success_count: 0, failure_count: 0, lastTested: null,
      }
    }

    const eligible = getEligibleTools(registry)
    if (eligible.length === 0) {
      return JSON.stringify({
        tasks, count: tasks.length,
        note: "No eligible AI tools found (all below success_rate threshold or broken). Execute each task directly using built-in tools.",
        registry: registry.tools,
      })
    }

    const mode = args.mode === "sequential" ? "sequential" : "parallel"
    const timeoutMs = (args.timeout || 120) * 1000
    const maxOutput = args.maxOutput || 3000
    const results: DispatchResult[] = []
    const now = new Date().toISOString().split("T")[0]

    if (mode === "parallel") {
      const promises = tasks.map((task, i) =>
        executeWithFailover(task, eligible, timeoutMs, registry, now, maxOutput)
      )
      results.push(...(await Promise.all(promises)))
    } else {
      for (const task of tasks) {
        results.push(
          await executeWithFailover(task, eligible, timeoutMs, registry, now, maxOutput)
        )
      }
    }

    saveRegistry(registry)
    cleanupOldTools(registry)

    const legacyTools = KNOWN_TOOLS.filter(t => t.legacy).map(t => t.name)

    return JSON.stringify({
      tasks, count: tasks.length, mode,
      toolsUsed: [...new Set(results.map(r => r.tool))],
      legacyTools: legacyTools.length ? legacyTools : undefined,
      results: results.map(r => ({
        tool: r.tool,
        task: r.task.substring(0, 100),
        success: r.success,
        output: r.output.substring(0, maxOutput),
        error: r.error,
        durationMs: r.durationMs,
      })),
      summary: {
        total: results.length,
        succeeded: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        totalDurationMs: results.reduce((s, r) => s + r.durationMs, 0),
      },
      registry: registry.tools,
    })
  },
})

function loadToolConfig(): ToolDef[] {
  try {
    if (!fs.existsSync(AGENTS_MD_PATH)) return HARDCODED_TOOLS
    const content = fs.readFileSync(AGENTS_MD_PATH, "utf-8")
    const match = content.match(/```json\s+dispatch-tools\s*\n([\s\S]*?)```/)
    if (!match) return HARDCODED_TOOLS
    const parsed = JSON.parse(match[1])
    if (parsed?.tools?.length) return parsed.tools
  } catch { /* fall through */ }
  return HARDCODED_TOOLS
}

function loadRegistry(): ToolRegistry {
  const paths = [AI_JSON_PATH, AGENTS_AI_JSON_PATH]
  for (const p of paths) {
    try {
      if (fs.existsSync(p)) {
        const raw = JSON.parse(fs.readFileSync(p, "utf-8"))
        if (raw.tools) {
          for (const name of Object.keys(raw.tools)) {
            const t = raw.tools[name]
            if ("success_rate" in t) {
              const total = Math.round((t.failures || 0) + (t.success_rate * 10))
              const successes = Math.round(t.success_rate * 10)
              t.success_count = successes
              t.failure_count = total - successes
              delete t.success_rate
            }
            if ("failures" in t && !("failure_count" in t)) {
              t.failure_count = t.failures
              t.success_count = 0
              delete t.failures
            }
          }
        }
        return raw
      }
    } catch { /* try next */ }
  }
  return { version: "1.0", lastUpdated: new Date().toISOString().split("T")[0], tools: {} }
}

function saveRegistry(registry: ToolRegistry) {
  registry.lastUpdated = new Date().toISOString().split("T")[0]
  try {
    const dir = path.dirname(AI_JSON_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(AI_JSON_PATH, JSON.stringify(registry, null, 2))
  } catch { /* silent */ }
}

async function discoverNewTools(registry: ToolRegistry) {
  const discovered: ToolDef[] = []
  for (const t of KNOWN_TOOLS) {
    if (registry.tools[t.name]) continue
    try {
      const exists = await new Promise<boolean>(resolve => {
        const p = spawn("which", [t.cmd], { stdio: "ignore" })
        p.on("close", c => resolve(c === 0))
        p.on("error", () => resolve(false))
      })
      if (exists) discovered.push(t)
    } catch { /* skip */ }
  }
  return discovered
}

function getEligibleTools(registry: ToolRegistry) {
  const isChildDispatch = process.env.OPENCODE_DISPATCH === "1"
  const eligible: ToolDef[] = []
  for (const t of KNOWN_TOOLS) {
    if (isChildDispatch && t.name === "opencode") continue
    const stat = registry.tools[t.name]
    if (!stat) continue
    if (stat.status === "broken") continue
    const total = stat.success_count + stat.failure_count
    const rate = total > 0 ? stat.success_count / total : 0.5
    if (rate < MIN_SUCCESS_RATE && stat.failure_count > 0) continue
    eligible.push(t)
  }
  eligible.sort((a, b) => {
    const statA = registry.tools[a.name]
    const statB = registry.tools[b.name]
    const totalA = statA ? statA.success_count + statA.failure_count : 0
    const totalB = statB ? statB.success_count + statB.failure_count : 0
    const rateA = totalA > 0 ? statA.success_count / totalA : 0.5
    const rateB = totalB > 0 ? statB.success_count / totalB : 0.5
    return rateB - rateA
  })
  return eligible
}

async function executeWithFailover(
  task: string, eligible: ToolDef[], timeoutMs: number,
  registry: ToolRegistry, now: string, maxOutput: number
): Promise<DispatchResult> {
  const scored = eligible.map(t => ({ tool: t, score: scoreToolFit(t, task) }))
  scored.sort((a, b) => b.score - a.score)

  for (let attempt = 0; attempt < scored.length; attempt++) {
    const toolCfg = scored[attempt].tool
    const result = await execTask(task, toolCfg, timeoutMs, maxOutput)
    const stat = registry.tools[toolCfg.name]

    if (result.success) {
      stat.success_count = (stat.success_count || 0) + 1
      stat.failure_count = 0
      stat.lastTested = now
      stat.status = "works"
      return result
    } else {
      stat.failure_count = (stat.failure_count || 0) + 1
      stat.lastTested = now
      stat.status = stat.failure_count >= 5 ? "broken" : stat.failure_count >= 2 ? "unreliable" : "works"
      if (attempt < scored.length - 1) {
        result.error = (result.error || "") + ` | failover to ${scored[attempt + 1].tool.name}`
        continue
      }
      return result
    }
  }

  return {
    tool: "none", task, success: false, output: "",
    error: "All eligible tools failed", durationMs: 0,
  }
}

function execTask(task: string, t: ToolDef, timeoutMs: number, maxOutput: number): Promise<DispatchResult> {
  const start = Date.now()
  return new Promise(resolve => {
    const args = [...t.args, task]
    const child = spawn(t.cmd, args, {
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, OPENCODE_DISPATCH: "1" },
    })

    let stdout = ""
    let stderr = ""
    child.stdout?.on("data", (d: Buffer) => { stdout += d.toString() })
    child.stderr?.on("data", (d: Buffer) => { stderr += d.toString() })

    const timer = setTimeout(() => {
      child.kill("SIGTERM")
      resolve({
        tool: t.name, task, success: false, output: stdout.slice(0, maxOutput),
        error: `Timeout after ${timeoutMs}ms`, durationMs: Date.now() - start,
      })
    }, timeoutMs)

    child.on("close", code => {
      clearTimeout(timer)
      resolve({
        tool: t.name, task,
        success: code === 0,
        output: (stdout || stderr).slice(0, maxOutput),
        error: code !== 0 ? `Exit code: ${code}` : undefined,
        durationMs: Date.now() - start,
      })
    })

    child.on("error", err => {
      clearTimeout(timer)
      resolve({
        tool: t.name, task, success: false, output: "",
        error: err.message, durationMs: Date.now() - start,
      })
    })
  })
}

function cleanupOldTools(registry: ToolRegistry) {
  const knownNames = new Set(KNOWN_TOOLS.map(t => t.name))
  for (const name of Object.keys(registry.tools)) {
    if (!knownNames.has(name)) {
      delete registry.tools[name]
    }
  }
}

// TODO: Progress feedback — tool runs silently, user thinks it's stuck.
// OpenCode tool API is execute→return, no streaming/progress callbacks.
// Workarounds: console.error (logs only), return early (results lost), reduce timeout.
// Real fix needs OpenCode to support progress reporting in tools.
