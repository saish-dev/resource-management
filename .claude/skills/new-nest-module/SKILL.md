---
name: new-nest-module
description: Scaffold a new NestJS domain module in apps/api (controller, service, DTOs, shared Zod schemas, RBAC, audit hook, test stub). Use when adding a domain area such as people, locks, bench, planning.
---

# New NestJS module

Argument: module name (kebab-case, e.g. `locks`).

1. Read `docs/SYSTEM_ARCHITECTURE.md` (module table), `docs/API_DESIGN.md` (its endpoints) and `docs/DATABASE_DESIGN.md` (its tables). If the module isn't listed, stop and ask.
2. Create `apps/api/src/<name>/` with `<name>.module.ts`, `<name>.controller.ts`, `<name>.service.ts`, `dto/`, `<name>.service.spec.ts`. Match existing modules' style if any exist.
3. Put request/response Zod schemas and enums in `packages/shared/src/<name>.ts` and export them; DTOs derive from these. Never duplicate types in `apps/web`.
4. Controllers stay thin: parse DTO, call service, return. Every route gets `@Roles(...)` per `API_DESIGN.md` and OpenAPI decorators.
5. Business logic lives in the service. Mutations that change allocation state call the `audit` service with actor, action, entity, before/after, reason.
6. Register the module in `app.module.ts`.
7. Write service unit tests for the happy path and each rule/permission failure.
8. Run `/pre-commit-check`. Update `docs/TASK_BREAKDOWN.md` if a task was completed.
