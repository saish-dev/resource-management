---
name: security-check
description: Project-specific security pass - RBAC on every route, data scoping by role, input validation, audit coverage, secrets. Complements the built-in security-review skill.
---

# Security check

1. Every controller route has `@Roles`; list any without. Employees only reach own data; Delivery managers only their projects/teams (check query scoping, not just guards).
2. Confirmed-lock override is Admin only; HRIS-owned person fields are rejected on write when linked.
3. All inputs validated (Zod/DTO); no raw SQL with interpolation; Prisma `$queryRaw` uses parameters.
4. Cookie auth: httpOnly, secure, sameSite, CSRF protection; rate limiting on auth and export endpoints.
5. Mutations to allocations/locks/releases/roles write audit entries.
6. No secrets in code or git; `.env*` ignored; `.env.example` has no real values.
7. Exports can't leak data beyond the user's scope.
8. Then run the built-in `security-review`. Report findings by severity with file:line.
