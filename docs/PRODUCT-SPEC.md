# Product Spec: Dexa — General-purpose AI agent as a cloud service (Sonnet + TypeScript stack)

This spec covers a **general-purpose agent** that can work across both **code repositories** (Claude Code-style) and **business applications** (calendar, CRM, email, etc.) via MCP integrations. The agent can orchestrate multi-step workflows, generate one-time code when needed, and produce outputs for human review.

---

## 0) Product definition

**You are building:** a hosted "general-purpose agent runtime" that can:

- Receive any request and **resolve it** — agent selects relevant sources (repos, apps, services) from connected integrations
- Support **multi-source tasks**: a single session can span code repos AND business apps (e.g., "check calendar, cross-ref CRM, draft follow-up emails")
- Spin up an isolated workspace, connect to relevant sources, and deliver output as:
  - **Code**: linked PRs/branches across affected repos
  - **Business**: drafts, calendar events, CRM updates — staged for human approval
  - A run log + reproducible session you can resume/rewind
- Generate **one-time code** when no existing tool fits (data transformation, cross-referencing, etc.)
- Expose multiple clients (Web UI, CLI, IDE, API) against the _same_ running session (OpenCode-style server/client split). ([OpenCode][1])

**Example workflows:**

| Domain   | Task                                                               | Sources                                | Output                          |
| -------- | ------------------------------------------------------------------ | -------------------------------------- | ------------------------------- |
| Code     | "Update API contract in backend + client types in frontend"        | GitHub repos                           | Linked PRs                      |
| Business | "Ensure all customer meetings this week have follow-ups scheduled" | Calendar, CRM, Email, Meeting recorder | Draft emails + calendar invites |
| Hybrid   | "Analyze support tickets, identify top bugs, file GitHub issues"   | Zendesk, GitHub                        | Issues created                  |

**Core capabilities:**

- **MCP as primary integration layer**: connect to any app (Calendar, CRM, Email, GitHub, Slack, DBs, etc.) via MCP servers
- **Code tools** (Claude Code parity): Read/Edit/Write/Grep/Glob/Bash for repo work ([Claude Code][2])
- **One-time code execution**: agent can write + run ephemeral scripts for data transformation, cross-referencing, etc.
- **Human-in-the-loop approvals**: configurable per tool, per output type, or both
- Permission modes: `default`, `acceptEdits`, `plan`, `bypassPermissions`. ([Claude Code][3])
- Hierarchical settings + enterprise policy overrides. ([Claude Code][2])
- Memory model: CLAUDE.md + `.claude/rules/` modular + path-scoped rules. ([Claude Code][4])
- Subagents with separate context windows + built-in Plan/General-purpose. ([Claude Code][5])
- Hooks (deterministic lifecycle/tool hooks; can allow/deny/ask). ([Claude Code][6])
- Plugins with marketplaces (agents/commands/skills/hooks/MCP servers). ([Claude Code][2])
- Checkpointing + rewind. ([Claude Code][7])
- Headless / automation mode + resumable sessions. ([Claude Code][8])

---

## 1) System architecture

### 1.1 High-level components

**A) Control Plane (multi-tenant)**

- Orgs, users, auth (OAuth per integration)
- **Integration Registry**: orgs connect sources — repos (GitHub), apps (Calendar, CRM, Email), services (Slack, DBs)
- Agent selects relevant integrations based on task (see §8.5)
- Policy/config registry (org/project/user/local equivalents)
- Billing/rate limiting, audit log

**B) Session Orchestrator**

- Owns session state machine and agent loop
- Selects relevant integrations (repos, apps, services) based on task; provisions workspace
- Emits events (tool requested, permission required, output ready for review, checkpoint created, etc.)
- Stores transcripts and artifacts (tagged by source)

**C) Workspace Runtime (per session, multi-source capable)**

- **Isolated execution** via Daytona, Firecracker, or gVisor (see §8.5 for comparison)
- One workspace per session; repos cloned + MCP connections established
- Toolchain bootstrap (universal image) ([Claude Code][9])
- **One-time code execution**: agent can write + run ephemeral Python/JS/TS for data processing
- Tool Host APIs: file ops, shell, git, web, MCP, notebook edits

**D) Tool Gateway**

- Normalizes tool schemas, permission checks, hooks, logging
- Supports:
  - **MCP tools** (primary integration layer): Calendar, CRM, Email, Slack, DBs, etc.
  - **Code tools** (Claude Code parity): Read/Edit/Write/Grep/Glob/Bash ([Claude Code][2])
  - **Ephemeral code tool**: write + execute one-time scripts in sandbox

**E) Client Layer**

- Web app (Next.js)
- CLI client (Bun)
- IDE extensions (VS Code / JetBrains style parity) ([Claude Code][10])
- Optional: Slack + GitHub Checks/Actions integration ([Claude Code][11])

### 1.2 OpenCode-inspired server split (recommended)

Adopt an OpenCode-like architecture where the "engine" is a headless HTTP server exposing an OpenAPI surface; clients attach to it. ([OpenCode][1])

This unlocks:

- Web UI + CLI + IDE all controlling the same run
- "Attach to running session" and "resume later" without hacks
- SDK generation for your platform (agent-as-a-service)

---

## 2) Core agent loop (how you deliver on intent)

### 2.1 Mode-aware execution (Claude Code parity)

- **Plan mode**: read-only analysis, uses a Plan subagent pattern (no edits/exec). ([Claude Code][3])
- **Execute mode**:
  - Maintain TODO plan (TodoWrite) ([Claude Code][2])
  - Make minimal, targeted edits (Edit/Write)
  - Verify by running commands/tests (Bash) with sandboxing and permission gating ([Claude Code][2])
- **Accept Edits mode**: batch-approve edits while still prompting for side-effect commands (prompt fatigue mitigation). ([Claude Code][3])
- **Bypass permissions**: supported but can be policy-disabled. ([Claude Code][2])

### 2.2 Built-in delegation (Task/Subagents)

- Subagents run in their **own context window**, returning distilled results to the main thread. ([Claude Code][5])
- Include built-ins equivalent to Claude Code:
  - **Plan** (read-only research) ([Claude Code][5])
  - **General-purpose** (can modify + execute) ([Claude Code][5])
- Enforce: subagents **cannot spawn** other subagents (prevents runaway nesting). ([Claude Code][5])

### 2.3 Verification-first defaults

To match "why people rave" about these agents in practice, bake in:

- "Edit → run relevant checks → iterate until green"
- Prefer _diagnostics_ over pure reasoning when available:
  - MVP: run tests/builds to catch errors
  - Fast-follow: integrate LSP diagnostics for real-time feedback ([OpenCode][12])
- Prefer scoped diffs and reversible changes:
  - Always checkpoint pre-edit and after each user instruction. ([Claude Code][7])

---

## 3) Tooling spec

### 3.1 MCP tools (primary integration layer)

MCP is the backbone for connecting to external apps and services:

- **Calendar**: Google Calendar, Outlook — read events, create invites
- **CRM**: Salesforce, HubSpot — query contacts, update records
- **Email**: Gmail, Outlook — read inbox, draft/send emails
- **Meeting recorders**: Fireflies, Gong, Otter — fetch transcripts, summaries
- **Ticketing**: Zendesk, Linear, Jira — read/create tickets
- **Communication**: Slack, Teams — read channels, post messages
- **Databases**: Postgres, Supabase — query/update data
- **Code hosting**: GitHub, GitLab — repos, PRs, issues

Orgs connect integrations via OAuth; agent discovers available tools at session start.

### 3.2 Code tools (Claude Code parity)

For repo-based work, implement with strongly typed schemas:

- **Read**, **Grep**, **Glob** ([Claude Code][2])
- **Edit**, **Write**, **NotebookEdit** ([Claude Code][2])
- **Bash**, **BashOutput**, **KillShell** ([Claude Code][2])
- **WebSearch**, **WebFetch** ([Claude Code][2])

### 3.3 Ephemeral code tool (new)

When no existing MCP tool or script fits, agent can:

1. Write a one-time Python/JS/TS script
2. Execute it in the sandbox
3. Use the output for next steps

**Use cases:**

- Cross-reference data from multiple sources (calendar × CRM)
- Transform/filter data structures
- Calculate aggregates or diffs

Agent should prefer existing tools; ephemeral code is a fallback for custom logic.

### 3.4 Agent coordination tools

- **AskUserQuestion** (multi-choice clarification) ([Claude Code][2])
- **TodoWrite** / **TodoRead** ([Claude Code][2], [OpenCode][13])
- **Task** (subagent execution) ([Claude Code][2])
- **ExitPlanMode** ([Claude Code][2])

---

## 4) Permissions + sandboxing (this is _the_ cloud differentiator)

### 4.1 Permission rules model (Claude Code parity)

Support `allow`, `ask`, `deny`, precedence rules, plus tool-specific matchers. ([Claude Code][3])

Key details to match:

- Bash permissions are **prefix-match** with known bypass limitations; offer safer alternatives (WebFetch domain rules + hooks). ([Claude Code][3])
- Read/Edit patterns follow gitignore-like pattern rules and special absolute path semantics (`//` for absolute). ([Claude Code][3])
- MCP permissions have **no wildcards**; approving all tools is `mcp__serverName`. ([Claude Code][3])
- SlashCommand permission rules include exact and prefix matches. ([Claude Code][14])

### 4.2 Permission modes (UI + API)

Implement the four permission modes exactly:

- `default`, `acceptEdits`, `plan`, `bypassPermissions` ([Claude Code][3])

…and allow Shift+Tab-like cycling in the UI if you ship a terminal/IDE surface (Claude Code docs describe this workflow). ([Claude Code][15])

### 4.3 Output approvals (human-in-the-loop for business tasks)

For non-code outputs, approvals happen on **outputs**, not just tool calls:

| Output Type      | Default Behavior                      | Configurable           |
| ---------------- | ------------------------------------- | ---------------------- |
| Draft emails     | Staged for review before send         | Auto-send (org policy) |
| Calendar invites | Staged for review before create       | Auto-create            |
| CRM updates      | Staged for review                     | Auto-apply             |
| Slack messages   | Staged for review                     | Auto-post              |
| PRs/commits      | Created directly (revertible via git) | Require approval       |

**Configuration levels:**

- Per-integration (e.g., "always review Slack posts")
- Per-output-type (e.g., "always review external emails")
- Per-session (user can override defaults)

Approval UI shows: what will be sent/created, to whom, with full context.

### 4.4 Sandboxing (cloud runtime)

Match Claude Code's framing:

- Bash sandbox mode (auto-allow vs regular) ([Claude Code][16])
- Network access controlled via WebFetch rules + a proxy + domain allowlist. ([Claude Code][2])

### 4.5 Cloud security model (copy the strongest ideas)

Implement these cloud patterns end-to-end:

- **Isolated workspace per session** (can contain multiple sources; see §8.5) ([Claude Code][9])
- **No long-lived credentials inside the sandbox**
  - Use a proxy that translates scoped creds → real tokens (Claude Code on web describes a GitHub proxy pattern + restricted pushes). ([Claude Code][9])
- **Default allowlisted domains** + explicit expansion workflow. ([Claude Code][9])

### 4.6 "Doom loop" mitigation (OpenCode idea)

OpenCode treats "doom_loop" as a permissioned operation by default. ([OpenCode][17])

In your system:

- Add loop detection + "requires approval to continue" guardrail
- Expose it as a policy knob (org-level)

---

## 5) Memory + rules (how you make it feel "smart" across sessions)

### 5.1 Memory hierarchy (Claude Code parity)

Support four memory scopes (enterprise → user → project → local), and recursive discovery up the directory tree. ([Claude Code][4])

For org-level integration metadata and cross-source context, see §8.5 (Multi-source orchestration).

### 5.2 `.claude/rules/` modular memory (parity)

- Auto-load all `.md` in `.claude/rules/` as project memory with same priority as `CLAUDE.md`. ([Claude Code][4])
- Support path-specific rules via YAML frontmatter `paths:` globs. ([Claude Code][4])

### 5.3 "Single source of truth" pattern

Claude's web offering explicitly suggests sourcing `AGENTS.md` from `CLAUDE.md` via `@AGENTS.md`. ([Claude Code][9])

Make this a first-class best practice in your UI templates.

(OpenCode also references `AGENTS.md` as a manual instruction path in its rules system.) ([OpenCode][19])

---

## 6) Extensibility: subagents, skills, plugins, hooks, MCP

### 6.1 Subagents (parity)

- Markdown + YAML frontmatter in:
  - `.claude/agents/` (project)
  - `~/.claude/agents/` (user) ([Claude Code][5])
- Support fields: `name`, `description`, optional `tools`, `model`, `permissionMode`, `skills`. ([Claude Code][5])

### 6.2 Skills (parity)

- `SKILL.md`-based skills with frontmatter, including `allowed-tools` to restrict/auto-allow within that skill. ([Claude Code][20])

Cloud mapping:

- Skills are versioned artifacts (per org/repo)
- Can be invoked by model ("Skill tool") and by users

### 6.3 Plugins + marketplaces (parity)

- Plugins can ship: **agents, commands, skills, hooks, MCP servers**. ([Claude Code][21])
- Marketplaces can be sourced from GitHub/git/local directories, enabled via settings. ([Claude Code][2])

Cloud mapping:

- "Marketplaces" = org-approved registries
- Installation requires explicit trust boundary acceptance (don't auto-enable code execution)

### 6.4 Hooks (parity + cloud hardening)

Hooks are user-defined shell commands that run at lifecycle points, intended to provide deterministic control. ([Claude Code][22])

Cloud mapping:

- Hooks run **inside workspace runtime** (not control plane)
- Provide environment flag to distinguish remote/local (Claude Code web mentions `CLAUDE_CODE_REMOTE`). ([Claude Code][9])
- Support decision-control hooks (allow/deny/ask) pre-tool and on permission requests. ([Claude Code][6])

### 6.5 MCP support (primary integration layer)

MCP is the backbone for connecting to external apps. See §3.1 for supported integrations.

**Configuration:**

- Org-level: managed integrations (OAuth connected via UI)
- Project-level: `.mcp.json` for project-specific servers ([Claude Code][2])
- Enterprise: allow/deny lists for approved integrations

**Cloud mapping:**

- Offer **managed MCP servers** hosted by you (Calendar, CRM, Email, etc.)
- Allow customer-hosted MCP servers behind allowlists + output token caps ([Claude Code][2])
- OAuth token refresh handled by control plane (not exposed to workspace)

---

## 7) Checkpointing + rewind (parity)

Implement **automatic checkpoints** and a rewind UI:

- Every user prompt → new checkpoint ([Claude Code][7])
- Rewind supports:
  - conversation-only
  - code-only
  - both ([Claude Code][7])
- Persist across resumed sessions; TTL cleanup (Claude Code notes 30 days; configurable). ([Claude Code][7])
- Explicit limitations:
  - bash-modified files not tracked
  - external/manual edits may not be captured
  - not a replacement for VCS ([Claude Code][7])

Cloud implementation detail:

- Store checkpoints as content-addressed diffs (per file) + optionally periodic full snapshots for fast restore.

---

## 8) Cloud execution model (Claude Code on web parity)

### 8.1 Workspace provisioning

Follow the "universal image" pattern:

- Maintain a base image with common languages and package managers (Claude's includes Node LTS + npm/yarn/pnpm/**bun**, plus DBs like Postgres/Redis). ([Claude Code][9])
- Provide a `check-tools` equivalent for introspecting the environment. ([Claude Code][9])

### 8.2 Network policy

- Default to allowlisted domains behind an HTTP/HTTPS proxy with filtering/rate limiting. ([Claude Code][9])
- Provide user/org-level network access levels (limited/custom/disabled). ([Claude Code][9])

### 8.3 Git provider integration (one type of source)

- **MVP: GitHub only** (via GitHub App installation per org)
- Fast-follow: GitLab, Azure DevOps
- Proxy pushes to constrain blast radius (restrict push to current branch pattern). ([Claude Code][9])
- **Multi-repo output:**
  - One branch/PR per affected repo
  - PRs are **cross-referenced** (description links to related PRs)
  - Session metadata tracks the full set of linked PRs

### 8.4 "Move between web and local"

Ship a "continue locally" flow similar to "Open in CLI" (remote session export token; CLI attaches and restores state). ([Claude Code][9])

### 8.5 Multi-source orchestration

**Integration Registry:**

Orgs connect sources via UI or API:

| Type              | Examples                 | Connection                    |
| ----------------- | ------------------------ | ----------------------------- |
| Code repos        | GitHub, GitLab           | GitHub App / OAuth            |
| Calendar          | Google Calendar, Outlook | OAuth                         |
| CRM               | Salesforce, HubSpot      | OAuth                         |
| Email             | Gmail, Outlook           | OAuth                         |
| Meeting recorders | Fireflies, Gong, Otter   | OAuth / API key               |
| Ticketing         | Zendesk, Linear, Jira    | OAuth                         |
| Communication     | Slack, Teams             | OAuth                         |
| Databases         | Postgres, Supabase       | Connection string (encrypted) |

**Task → Source Selection:**

- User submits task without specifying sources (or optionally hints)
- Agent uses LLM reasoning to match task against available integrations (no pre-indexing required)
- If ambiguous: agent asks clarifying question
- If source not connected: agent explains what's needed and prompts user to connect

**Multi-Source Session Flow:**

1. Orchestrator spins up ONE isolated workspace
2. For code tasks: clone relevant repos
3. For app tasks: establish MCP connections to relevant services
4. Agent can read/write across all connected sources
5. On completion:
   - Code: one PR per modified repo, cross-referenced
   - Apps: outputs staged for human review (emails, calendar invites, CRM updates)

**Workspace Architecture Options:**

| Option                    | Pros                                           | Cons                                  |
| ------------------------- | ---------------------------------------------- | ------------------------------------- |
| **Daytona (recommended)** | Multi-project native, fast startup, API-driven | External dependency                   |
| **Firecracker microVMs**  | VM-level isolation, battle-tested              | ~125ms cold start, complex to operate |
| **gVisor containers**     | Strong isolation, lower overhead               | Less mature than Firecracker          |
| **Docker**                | Fast, familiar                                 | Weaker isolation for untrusted code   |

Recommendation: Use **Daytona** or equivalent managed platform for MVP.

---

## 9) Interfaces (Web, API, CLI, IDE, CI)

### 9.1 Web UI (Next.js)

Core screens:

- **Integration management**: connect/disconnect sources (repos, apps, services), view sync status
- **Task creation**: natural language input; agent auto-selects sources or user can constrain
- **Live run view**:
  - streaming agent output
  - tool calls + approvals
  - **Output review queue**: staged emails, calendar invites, CRM updates awaiting approval
  - diffs (for code)
  - checkpoints timeline (rewind)
  - logs/commands output
- **Config**:
  - permission rules editor
  - output approval policies
  - memory/rules editor
  - plugins/marketplaces
  - subagents/skills manager

### 9.2 Public API

Expose OpenAPI endpoints. ([OpenCode][1])

**Integrations:**

- `GET /integrations` (list connected sources)
- `POST /integrations` (initiate OAuth connection)
- `DELETE /integrations/:id` (disconnect)
- `GET /integrations/:id/status` (connection health)

**Sessions:**

- `POST /sessions` (create; optionally specify sources or let agent select)
- `POST /sessions/:id/messages` (send user instruction)
- `GET /sessions/:id/events` (SSE stream)
- `POST /sessions/:id/approve` (approve tool call or pending output)
- `POST /sessions/:id/rewind` (checkpoint rewind)
- `GET /sessions/:id/artifacts` (diffs/logs/outputs)
- `GET /sessions/:id/pending-outputs` (list outputs awaiting approval)
- `POST /sessions/:id/pending-outputs/:outputId/approve` (approve + execute)
- `POST /sessions/:id/pending-outputs/:outputId/reject` (reject + discard)

### 9.3 CLI (Bun)

- `agent attach <session>` (resume)
- `agent run -p "<prompt>"` (headless-style single turn)
- `agent continue` (most recent)

Map to Claude Code headless semantics (print/json/stream-json + resume/continue). ([Claude Code][8])

### 9.4 IDE integration

Feature parity target includes:

- plan mode w/ editing review
- auto-accept edits
- extended thinking toggle
- file @-mention / attachments ([Claude Code][10])

### 9.5 CI integration

Offer:

- GitHub Action and/or GitHub App comment triggers (like `@agent`) ([Claude Code][11])
- Non-interactive automation prompts ("run immediately" mode)

---

## 10) Model + prompting policy (Sonnet-first)

**Primary model:** Claude Sonnet (use alias `sonnet` mapping to latest Sonnet; Claude Code's model aliases pattern is documented). ([Claude Code][23])

Support:

- Optional "plan-vs-exec" model split (Claude has `opusplan` as a concept; you can do `sonnetplan` if desired). ([Claude Code][23])
- Extended thinking knobs (Claude Code exposes thinking token env var controls). ([Claude Code][2])

---

## 11) Implementation stack (TypeScript "latest")

- **Web app:** Next.js (App Router), TypeScript
- **Runtime/CLI/workers:** Bun + TypeScript
- **API:** OpenAPI-first (generate TS client), SSE/WebSocket events
- **DB:** Postgres (sessions/config/audit), Redis (queues), S3 (artifacts/logs/checkpoints)
- **Workspaces:** Daytona (recommended) or Firecracker/gVisor (self-hosted), per-session isolation with multi-source support
- **Observability:** OpenTelemetry end-to-end; per-tool timing, cost attribution, replayable traces

---

## 12) MVP scope checklist (what you ship first)

**MVP (general-purpose agent that works for code AND business):**

- Cloud session runner with isolated workspace
- **Integration registry**: connect repos (GitHub) + apps (Calendar, CRM, Email)
- **Multi-source sessions**: agent selects relevant sources, works across them
- **MCP tools**: 3-5 managed integrations (GitHub, Google Calendar, Gmail, Slack, one CRM)
- **Code tools**: Read/Edit/Write/Grep/Glob/Bash/WebFetch/WebSearch
- **Ephemeral code**: agent can write + run one-time scripts for custom logic
- **Output approvals**: staged review for emails, calendar invites, etc.
- Permissions: allow/ask/deny + modes (default/acceptEdits/plan)
- Checkpointing + rewind
- Subagents: Plan + General-purpose
- Streaming UI with tool approvals + output review queue

**Fast-follow:**

- More MCP integrations (Salesforce, HubSpot, Jira, Linear, Notion, etc.)
- Deep source knowledge: embeddings/RAG for semantic search across sources
- Hooks decision-control + org policy packs
- Plugins/marketplaces
- Skills system
- LSP diagnostics loop (OpenCode-inspired) ([OpenCode][12])
- Multi-client attach (OpenCode server architecture) ([OpenCode][1])

---

## References

[1]: https://opencode.ai/docs/server/ 'Server | OpenCode'
[2]: https://code.claude.com/docs/en/settings 'Claude Code settings - Claude Code Docs'
[3]: https://code.claude.com/docs/en/iam 'Identity and Access Management - Claude Code Docs'
[4]: https://code.claude.com/docs/en/memory "Manage Claude's memory - Claude Code Docs"
[5]: https://code.claude.com/docs/en/sub-agents 'Subagents - Claude Code Docs'
[6]: https://code.claude.com/docs/en/hooks 'Hooks reference - Claude Code Docs'
[7]: https://code.claude.com/docs/en/checkpointing 'Checkpointing - Claude Code Docs'
[8]: https://code.claude.com/docs/en/headless 'Headless mode - Claude Code Docs'
[9]: https://code.claude.com/docs/en/claude-code-on-the-web 'Claude Code on the web - Claude Code Docs'
[10]: https://code.claude.com/docs/en/vs-code 'Visual Studio Code - Claude Code Docs'
[11]: https://code.claude.com/docs/en/github-actions 'Claude Code GitHub Actions - Claude Code Docs'
[12]: https://opencode.ai/docs/lsp/ 'LSP Servers | OpenCode'
[13]: https://opencode.ai/docs/tools/ 'Tools | OpenCode'
[14]: https://code.claude.com/docs/en/slash-commands 'Slash commands - Claude Code Docs'
[15]: https://code.claude.com/docs/en/common-workflows 'Common workflows - Claude Code Docs'
[16]: https://code.claude.com/docs/en/sandboxing 'Sandboxing - Claude Code Docs'
[17]: https://opencode.ai/docs/permissions/ 'Permissions | OpenCode'
[19]: https://opencode.ai/docs/rules/ 'Rules | OpenCode'
[20]: https://code.claude.com/docs/en/skills 'Agent Skills - Claude Code Docs'
[21]: https://code.claude.com/docs/en/plugins 'Plugins - Claude Code Docs'
[22]: https://code.claude.com/docs/en/hooks-guide 'Get started with Claude Code hooks'
[23]: https://code.claude.com/docs/en/model-config 'Model configuration - Claude Code Docs'
