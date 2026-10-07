# Task Breakdown

Status legend: [ ] todo · [~] in progress · [x] done

## Current state

- [x] Clickable prototype (`resource_management_v2.html`)
- [x] Project docs (this folder)
- [~] Repo scaffold (monorepo done; lint/CI/Prisma pending)

## Phase 0 — Foundations

- [x] pnpm monorepo: `apps/web` (Next.js), `apps/api` (NestJS), `packages/shared`
- [x] ESLint/Prettier/TS strict, Husky, commit lint
- [x] Docker Compose infra (Postgres, Redis) and `.env.example`
- [x] Dockerfiles + `api`/`web` compose services (dev and prod images verified; `migrate` service added with Prisma)
- [ ] CI (lint, typecheck, test, build)
- [ ] Prisma setup, first migration, seed from prototype data
- [ ] Port design tokens (light/dark) and base components (Button, Lozenge, Card, Table, Modal, Toast, Tag, Progress bar)
- [ ] Confirm open decisions: ORM, auth/IdP, hosting, UI library

## Phase 1 — Core domain (MVP)

- [ ] Auth + RBAC (5 roles), `/me`
- [ ] Sign in with Microsoft and Google (OIDC), `user_identities`, login page, Admin-provisioned users only
- [ ] People: directory API + UI (filters, table/cards, pagination), profile page
- [ ] Skills: claim/verify flow
- [ ] Projects + demand lines: list, detail, create/edit
- [ ] **Allocation validator service** + `/allocations/validate` (unit-test every rule)
- [ ] Allocate board UI (single + demand-line multi-pick) with live validation panel
- [ ] Derived status/utilisation service
- [ ] Audit log
- **Milestone M1:** a resource manager can find a person and safely allocate them.

## Phase 2 — Locks, release, bench

- [ ] Locks CRUD, promote, override rules, bulk lock
- [ ] Lock expiry job + 7-day reminder
- [ ] Release flow (immediate/planned, knowledge-transfer overlap), close project
- [ ] Bench list, threshold setting, bench counter, suggested matches, escalate
- [ ] Leave + holidays, calendar grid
- **Milestone M2:** full allocation lifecycle works end to end.

## Phase 3 — Insight

- [ ] Dashboard KPIs
- [ ] Planning: timeline (week/month), capacity vs demand
- [ ] Reports: allocation, utilisation, forecast vs actual; CSV/XLSX export; saved + scheduled
- [ ] Notifications feed + rules + email delivery/digests
- [ ] Global search
- **Milestone M3:** leadership reporting and proactive alerts live.

## Phase 4 — Integrations & hardening

- [ ] HRIS sync (read-only fields)
- [ ] Actuals import for forecast-vs-actual
- [ ] Concurrency tests for over-allocation, load/perf test on 1k+ people
- [ ] Accessibility pass, e2e (Playwright) for key journeys
- [ ] Observability, security review, backups
- [ ] Deployment pipelines, staging, UAT
- **Milestone M4:** production release.

## Next up (suggested first tasks)

1. Scaffold monorepo and CI.
2. Define Prisma schema from `DATABASE_DESIGN.md` and seed.
3. Implement allocation validator + tests (highest-risk logic).
4. Build People directory (API + UI).
