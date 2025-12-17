# Dexa: Constraints

> The more constraints we have, the better the product.

---

## Target Persona

**Primary:** Software engineer / AI-ML engineer who wants to stand up an agent for business teams.

**Not:** RevOps people, no-code users, or anyone who thinks n8n is "too much work." Everyone else in the industry (LangChain Agent Builder, etc.) is going after that market. We're not.

**End Users:** Business teams (CS, Sales, HR, Finance) who receive the agent from engineering.

---

## Technical Stack

| Decision | Constraint |
|----------|------------|
| **Language** | TypeScript only |
| **Runtime** | Bun |
| **LLM** | Claude only (for now). No multi-model, no OpenRouter. Everyone building agents is using Claude because their models are better for agents. |
| **Tools** | Arcade - optimized tools only. Base tools suck. |

---

## Architecture

### Input is Decoupled from Agent

The input mechanism (Slack, voice, SMS, web) should be **completely decoupled** from what the agent does.

```
Slack / Voice / SMS / Web
          │
          ▼
    Unified Input Layer
          │
          ▼
      Agent Core  ← Doesn't know/care about input source
```

### Embeddable Component

This is **not** designed to be a standalone service you spin up and users log into.

The core value is that a developer building an application can **plug it in as a component**. We shouldn't force them to use our UI.

- Clean component architecture
- Default UI provided (TBD) but optional
- Can be embedded into whatever they're building

### Skills Support

Support skills - it's a power user thing. Come with a few pre-built skills for common use cases (break down the documented use cases into reusable skills).

---

## Deployment

| Constraint | Rationale |
|------------|-----------|
| **Should NOT have to run on customer device** | Our customers don't want that. Business users will never load up an agent locally. |
| **CAN run on laptop** | For dev/testing purposes |
| **We bear compute cost** | Customers shouldn't have to |

### Developer Experience (Critical)

A single engineer should be able to:

1. **Clone or fork the repo**
2. **Get it running in < 5 minutes**
3. **Minimum dependencies** on their machine
4. **Test easily** (CLI or similar)
5. **Go "this is dope"** on their laptop
6. **Deploy to EC2** (or similar) easily
7. **Invite teammates**

Then the AI-ML director says: *"We just saved years worth of engineering effort."*

---

## Open Source

- **Must be open source** - customers need to be able to run it themselves
- Easy to fork and customize
- Distribution mechanism for Arcade to core demographic (AI-ML engineers and leadership)

---

## Arcade Integration

| Constraint | Detail |
|------------|--------|
| **Arcade is required** | Not optional. Wired in. |
| **Force signup** | Take users to sign up page. This showcases Arcade. |
| **Optimized tools only** | Base tools provide bad experience |

---

## Use Cases

### Focus: Non-Engineering

| ✅ Do | ❌ Don't |
|-------|---------|
| Business use cases (CS, Sales, HR, Finance) | DevOps workflows |
| Multi-tool orchestration | Competing with Cursor |
| Research and document generation | Building software products |

**Why?** Engineers already have Cursor. We don't want to compete with Cursor - that's a losing strategy.

### Code is Disposable

The agent **can** write code, but only in service of business use cases.

- ✅ Write a script to analyze data for a report
- ✅ Generate a one-off automation
- ❌ Build a product
- ❌ Write production software

Cursor and Claude Code are trying to build products. We're not.

---

## Agent Design

### Planner-Executor is Enough

**Key insight:** Planner-executor agents are so good now, we don't need railroaded steps.

No low-code/no-code agent builders. No drag-and-drop flows. The LLM can figure it out.

### Identity Aware

Agent must know who the user is. Identity context flows through everything.

### Sub-agents are Implementation Details

Users should **not** be aware of sub-agents. That's internal architecture, not a user-facing concept.

### Every Feature Must Serve a Use Case

No feature should exist that isn't specifically called out in a use case.

- If it doesn't serve a use case → Phase 2 or cut it
- Otherwise it's bloat / engineers building shit for the sake of building

---

## What This Is NOT

| Not This | Why |
|----------|-----|
| n8n / Zapier competitor | Those are for RevOps/no-code users |
| LangChain Agent Builder | They're doing visual agent builders |
| Cursor competitor | Engineers already have Cursor |
| Standalone SaaS | It's an embeddable component |

---

## Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    Who Is This For?                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  AI-ML Engineer                                              │
│       │                                                      │
│       │ clones repo, runs in 5 min                          │
│       │                                                      │
│       ▼                                                      │
│  Tests on laptop → "This is dope"                           │
│       │                                                      │
│       │ deploys to server                                   │
│       │                                                      │
│       ▼                                                      │
│  Business Teams (CS, Sales, HR, Finance)                    │
│       │                                                      │
│       │ use agent for their workflows                       │
│       │                                                      │
│       ▼                                                      │
│  AI-ML Director: "We saved years of engineering"            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

