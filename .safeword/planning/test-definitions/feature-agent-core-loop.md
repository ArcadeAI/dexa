# Test Definitions: Agent Core Loop (MVP)

**Guide**: `.safeword/guides/testing-guide.md`
**Template**: `.safeword/templates/test-definitions-feature.md`

**Feature**: Minimal, embeddable AI agent with SPI-pattern abstractions.

**Related Issue**: N/A
**Test Files**: Multiple (see below)
**Total Tests**: 35 (0 passing, 0 skipped, 35 not implemented)

---

## Test Suite 1: Core Types + Interfaces (`packages/core/src/__tests__/types.test.ts`)

Tests for factory functions and interface contracts.

### Test 1.1: createMessage creates user message ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Call `createMessage('user', 'Hello')`

**Expected**: Returns `{ role: 'user', content: 'Hello' }`

---

### Test 1.2: createMessage creates assistant message with content blocks ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Call `createMessage('assistant', [{ type: 'text', text: 'Let me check...' }])`

**Expected**: Returns message with content array

---

### Test 1.3: createToolResult creates tool result block ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Call `createToolResult('call_123', 'Result data', true)`

**Expected**: Returns `{ success: true, content: 'Result data' }`

---

### Test 1.4: createUser creates User with identity ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Call `createUser('user_1', 'Guru', { team: 'engineering' })`

**Expected**: Returns `{ id: 'user_1', name: 'Guru', metadata: { team: 'engineering' } }`

---

### Test 1.5: LLMProvider interface is exported ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Import `LLMProvider` from `@dexa/core`
2. Create mock implementation

**Expected**: TypeScript compiles, interface has `chat` method

---

### Test 1.6: ToolProvider interface is exported ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Import `ToolProvider` from `@dexa/core`
2. Create mock implementation

**Expected**: TypeScript compiles, interface has `listTools` and `executeTool` methods

---

## Test Suite 2: Anthropic Provider (`packages/agent/src/__tests__/anthropic-provider.test.ts`)

Tests for the default LLM provider.

### Test 2.1: AnthropicProvider implements LLMProvider ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Create `AnthropicProvider` instance
2. Verify it satisfies `LLMProvider` interface

**Expected**: TypeScript compiles with interface assignment

---

### Test 2.2: chat() calls Anthropic API with correct params (mocked) ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Mock Anthropic SDK
2. Call `provider.chat({ messages, tools })`
3. Verify mock called with correct shape

**Expected**: Anthropic `messages.create` called with model, messages, tools

---

### Test 2.3: chat() transforms response to LLMResponse ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Mock Anthropic to return Claude-format response
2. Call `provider.chat()`
3. Check returned type

**Expected**: Returns `LLMResponse` with content and stopReason

---

### Test 2.4: chat() wraps API errors with context ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Mock Anthropic to throw error
2. Call `provider.chat()`

**Expected**: Error includes original message + context

---

## Test Suite 3: MCP Tool Provider (`packages/agent/src/__tests__/mcp-provider.test.ts`)

Tests for the default tool provider.

### Test 3.1: McpToolProvider implements ToolProvider ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Create `McpToolProvider` instance
2. Verify it satisfies `ToolProvider` interface

**Expected**: TypeScript compiles with interface assignment

---

### Test 3.2: listTools() connects lazily and aggregates tools ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Mock MCP Client
2. Call `provider.listTools()` (first call triggers connection)
3. Verify clients created for each URL

**Expected**: One client per gateway URL, combined tool list returned

---

### Test 3.3: listTools() reuses existing connections on subsequent calls ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Call `provider.listTools()` twice
2. Check connection calls

**Expected**: Clients only created once (lazy init)

---

### Test 3.4: executeTool() routes to correct gateway ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Mock two gateways with different tools
2. Call `provider.executeTool('gateway1_tool', {})`

**Expected**: Calls correct gateway's client

---

### Test 3.5: executeTool() returns ToolResult format ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Mock successful tool execution
2. Call `provider.executeTool()`

**Expected**: Returns `{ success: true, content: '...' }`

---

### Test 3.6: executeTool() handles errors gracefully ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Mock tool execution failure
2. Call `provider.executeTool()`

**Expected**: Returns `{ success: false, error: '...' }`

---

### Test 3.7: executeTool() returns JIT auth URL when unauthorized ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Mock tool execution returning 401/auth required
2. Call `provider.executeTool()`

**Expected**: Returns `{ success: false, needsAuth: true, authUrl: 'https://...' }`

---

## Test Suite 4: Arcade Bootstrapper (`packages/agent/src/__tests__/arcade-bootstrapper.test.ts`)

Tests for MCP gateway creation.

### Test 4.1: ArcadeBootstrapper implements ToolkitBootstrapper ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Create `ArcadeBootstrapper` instance
2. Verify it satisfies `ToolkitBootstrapper` interface

**Expected**: TypeScript compiles with interface assignment

---

### Test 4.2: bootstrap() fetches tools from Arcade (mocked) ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Mock Arcade tools API response
2. Call `bootstrapper.bootstrap(config)`

**Expected**: Calls `GET /v1/orgs/{orgId}/projects/{projectId}/tools`

---

### Test 4.3: bootstrap() creates gateway for enabled toolkit ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Config: `{ salesforce: true, github: false }`
2. Call `bootstrapper.bootstrap(config)`

**Expected**: Creates gateway for salesforce only

---

### Test 4.4: bootstrap() returns BootstrapResult ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Call `bootstrapper.bootstrap(config)`

**Expected**: Returns `{ gateways: Map, toolCount: number }`

---

## Test Suite 5: Agent Loop (`packages/agent/src/__tests__/agent.test.ts`)

Tests for the core agent loop with injected providers.

### Test 5.1: createAgent accepts provider injection ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Create mock LLMProvider and ToolProvider
2. Call `createAgent({ llm: mockLLM, tools: mockTools })`

**Expected**: Agent created with injected providers

---

### Test 5.2: agent.run() uses injected LLMProvider ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Create agent with mock LLMProvider
2. Call `agent.run('Hello', user)`

**Expected**: Mock LLM's `chat()` called

---

### Test 5.3: agent.run() uses injected ToolProvider ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Mock LLM to return tool_use
2. Create agent with mock ToolProvider
3. Call `agent.run()`

**Expected**: Mock ToolProvider's `executeTool()` called

---

### Test 5.4: agent.run() includes user identity in system prompt ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Create user with `{ id: 'u1', name: 'Guru' }`
2. Call `agent.run('test', user)`
3. Check system prompt passed to LLM

**Expected**: System prompt includes user context

---

### Test 5.5: agent.run() returns needs_auth when tool unauthorized ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Mock ToolProvider to return `{ needsAuth: true, authUrl: '...' }`
2. Call `agent.run()`

**Expected**:

- Returns `{ status: 'needs_auth', authUrl: '...', authToolkit: '...' }`
- Does not continue loop

---

## Test Suite 6: Mac App (`packages/desktop/`)

### Test 6.1: App launches and shows chat window ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Launch app

**Expected**: Window opens with chat interface

---

### Test 6.2: App wires up providers on startup ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Launch app with valid config

**Expected**: Agent created with AnthropicProvider + McpToolProvider

---

### Test 6.3: JIT auth opens browser ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Mock agent to return `status: 'needs_auth'`
2. Submit prompt

**Expected**: Opens auth URL in default browser

---

## Test Suite 7: CLI (`packages/cli/`)

### Test 7.1: dexa init bootstraps gateways ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Run `dexa init` (mocked)

**Expected**: Creates gateways, saves config

---

### Test 7.2: dexa run executes prompt ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Run `dexa run "Hello"` (mocked)

**Expected**: Prints result, exits 0

---

### Test 7.3: Missing env vars shows error ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Unset ANTHROPIC_API_KEY
2. Run `dexa run "test"`

**Expected**: Shows missing variable + signup URL, exits 1

---

## Test Suite 8: GTM Demo (`packages/agent/src/__tests__/gtm-demo.test.ts`)

Integration tests for the demo scenario.

### Test 8.1: Demo prompt executes multi-tool workflow (e2e mock) ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Mock Salesforce tool to return test deals
2. Mock Gmail tool to draft emails
3. Run agent with demo prompt

**Expected**: Agent queries deals, then drafts emails for each

---

### Test 8.2: Demo returns structured output ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Run demo with mocked tools
2. Check final response

**Expected**: Contains deal count, deal names, draft emails

---

### Test 8.3: Demo completes within iteration limit ❌

**Status**: ❌ Not Implemented

**Steps**:

1. Run demo with mocked tools

**Expected**: `iterations < maxIterations`, `status: 'completed'`

---

## Summary

**Total**: 35 tests
**Passing**: 0 (0%)
**Not Implemented**: 35 (100%)

### Coverage by Feature

| Feature             | Tests | Status |
| ------------------- | ----- | ------ |
| Core Types          | 6     | ❌ 0%  |
| Anthropic Provider  | 4     | ❌ 0%  |
| MCP Provider        | 7     | ❌ 0%  |
| Arcade Bootstrapper | 4     | ❌ 0%  |
| Agent Loop          | 5     | ❌ 0%  |
| Mac App             | 3     | ❌ 0%  |
| CLI                 | 3     | ❌ 0%  |
| GTM Demo            | 3     | ❌ 0%  |

---

## Test Execution

```bash
# Run all tests
bun test

# Run specific package
bun test --filter @dexa/core
bun test --filter @dexa/agent
bun test --filter @dexa/cli

# Run specific test file
bun test packages/agent/src/__tests__/agent.test.ts
```

---

**Last Updated**: 2025-12-30
