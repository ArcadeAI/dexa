# ADR-001: Agent Architecture Decisions

**Status**: Accepted
**Date**: 2025-12-30
**Deciders**: Guru, Alex

---

## Decision 1: SPI Pattern for Component Abstraction

### Context

Components (LLM, tools, bootstrap) need to evolve independently. Java uses SPI (Service Provider Interface) for this. TypeScript equivalent is interfaces + dependency injection.

### Decision

**All major components defined as interfaces with default implementations.**

```typescript
// Interfaces (contracts)
interface LLMProvider {
  chat(params: ChatParams): Promise<LLMResponse>;
}

interface ToolProvider {
  listTools(): Promise<Tool[]>;
  executeTool(name: string, input: unknown): Promise<ToolResult>;
}

interface ToolkitBootstrapper {
  bootstrap(config: BootstrapConfig): Promise<BootstrapResult>;
}

// Default implementations
class AnthropicProvider implements LLMProvider { ... }
class McpToolProvider implements ToolProvider { ... }
class ArcadeBootstrapper implements ToolkitBootstrapper { ... }

// Dependency injection
const agent = createAgent({
  llm: new AnthropicProvider(apiKey),
  tools: new McpToolProvider(gatewayUrls),
});
```

### Rationale

| Benefit               | Example                                           |
| --------------------- | ------------------------------------------------- |
| Independent evolution | Upgrade Anthropic SDK without touching agent loop |
| Testing               | Mock providers in tests, no API calls             |
| Future flexibility    | Add OpenAIProvider without refactoring            |
| Embeddability         | Users can inject their own providers              |
| Clear contracts       | Interfaces document expected behavior             |

### Consequences

**Positive:**

- Components can be swapped without code changes
- Easy mocking for tests
- Clear separation of concerns
- Future-proof for new LLMs/tools

**Negative:**

- Slightly more code (interface + implementation)
- Must maintain interface compatibility

---

## Decision 2: Build Agent Loop from Scratch

### Context

Several TypeScript agent frameworks exist:

- Vercel AI SDK (built-in tool loop)
- Mastra (full-featured, pipelines)
- VoltAgent (modular, multi-agent)
- LangGraph.js (graph-based orchestration)

### Decision

**Build the agent loop from scratch using only:**

- `@anthropic-ai/sdk` - Claude API (default LLM provider)
- `@modelcontextprotocol/sdk` - MCP tool execution (default tool provider)

No external agent frameworks.

### Rationale

| Factor       | External Framework | From Scratch |
| ------------ | ------------------ | ------------ |
| Dependencies | Heavy              | 2 packages   |
| Control      | Limited            | Full         |
| Embeddable   | Maybe              | Yes          |
| Debugging    | Hard               | Easy         |
| Code size    | Hidden             | ~100 lines   |

The core agent loop is simple:

```typescript
while (not done && iterations < max):
  response = llm.chat(messages, tools)
  if no tool_calls: return response
  for each tool_call:
    result = tools.executeTool(tool_call)
    messages.push(tool_result)
```

This is ~100 lines of TypeScript. No framework needed.

### Consequences

**Positive:**

- Minimum dependencies (embeddable)
- Full control over behavior
- Easy to debug and understand
- Aligns with "embeddable component" constraint

**Negative:**

- Must implement features ourselves (memory, streaming, etc.)
- No "batteries included"

---

## Decision 3: MCP Gateways for Tool Access

### Context

Arcade provides three ways to access tools:

1. TDKs (SDK) - programmatic access
2. MCP Gateway - pre-created gateway URLs
3. MCP API - direct protocol

### Decision

**Use MCP Gateways with pre-creation at boot-up.**

```
dexa init
  → ArcadeBootstrapper fetches tools from Arcade API
  → Groups by toolkit
  → Creates MCP gateway per enabled toolkit
  → Returns gateway URLs

dexa run "prompt"
  → McpToolProvider connects to gateways
  → Executes tools via MCP protocol
```

### Rationale

| Factor             | MCP Gateway                 | TDK              |
| ------------------ | --------------------------- | ---------------- |
| Protocol           | MCP (standard)              | Arcade-specific  |
| Client             | `@modelcontextprotocol/sdk` | Arcade SDK       |
| Future flexibility | Can add non-Arcade MCPs     | Locked to Arcade |

### Consequences

**Positive:**

- Standard MCP protocol
- Future-proof (can add other MCP servers)
- Clean separation (gateway layer vs agent layer)

**Negative:**

- Requires `dexa init` step
- Gateway creation has rate limits

---

## Decision 4: JIT Authorization (Included in MVP)

### Context

Tools require user authorization (OAuth) before they can be used. Two approaches:

1. **Upfront auth**: User authorizes all tools during setup
2. **JIT auth**: User authorizes tools when first needed

### Decision

**Just-In-Time (JIT) Authorization in MVP.**

When a tool returns "needs authorization":

1. Agent returns `status: 'needs_auth'` with `authUrl`
2. CLI shows URL and waits for user
3. User authorizes in browser
4. CLI resumes agent execution

### Rationale

- Better UX: Only auth what you actually use
- Arcade supports JIT auth natively
- Aligns with least-privilege principle

### Consequences

**Positive:**

- Users don't auth unused tools
- Smoother onboarding
- Arcade handles OAuth complexity

**Negative:**

- First tool use may pause for auth
- Requires CLI to handle auth flow

---

## Decision 5: Defer Tool Search Layer

### Context

Original spec included a Tool Search Layer where Claude identifies needed toolkits before execution.

### Decision

**Defer to Phase 2.** Pass all enabled toolkit tools to Claude.

### Rationale

- Simpler MVP
- Tool Search adds ~1s latency per request
- Claude handles many tools reasonably well

### Consequences

**Positive:**

- Simpler implementation
- Faster time to "this is dope" moment

**Negative:**

- Claude sees more tools (may affect quality slightly)

---

## Implementation Notes

### Minimal Dependencies

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.x",
    "@modelcontextprotocol/sdk": "^1.x"
  }
}
```

### Default Model

```typescript
const DEFAULT_MODEL = 'claude-3-5-sonnet-latest';
```

### Config File (`dexa.config.ts`)

```typescript
import { defineConfig } from '@dexa/core';

export default defineConfig({
  arcade: {
    apiKey: process.env.ARCADE_API_KEY!,
    orgId: process.env.ARCADE_ORG_ID!,
    projectId: process.env.ARCADE_PROJECT_ID!,
  },
  gatewayPrefix: 'dexa',
  toolkits: {
    salesforce: true,
    gmail: true,
    googleCalendar: true,
    slack: true,
  },
  agent: {
    model: 'claude-3-5-sonnet-latest',
    maxIterations: 10,
  },
});
```

### Gateway URLs

Pattern: `https://api.arcade.dev/mcp/{prefix}-{toolkit}`

Examples:

- `https://api.arcade.dev/mcp/dexa-salesforce`
- `https://api.arcade.dev/mcp/dexa-gmail`

---

## References

- `mcp-deployer/deploy.py` - Arcade gateway creation pattern
- `@anthropic-ai/sdk` - Official Claude SDK
- `@modelcontextprotocol/sdk` - Official MCP SDK
