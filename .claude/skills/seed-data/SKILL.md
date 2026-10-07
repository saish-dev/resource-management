---
name: seed-data
description: Create or update the Prisma seed from the prototype's PEOPLE, PROJECTS, HOLIDAYS, leave, skill requests and notification rules, with deterministic generated volume data.
---

# Seed data

1. Source: prototype constants (use `/port-from-prototype` unpack). 12 named people, 5 projects (P-101..P-105), holidays, SEED_LEAVE, SEED_SKILL_REQS, SEED_RULES.
2. Write `apps/api/prisma/seed.ts`, idempotent (upsert by natural keys: project code, hris_id, skill name).
3. Generated volume (prototype made 238 extra people with a seeded LCG, seed 7): reproduce deterministically so tests and demos are stable; configurable count via env.
4. Use fixed dates relative to a documented "today" for demo; don't hard-code in app code.
5. Seed dev only; never run against production.
6. Run `prisma db seed` and check counts (people, allocations, locks).
