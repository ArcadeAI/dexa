**⚠️ ALWAYS READ FIRST:** `.safeword/SAFEWORD.md`

The SAFEWORD.md file contains core development patterns, workflows, and conventions.
Read it BEFORE working on any task in this project.

---

# DEXA Monorepo — Stack and Structure (Dec 2025)

## Tech Stack
- Language: TypeScript 5.x (strict), ESM with NodeNext module resolution
- Package management: npm workspaces (no Turborepo for now)
- Build/dev:
  - Libraries use "live types": `exports.types` point at `src/*`, runtime JS at `dist/*`
  - Build with `tsc`; dev with `tsx` (no transpile step during watch)
- Lint/format: TBD (recommend ESLint + Prettier)
- Test: TBD (recommend Vitest + TS test setup)
- Runtimes by package:
  - `@dexa/api`: Node server (framework TBD)
  - `@dexa/agent`: Agent orchestration library used by API/CLI/Desktop
  - `@dexa/core`: Shared types, utilities, domain models
  - `@dexa/web`: Browser app (framework TBD)
  - `@dexa/site`: Marketing website — Astro
  - `@dexa/docs`: Documentation site (TBD)
  - `@dexa/desktop`: Desktop app (Electron/Tauri TBD)
  - `@dexa/mobile`: Mobile app (React Native/Expo TBD)

## Monorepo Structure
```
packages/
  core/      # @dexa/core — shared types, utils, domain models
  agent/     # @dexa/agent — agent logic, tools, orchestration
  api/       # @dexa/api — HTTP API that consumes @dexa/agent
  web/       # @dexa/web — browser app (product UI)
  site/      # @dexa/site — marketing website (Astro)
  docs/      # @dexa/docs — documentation site
  cli/       # @dexa/cli — command-line client (uses @dexa/agent)
  desktop/   # @dexa/desktop — desktop client (uses @dexa/agent)
  mobile/    # @dexa/mobile — mobile client (uses @dexa/core)
```

## Conventions
- ESM only (`type: module`), `module` + `moduleResolution`: `nodenext`.
- Libraries (`core`, `agent`) build first; apps build after.
  - Root scripts: `npm run build:libs` then `npm run build:apps` (or `npm run build`).
- Cross-package imports use workspace aliases, e.g. `import { X } from '@dexa/core'`.
- DOM/JSX only enabled where needed (`web`, `site`, `docs`, `desktop`).

## Common Commands
- Install deps: `npm install`
- Build all: `npm run build`
- Dev (examples):
  - API: `npm run dev -w @dexa/api`
  - CLI: `npm run dev -w @dexa/cli`

## Notes
- Website stack is Astro in `packages/site`.
- Framework selections for `web` and `docs` are intentionally TBD; pick when requirements are defined.
