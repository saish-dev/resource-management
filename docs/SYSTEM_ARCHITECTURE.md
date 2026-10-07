# System Architecture

## High-level
```
Browser ── Next.js (apps/web) ──HTTPS/REST──▶ NestJS API (apps/api) ──▶ PostgreSQL
                                                │  ├─▶ Redis/BullMQ (jobs)
                                                │  ├─▶ SMTP/SES (email)
                                                │  └─▶ HRIS (sync in)  ·  IdPs (Microsoft, Google via OIDC)
```

## Local topology (Docker Compose)
`web` (3000) -> `api` (3001) -> `db` (Postgres 16, 5432) and `redis` (6379). Containers talk by service name; host tools use `localhost` with published ports. Migrations run via `prisma migrate deploy`; seeding is manual.

## Components
**Frontend (Next.js)** — routes mirror prototype screens:
`/dashboard`, `/people`, `/people/[id]`, `/people/new`, `/projects`, `/projects/[code]`, `/projects/new`, `/projects/[code]/demand/new`, `/projects/[code]/close`, `/allocate`, `/locks`, `/release`, `/bench`, `/planning` (timeline, `/planning/capacity`), `/reports`, `/notifications`, `/search`, `/settings`.

**Backend (NestJS modules)**
| Module | Responsibility |
|---|---|
| `auth` | OIDC login (Microsoft, Google), session/JWT, RBAC guard + `@Roles()` |
| `people` | Employee CRUD (HRIS-owned fields guarded), directory queries, derived status |
| `skills` | Skill catalogue, claims, verification queue |
| `leave` | Leave requests, holidays/regions |
| `projects` | Projects, demand lines, close-and-release |
| `allocations` | Create/validate/update allocations, utilisation calc |
| `locks` | Create/promote/override/expire locks |
| `releases` | Immediate/planned release, knowledge transfer |
| `bench` | Bench list, threshold, matches |
| `planning` | Timeline and capacity-vs-demand aggregations |
| `reports` | Report queries, export, saved/scheduled |
| `notifications` | Rules, feed, email dispatch |
| `settings` | Thresholds, mismatch rule, roles |
| `audit` | Append-only audit log (interceptor + explicit events) |
| `hris` | Inbound sync (scheduled) |
| `jobs` | Cron/queue processors |

## Key design decisions
1. **Validation lives on the server.** The allocation validator (capacity, duplicate, skill fit, lock, date checks) is one domain service returning `{checks[], blocked, needsAck}`. The same endpoint is used for live preview (`POST /allocations/validate`) and commit, so UI and save cannot diverge. Commit re-validates inside a transaction with row locks on the person to prevent concurrent over-allocation.
2. **Status and utilisation are derived**, not stored as truth: computed from allocations, locks, leave, releases for a given date (optionally materialised/cached for the directory).
3. **Time-based effects via jobs**: lock auto-expiry, release effective date → status change and bench counter start, pre-expiry reminders, digests.
4. **Shared contracts** in `packages/shared` (Zod schemas + enums: statuses, lock types, priorities, roles).
5. **Audit everything that mutates allocation state** (who, what, reason, before/after).
6. **RBAC at the API**; UI hides, API enforces. Employees only see own data; Delivery managers scoped to their projects/teams.

## Data flow: allocate a person
1. UI picks person/project/% /dates → debounced `POST /allocations/validate`.
2. Panel renders checks; ack required for warnings; errors disable save.
3. `POST /allocations` → re-validate in txn → insert allocation, remove overridden tentative lock, update demand fulfilment, write audit, emit event.
4. Event handlers: notifications (over-allocation attempted, etc.), cache invalidation.
5. Client invalidates queries (person, directory, project, dashboard).

## Non-functional
- Pagination for directory (hundreds–thousands of people); server-side filter/sort.
- Timezones: store dates as UTC dates (no time); display local. Workday calc excludes weekends and regional holidays.
- Observability: structured logs, health endpoint, error tracking.
- Security: OWASP basics, rate limiting, CSRF for cookie auth, secrets via env.
