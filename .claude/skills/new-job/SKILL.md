---
name: new-job
description: Add a scheduled or queued background job (lock expiry, bench counter, release effective date, reminders, digests, HRIS sync) with idempotency and tests.
---

# New background job

1. Jobs live in `apps/api/src/jobs/` (cron via `@nestjs/schedule`, queues via BullMQ once confirmed).
2. Must be **idempotent** (safe to run twice or after downtime): select by condition (e.g. `expires_on <= today AND released_at IS NULL`), not by "since last run".
3. Do work in transactions; write an audit entry for state changes; emit notification events instead of sending email inline.
4. Time is injected (clock service) so tests can control "today".
5. Log counts processed; failures retried with backoff and surfaced.
6. Tests: due, not due, already processed, partial failure.
7. Document the job and schedule in `docs/SYSTEM_ARCHITECTURE.md`.
