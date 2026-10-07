# CLAUDE.md — Resource Management

Read this first. Detail lives in `docs/`:
`PROJECT_OVERVIEW.md` · `PRODUCT_REQUIREMENTS.md` · `SYSTEM_ARCHITECTURE.md` · `TECH_STACK.md` · `DATABASE_DESIGN.md` · `API_DESIGN.md` · `TASK_BREAKDOWN.md`

## What this is
Internal resource-allocation app (people ↔ projects, locks, bench, capacity planning). Stack: **Next.js** (`apps/web`) + **NestJS** (`apps/api`) + PostgreSQL, pnpm monorepo with `packages/shared`.

`resource_management_v2.html` at repo root is a bundled prototype and the **behaviour/UX spec**. It is a generated bundle: don't edit it, don't ship it.

## Current status
Docs and prototype only; code scaffold not started. Check `TASK_BREAKDOWN.md` for the next task and update its checkboxes as you finish work.

## How to work
- Read the relevant doc before changing a feature; if code and docs disagree, say so and update the doc in the same change.
- Business rules in `PRODUCT_REQUIREMENTS.md` are authoritative (100% capacity ceiling, lock semantics, skill-mismatch modes, HRIS-owned fields read-only).
- Ask before choosing among items marked *(proposed)* in `TECH_STACK.md` that aren't yet confirmed.
- Keep changes small and scoped; don't refactor unrelated code.
- Never commit secrets or `.env*`; update `.env.example` when adding config.
- Inside containers services reach each other by compose service name (`db`, `redis`, `api`), not `localhost`.
- Never run `docker compose down -v` or reset the database without asking.

## Coding rules
- TypeScript strict everywhere; no `any` without a comment explaining why.
- Shared types/Zod schemas/enums go in `packages/shared`; never duplicate between web and api.
- **Validation and business rules live in the API** (`allocations` validator service). The UI only displays the result. Never re-implement rules in the frontend.
- Allocation commits: re-validate inside a DB transaction with a lock on the person row.
- Status and utilisation are derived; don't store them as source of truth.
- NestJS: one module per domain area; thin controllers, logic in services; DTO validation on every endpoint; RBAC guard on every route; mutations write to `audit_log`.
- Next.js: App Router; server components for reads where practical; client components only for interactivity; data via TanStack Query *(once confirmed)*.
- Dates are plain `YYYY-MM-DD` (UTC dates, no times); format at the edge.
- Naming: DB snake_case, TS camelCase, React components PascalCase, files kebab-case.
- Match surrounding code style; comments only for non-obvious *why*.
- UI copy: plain, sentence case, outcome-oriented (see prototype toasts/validation messages).
- Accessibility: labels, keyboard operable, contrast OK in light and dark.

## Testing
- Unit-test every validation rule and derived-status case (Vitest).
- API integration tests with Supertest + real Postgres (Testcontainers).
- Playwright for key journeys: allocate, lock, release, bench.
- Run lint, typecheck and tests before declaring a task done; report failures honestly.

## Local environment (Docker)
The database and app run locally via Docker Compose. Setup/changes: `/docker-local`.
```
cp .env.example .env
docker compose up -d db redis        # infra only (available now)
docker compose up -d --build         # + api and web, once apps exist
docker compose down                  # stop, keep data
docker compose down -v               # stop and WIPE database (ask first)
```

## Commands (fill in as scaffolded)
```
pnpm install
pnpm dev            # web + api on the host (needs db/redis from compose)
pnpm lint && pnpm typecheck && pnpm test
pnpm --filter api prisma migrate dev
```

## Git
- Branch off `main`; Conventional Commits; commit/push only when asked.
