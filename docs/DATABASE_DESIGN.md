# Database Design (PostgreSQL)

Implemented in `apps/api/prisma/schema.prisma` (Prisma 7, Postgres 16) with raw-SQL rules in `apps/api/prisma/migrations`. Derived from prototype data shapes. Types are Postgres; names snake_case. IDs are UUIDs unless noted.

## Enums

- `person_status`: AVAILABLE, ALLOCATED, LOCKED_TENTATIVE, LOCKED_CONFIRMED, ON_LEAVE, BENCH _(derived, **not** a DB enum; Zod enum in `packages/shared`)_
- `lock_type`: TENTATIVE, CONFIRMED
- `priority`: HIGH, MEDIUM, LOW
- `project_phase`: PIPELINE, MOBILISING, IN_FLIGHT, CLOSING
- `leave_status`: PENDING, APPROVED, REJECTED
- `leave_type`: ANNUAL, SICK, PARENTAL, OTHER
- `skill_claim_status`: PENDING, VERIFIED, DECLINED
- `release_type`: IMMEDIATE, PLANNED
- `app_role`: ADMIN, RESOURCE_MANAGER, DELIVERY_MANAGER, PRACTICE_LEAD, EMPLOYEE
- `auth_provider`: MICROSOFT, GOOGLE
- `notification_channel`: IN_APP, EMAIL, BOTH
- `notification_frequency`: IMMEDIATE, DAILY, WEEKLY

## Tables

### `users`

`id`, `email` (unique), `name`, `role app_role`, `person_id` → people (nullable, unique: one user per person), `created_at`

### `user_identities`

`id`, `user_id` → users, `provider` (`MICROSOFT` | `GOOGLE`), `subject` (provider's stable user id), `email`, `created_at`, `last_login_at`; unique (`provider`, `subject`). Links one user to one or more providers.

### `teams`

`id`, `name` (unique) — Platform engineering, Digital product, Quality engineering, Data and analytics

### `people` _(HRIS-owned fields marked †)_

`id`, `hris_id` (unique, nullable), `name`†, `role_title`†, `band`† (B2–B6), `team_id`†, `location`†, `region`†, `timezone`†, `hours_per_day` (default 8)†, `employment_start`†, `employment_end`†, `verifier_id` → people, `bench_since date` (nullable), `created_at`, `updated_at`

### `skills`

`id`, `name` (unique)

### `person_skills`

`person_id`, `skill_id`, `status skill_claim_status`, `evidence text`, `verified_by` → people, `verified_at`; PK (`person_id`,`skill_id`). Only VERIFIED count in matching.

### `projects`

`id`, `code` (unique, e.g. P-101), `name`, `client`, `priority`, `phase`, `start_date`, `end_date`, `lead_id` → people (nullable), `lead_name` (display name until the lead is linked to a person; the prototype leads are not people), `effort_hours`, `effort_used_hours`, `billable_pct`, `closed_at`

### `project_skills`

`project_id`, `skill_id`

### `demand_lines`

`id`, `project_id`, `role_title`, skills via `demand_line_skills` (`demand_line_id`, `skill_id`), `headcount_needed int ≥1`, `start_date`, `end_date`. _Filled_ = count of allocations linked via `demand_line_id` (derived).

### `allocations`

`id`, `person_id`, `project_id`, `demand_line_id` (nullable), `pct int CHECK 1..100`, `billable bool`, `start_date`, `end_date`, `released_at` (a `releases` row points back to the allocation), `created_by`, `created_at`
Indexes: (`person_id`, `start_date`, `end_date`), (`project_id`).
Constraints (migration SQL): `pct` 1..100, `end_date >= start_date`, and no overlapping live rows (`released_at IS NULL`) for the same (`person_id`, `project_id`) → `EXCLUDE USING gist` on `daterange(start,end,'[]')` (needs `btree_gist`). `released_at` is set only when a release takes effect: a planned release records a `releases` row and keeps the allocation live (still counted by the overlap constraint) until its effective date. A trigger rejects a `demand_line_id` that belongs to a different project (Prisma cannot model the composite FK without dropping it on the next diff). Sum-of-pct ≤ 100 enforced in service inside a transaction (`SELECT … FOR UPDATE` on person), optionally verified by a deferred trigger.

### `locks`

`id`, `person_id`, `project_id`, `type lock_type`, `pct` (optional), `start_date`, `expires_on`, `created_by`, `promoted_at`, `released_at`, `release_reason`

### `releases`

`id`, `allocation_id`, `type release_type`, `effective_date`, `reason`, `knowledge_transfer bool`, `incoming_person_id` (nullable), `kt_start`, `kt_end`, `created_by`, `created_at`

### `leave_requests`

`id`, `person_id`, `type`, `from_date`, `to_date`, `status`, `decided_by`

### `holidays`

`id`, `date`, `name`, `region` ('India', 'South Korea', 'Europe', 'Japan', 'All regions')

### `notification_rules`

`id`, `event` (unique), `trigger_desc`, `audience text[]`, `enabled`, `channel` (IN_APP | EMAIL | BOTH), `frequency` (IMMEDIATE | DAILY | WEEKLY)

### `notifications`

`id`, `user_id`, `kind`, `title`, `detail`, `link`, `created_at`, `read_at`

### `saved_reports`

`id`, `owner_id` (nullable = system report), `name`, `type`, `scope jsonb`, `schedule`, `recipients text[]`

### `settings`

`key` (PK), `value jsonb` — `bench_threshold_days` (14, range 5–60), `skill_mismatch_rule` (`WARN_ACKNOWLEDGE` default, `HARD_BLOCK`, `WARN_OVERRIDE`), etc.

### `audit_log`

`id`, `actor_id`, `action`, `entity_type`, `entity_id`, `before jsonb`, `after jsonb`, `reason`, `created_at` (append-only: DB triggers reject UPDATE, DELETE and TRUNCATE; a runtime DB role without trigger/ALTER rights is still to do)

## Relationships

- team 1–N people; person N–N skills; project 1–N demand_lines; project 1–N allocations; person 1–N allocations/locks/leave.
- allocation 0–1 release; demand_line 1–N allocations.

## Derived (computed in queries/services, not stored)

- **Utilisation(person, date)** = Σ `pct` of allocations covering date, minus nothing for released-after dates.
- **Status(person, date)** = confirmed/tentative lock → LOCKED_*; else utilisation > 0 → ALLOCATED; else approved leave → ON_LEAVE; else released/benched → BENCH; else AVAILABLE.
- **Bench days** = today − `bench_since` (set when last allocation ends; cleared on new allocation).
- **Demand fulfilment** = Σ filled vs `headcount_needed`.
- **Capacity vs demand per skill** = Σ free capacity (incl. tentative-lock people, excl. confirmed) vs open demand headcount.

## Seed data

`apps/api/prisma/seed.ts` (data in `seed-data.ts`, ported from the prototype). 12 named people + 238 generated with the prototype's LCG (seed 7; `SEED_EXTRA_PEOPLE` changes the count), 5 projects with demand lines, holidays, leave, skill requests, notification rules, saved reports, settings. Demo "today" is 2026-09-08. Idempotent: reference data is upserted by natural key (`hris_id`, project `code`, skill name, rule event); allocations, locks, leave and skill claims of seeded people are replaced. Locks are created for people the prototype shows as locked (tentative expires 2026-10-31, confirmed 2026-11-30). Prototype "filled" counts are linked to allocations by role as far as the data allows; fill is derived, so numbers can differ slightly. Dev only; refuses to run when `NODE_ENV=production`. Run with `pnpm --filter api db:seed`.
