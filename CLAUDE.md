# LitVoice — Claude Context

## What this project is
Personal free audiobook reader. DaloyJS API + React/Vite frontend. Portfolio/learning project targeting Azure AKS deployment.

## Read these first
- `instructions for you claude.md` — how to work with the user (teacher/mentor mode, give code, user types it)
- `ROADMAP.md` — current sprint, decisions, lessons learned (local only, not committed)
- `AI_WORKFLOW.md` — tool roles (Claude.ai vs Claude Code vs Copilot) (local only, not committed)
- `litvoice-api/AGENTS.md` — API rules, security, DaloyJS conventions
- `litvoice-api/.agents/skills/daloyjs-best-practices/SKILL.md` — full DaloyJS workflow

## Project structure
```
litvoice/
├── litvoice-api/   ← DaloyJS REST API (Node.js, pnpm, TypeScript)
└── litvoice-web/   ← React 19 + Vite 6 + TypeScript + Tailwind v4
```

## Current sprint
Sprint 1 — Frontend (React + Vite).
- Data layer complete: `src/lib/api.ts` (base HTTP) + `src/lib/books.ts` (domain)
- Types generated from API spec via `pnpm gen:types`
- Next: shadcn/ui setup → components → Home page

## Non-negotiable rules
1. Never remove `requestId()`, `secureHeaders()`, `rateLimit()` from the API
2. Never write to user files without being asked — give code, user types it in themselves
3. `VITE_*` env vars are public — never store secrets in them
4. Every data-fetching component needs three states: loading, error, empty
5. Split base HTTP layer (`api.ts`) from domain files (`books.ts`, `readinglist.ts`, etc.)
6. Types come from `schema.d.ts` (generated) — never hand-write types that mirror the backend
7. Run `pnpm typecheck` before declaring any task done
8. When API routes change: `pnpm gen` (API) → `pnpm gen:types` (web)
9. Sessions use `httpOnly` cookies — never `localStorage` for auth tokens
10. Build order: data layer → component library → components. Never UI-first.
