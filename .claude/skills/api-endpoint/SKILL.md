---
name: api-endpoint
description: Add or change a REST endpoint in the NestJS API with DTO validation, role guard, OpenAPI, error shape, tests, and docs/API_DESIGN.md update.
---

# Add an API endpoint

1. Check `docs/API_DESIGN.md`. If the endpoint isn't there, add it first (method, path, roles, body, response).
2. Zod schema in `packages/shared`; controller method with `@Roles`, `@ApiOperation`/`@ApiResponse`.
3. Errors follow the doc: 422 validation (per-field `details`), 409 rule violation with `checks[]`, 403 role, 404 missing.
4. Lists use `page,pageSize,sort,order` and return `{ data, meta }`; filters are server-side.
5. Scope data by role (Employee: own only; Delivery manager: own projects/teams).
6. Mutations write an audit entry.
7. Supertest e2e: success, validation error, forbidden role, not found.
8. Keep `docs/API_DESIGN.md` in sync; run `/pre-commit-check`.
