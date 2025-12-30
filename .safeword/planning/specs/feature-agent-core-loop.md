# Feature Spec: Agent Core Loop (MVP)

**Guide**: `.safeword/guides/planning-guide.md`
**Template**: `.safeword/templates/feature-spec-template.md`

**Feature**: Minimal, embeddable AI agent built from scratch in TypeScript. Uses Claude for reasoning, MCP for tools. No external agent frameworks. **All components abstracted via interfaces for independent evolution.**

**Related Issue**: N/A (foundational feature)
**Status**: ❌ Not Started (0/8 stories complete)

---

## Context

From `constraints.md`:

- "A single engineer should be able to clone, run in < 5 min, test easily, go 'this is dope'"
- "Planner-executor agents are so good now, we don't need railroaded steps"
- "Arcade is required. Optimized tools only."
- "Embeddable component - developer can plug it in"

**Target Demo**: GTM Leaders - analyze deals, follow up prospects

**Architecture Decisions**:

1. Build agent loop from scratch. No Vercel AI SDK, no Mastra, no VoltAgent.
2. **SPI Pattern**: All components abstracted via interfaces. LLM, tools, bootstrap can evolve independently.
3. **Mac App** as primary interface (like Claude Code), with CLI for developers.

---

## Architecture

### High-Level

```
┌─────────────────────────────────────────────────────────────┐
│                    Dexa Agent Loop                          │
│                    (Orchestrator - ~100 lines)              │
│                                                              │
│   while (not done && iterations < max):                     │
│     response = llm.chat(messages, tools)                    │
│     if no tool_calls: return response                       │
│     for each tool_call:                                     │
│       result = toolProvider.execute(tool_call)              │
│       messages.push(tool_result)                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────────┐    ┌─────────────────────────────────┐
│  LLMProvider        │    │  ToolProvider                   │
│  (interface)        │    │  (interface)                    │
└─────────────────────┘    └─────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────────┐    ┌─────────────────────────────────┐
│  AnthropicProvider  │    │  McpToolProvider                │
│  (default impl)     │    │  (default impl)                 │
└─────────────────────┘    └─────────────────────────────────┘
```

### SPI Pattern (Service Provider Interface)

All major components defined as **interfaces** with default implementations. This allows:

- **Independent evolution**: Swap LLM provider without touching agent loop
- **Testing**: Mock providers in tests
- **Future flexibility**: Add OpenAI, Bedrock, direct Arcade SDK without refactoring

```typescript
// Agent receives providers via dependency injection
const agent = createAgent({
  llm: new AnthropicProvider(apiKey), // swappable
  tools: new McpToolProvider(gatewayUrls), // swappable
});
```

See **Story 1** for complete interface definitions.

### Component Boundaries

| Component      | Interface             | Default Implementation | Can Be Swapped For     |
| -------------- | --------------------- | ---------------------- | ---------------------- |
| LLM reasoning  | `LLMProvider`         | `AnthropicProvider`    | OpenAI, Bedrock, local |
| Tool execution | `ToolProvider`        | `McpToolProvider`      | Direct SDK, REST APIs  |
| Gateway setup  | `ToolkitBootstrapper` | `ArcadeBootstrapper`   | Custom MCP servers     |

---

## Out of Scope

- ❌ Web UI (Phase 2)
- ❌ Multi-user / auth (Phase 2)
- ❌ Session persistence / checkpointing (Phase 2)
- ❌ Subagents (Phase 2)
- ❌ Skills system (Phase 2)
- ❌ Custom MCP servers (Phase 2)
- ❌ Streaming responses (Phase 2)
- ❌ Tool Search Layer (Phase 2 - simplify MVP)
- ❌ Alternative LLM providers (Phase 2 - interfaces ready, only Anthropic impl for MVP)

---

## Technical Constraints

### Stack

- [ ] TypeScript only (no Python, no shell scripts)
- [ ] Bun runtime
- [ ] `@anthropic-ai/sdk` for Claude API (default LLM provider)
- [ ] `@modelcontextprotocol/sdk` for MCP client (default tool provider)
- [ ] **No external agent frameworks** (build from scratch)
- [ ] **SPI pattern** - all components abstracted via interfaces

### Dependencies

**Core** (agent library):

- `@anthropic-ai/sdk` - Claude API
- `@modelcontextprotocol/sdk` - MCP client

**Desktop** (Mac app):

- Electron (TypeScript, mature ecosystem)

### Performance

- [ ] First response within 5s
- [ ] Tool execution timeout: 30s per tool
- [ ] Max 10 iterations per run

### Infrastructure

- [ ] Single process (no distributed state)
- [ ] Environment variables: `ANTHROPIC_API_KEY`, `ARCADE_API_KEY`, `ARCADE_ORG_ID`, `ARCADE_PROJECT_ID`

---

## Story 1: Core Types + Interfaces

**As a** developer building on Dexa
**I want** well-defined TypeScript types and provider interfaces
**So that** I have a solid foundation with type safety and extensibility

**Acceptance Criteria**:

- [ ] **Provider Interfaces** (SPI contracts):

```typescript
// LLM Provider - abstracts the reasoning engine
interface LLMProvider {
  chat(params: {
    messages: Message[];
    tools: Tool[];
    systemPrompt?: string;
    maxTokens?: number;
  }): Promise<LLMResponse>;
}

interface LLMResponse {
  content: ContentBlock[];
  stopReason: 'end_turn' | 'tool_use' | 'max_tokens';
}

// Tool Provider - abstracts tool execution
interface ToolProvider {
  listTools(): Promise<Tool[]>;
  executeTool(name: string, input: unknown): Promise<ToolResult>;
}

interface ToolResult {
  success: boolean;
  content: string;
  error?: string;
  // JIT Authorization - if tool needs auth, return URL
  needsAuth?: boolean;
  authUrl?: string;
}

// Toolkit Bootstrapper - abstracts gateway/tool setup
interface ToolkitBootstrapper {
  bootstrap(config: BootstrapConfig): Promise<BootstrapResult>;
}

interface BootstrapConfig {
  apiKey: string;
  orgId: string;
  projectId: string;
  gatewayPrefix: string;
  toolkits: Record<string, boolean>;
}

interface BootstrapResult {
  gateways: Map<string, string>; // toolkit → URL
  toolCount: number;
}
```

- [ ] **Domain Types** (matching Claude API format):

```typescript
type MessageRole = 'user' | 'assistant';
type Message = {
  role: MessageRole;
  content: string | ContentBlock[];
};
type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock;

type TextBlock = { type: 'text'; text: string };
type ToolUseBlock = { type: 'tool_use'; id: string; name: string; input: unknown };
type ToolResultBlock = {
  type: 'tool_result';
  tool_use_id: string;
  content: string;
  is_error?: boolean;
};

type Tool = {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
};
```

- [ ] `User` type: id, name, metadata (identity-aware)
- [ ] `AgentConfig` type: llm, tools, systemPrompt, maxIterations
- [ ] `AgentResult` type:

```typescript
interface AgentResult {
  messages: Message[];
  finalResponse: LLMResponse | null;
  iterations: number;
  status: 'completed' | 'max_iterations' | 'needs_auth' | 'error';
  // JIT Auth fields (when status === 'needs_auth')
  authUrl?: string;
  authToolkit?: string;
}
```

- [ ] Factory functions: `createMessage()`, `createUser()`, `createToolResult()`
- [ ] All exported from `@dexa/core`

**Implementation Status**: ❌ Not Started
**Tests**: `packages/core/src/__tests__/types.test.ts`

---

## Story 2: Anthropic LLM Provider

**As a** developer
**I want** a default LLM provider using Claude
**So that** the agent can reason and plan

**Acceptance Criteria**:

- [ ] `AnthropicProvider` implements `LLMProvider` interface
- [ ] Constructor takes `apiKey` (from env or explicit)
- [ ] `chat()` calls `claude.messages.create()` with correct format
- [ ] Default model: `claude-3-5-sonnet-latest`
- [ ] Transforms Claude response to `LLMResponse` type
- [ ] Handles API errors gracefully (wrap with context)
- [ ] Exported from `@dexa/agent`

```typescript
class AnthropicProvider implements LLMProvider {
  constructor(
    private apiKey: string,
    private model = 'claude-3-5-sonnet-latest',
  ) {
    this.client = new Anthropic({ apiKey });
  }

  async chat(params: ChatParams): Promise<LLMResponse> {
    const response = await this.client.messages.create({
      model: this.model,
      system: params.systemPrompt,
      messages: params.messages,
      tools: params.tools,
      max_tokens: params.maxTokens ?? 4096,
    });
    return this.transformResponse(response);
  }
}
```

**Implementation Status**: ❌ Not Started
**Tests**: `packages/agent/src/__tests__/anthropic-provider.test.ts`

---

## Story 3: MCP Tool Provider

**As a** developer
**I want** to execute tools via MCP protocol
**So that** the agent can interact with external systems

**Acceptance Criteria**:

- [ ] `McpToolProvider` implements `ToolProvider` interface
- [ ] Constructor takes array of gateway URLs
- [ ] Uses `@modelcontextprotocol/sdk` Client class
- [ ] `listTools()` establishes connections lazily, aggregates tools as `Tool[]`
- [ ] `executeTool(name, input)` routes to correct gateway and executes
- [ ] Returns `ToolResult` with success/error status
- [ ] Connection errors handled gracefully
- [ ] Exported from `@dexa/agent`

```typescript
class McpToolProvider implements ToolProvider {
  private clients: Map<string, McpClient> = new Map();
  private toolToGateway: Map<string, string> = new Map();
  private connected = false;

  constructor(private gatewayUrls: string[]) {}

  // Lazy connection - called internally on first listTools()
  private async ensureConnected(): Promise<void> {
    if (this.connected) return;
    for (const url of this.gatewayUrls) {
      const client = new Client({
        /* transport config */
      });
      await client.connect();
      this.clients.set(url, client);
    }
    this.connected = true;
  }

  async listTools(): Promise<Tool[]> {
    await this.ensureConnected();
    const allTools: Tool[] = [];
    for (const [url, client] of this.clients) {
      const tools = await client.listTools();
      tools.forEach(t => {
        this.toolToGateway.set(t.name, url);
        allTools.push(t);
      });
    }
    return allTools;
  }

  async executeTool(name: string, input: unknown): Promise<ToolResult> {
    const gatewayUrl = this.toolToGateway.get(name);
    const client = this.clients.get(gatewayUrl);
    return client.callTool(name, input);
  }
}
```

**Implementation Status**: ❌ Not Started
**Tests**: `packages/agent/src/__tests__/mcp-provider.test.ts`

---

## Story 4: Arcade Bootstrapper

**As a** developer setting up Dexa
**I want** MCP gateways auto-created for enabled toolkits
**So that** tools are available without manual Arcade setup

**Acceptance Criteria**:

- [ ] `ArcadeBootstrapper` implements `ToolkitBootstrapper` interface
- [ ] Config file `dexa.config.ts`:

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
    github: false, // disabled
  },
  agent: {
    model: 'claude-3-5-sonnet-latest',
    maxIterations: 10,
  },
});
```

- [ ] `bootstrap()` creates MCP gateways via Arcade API
- [ ] Fetches tools: `GET /v1/orgs/{orgId}/projects/{projectId}/tools`
- [ ] Groups tools by toolkit name
- [ ] Creates gateway per enabled toolkit: `POST /v1/orgs/{orgId}/projects/{projectId}/gateways`
- [ ] Skips existing gateways (idempotent)
- [ ] Returns `BootstrapResult` with gateway URLs
- [ ] Exported from `@dexa/agent`

**Implementation Status**: ❌ Not Started
**Tests**: `packages/agent/src/__tests__/arcade-bootstrapper.test.ts`

---

## Story 5: Agent Loop (The Heart)

**As a** developer
**I want** a simple, embeddable agent loop
**So that** I can run multi-step AI workflows

**Acceptance Criteria**:

- [ ] `createAgent(config: AgentConfig)` returns agent instance
- [ ] Config accepts provider instances (dependency injection):

```typescript
interface AgentConfig {
  llm: LLMProvider; // injected
  tools: ToolProvider; // injected
  systemPrompt?: string;
  maxIterations?: number; // default: 10
}
```

- [ ] `agent.run(prompt: string, user: User)` executes the loop:

```typescript
async function run(prompt: string, user: User): Promise<AgentResult> {
  const allTools = await this.tools.listTools();
  const systemPrompt = this.buildSystemPrompt(user); // identity-aware
  const messages: Message[] = [{ role: 'user', content: prompt }];

  for (let i = 0; i < this.config.maxIterations; i++) {
    const response = await this.llm.chat({
      messages,
      tools: allTools,
      systemPrompt,
    });

    // Check if done (no tool calls)
    const toolUses = response.content.filter(b => b.type === 'tool_use');
    if (toolUses.length === 0) {
      return { messages, finalResponse: response, iterations: i + 1, status: 'completed' };
    }

    // Add assistant response
    messages.push({ role: 'assistant', content: response.content });

    // Execute each tool call via injected provider
    const toolResults: ToolResultBlock[] = [];
    for (const toolUse of toolUses) {
      const result = await this.tools.executeTool(toolUse.name, toolUse.input);

      // JIT Authorization: if tool needs auth, surface URL to user
      if (result.needsAuth && result.authUrl) {
        return {
          messages,
          finalResponse: null,
          iterations: i + 1,
          status: 'needs_auth',
          authUrl: result.authUrl,
          authToolkit: toolUse.name.split('_')[0], // e.g., "salesforce"
        };
      }

      toolResults.push({
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: result.content,
        is_error: !result.success,
      });
    }

    // Add tool results
    messages.push({ role: 'user', content: toolResults });
  }

  return {
    messages,
    finalResponse: null,
    iterations: this.config.maxIterations,
    status: 'max_iterations',
  };
}
```

- [ ] `buildSystemPrompt(user)` includes user identity context
- [ ] Errors wrapped with context (tool name, input, error)
- [ ] Core loop is <100 lines of code
- [ ] Exported from `@dexa/agent`

**Implementation Status**: ❌ Not Started
**Tests**: `packages/agent/src/__tests__/agent.test.ts`

**Notes**: This is THE core of Dexa. Keep it simple. Providers are injected, not created internally.

---

## Story 6: Mac App

**As a** business user
**I want** a native Mac app to interact with the agent
**So that** I have a polished experience like Claude Code

**Acceptance Criteria**:

- [ ] Native Mac app (Electron - 100% TypeScript)
- [ ] Simple chat window:
  - Text input at bottom
  - Messages displayed above
  - Shows what tools are being called
- [ ] JIT Auth: Opens browser for OAuth, returns to app
- [ ] First-run setup: prompts for API keys if missing
- [ ] Wires up default providers internally

**Implementation Status**: ❌ Not Started
**Tests**: `packages/desktop/src/__tests__/app.test.ts`

---

## Story 7: CLI (Developer Interface)

**As a** developer
**I want** CLI commands for scripting and testing
**So that** I can automate and debug

**Acceptance Criteria**:

- [ ] `dexa init` - bootstrap gateways, save config
- [ ] `dexa run "prompt"` - execute single prompt, print result, exit
- [ ] `dexa` (no args) - opens Mac app
- [ ] Loads config from `dexa.config.ts` or `~/.dexa/config`
- [ ] Missing env vars show helpful error with signup URLs

**Implementation Status**: ❌ Not Started
**Tests**: `packages/cli/src/__tests__/cli.test.ts`

---

## Story 8: GTM Demo Validation

**As a** GTM leader (Sales, RevOps)
**I want** to analyze deals and generate follow-ups
**So that** we validate Dexa works for real business workflows

**Acceptance Criteria**:

- [ ] Demo prompt works end-to-end:

```
"Show me all deals closing this month that haven't had activity in 2 weeks,
and draft follow-up emails for each account"
```

- [ ] Agent uses Salesforce tool to query deals
- [ ] Agent uses Gmail tool to draft emails
- [ ] Output shows:
  - Deals found (count, names, values)
  - Draft emails for review
- [ ] Demo completes in < 60 seconds
- [ ] Works with real Salesforce + Gmail (requires user's Arcade auth)

**Implementation Status**: ❌ Not Started
**Tests**: `packages/agent/src/__tests__/gtm-demo.test.ts`

---

## Summary

**Completed**: 0/8 stories (0%)
**Remaining**: 8/8 stories (100%)

### Layer 1: Foundation ❌

- Story 1: Core Types + Interfaces
- Story 2: Anthropic LLM Provider
- Story 3: MCP Tool Provider
- Story 4: Arcade Bootstrapper

### Layer 2: Orchestration ❌

- Story 5: Agent Loop (The Heart)

### Layer 3: User Experience ❌

- Story 6: Mac App (Primary)
- Story 7: CLI (Secondary)
- Story 8: GTM Demo Validation

**Next Steps**: TDD Story 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8.
