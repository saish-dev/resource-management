---
name: prisma-change
description: Change the database schema safely - edit schema.prisma, create a migration, update seed and docs/DATABASE_DESIGN.md. Use for any new table, column, enum, index or constraint.
---

# Prisma schema change

1. Read `docs/DATABASE_DESIGN.md` for the intended model and conventions (snake_case DB names via `@map`, UUID ids, dates as `@db.Date`).
2. Edit `apps/api/prisma/schema.prisma`. For rules Prisma can't express (no overlapping allocations per person+project; `pct` 1..100) add them as raw SQL in the migration (exclusion constraint with `daterange`, CHECK).
3. `pnpm --filter api prisma migrate dev --name <short-description>`; review the generated SQL before accepting. Never edit an applied migration.
4. Add indexes for new filter/join paths (e.g. allocations by person+date range).
5. Update `prisma/seed.ts` if the table needs seed rows (prototype data: PEOPLE, PROJECTS, HOLIDAYS, SEED_LEAVE, SEED_SKILL_REQS, SEED_RULES).
6. Update `docs/DATABASE_DESIGN.md` in the same change, and `packages/shared` enums if an enum changed.
7. Flag destructive changes (drops, type changes) to the user before running them.
8. Run API tests via `/pre-commit-check`.
