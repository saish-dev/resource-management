---
name: release
description: Prepare a release - changelog, migration check, docs sync, version, deploy checklist. Use only when the user asks to cut a release.
---

# Release

1. Confirm clean `main`, CI green, `/pre-commit-check` passes, `/docs-sync` done.
2. Changelog from Conventional Commits since last tag, grouped (feat, fix, perf, breaking).
3. Migrations: list pending ones, confirm they're backward compatible with the previous app version (expand/contract), note any data backfill.
4. Bump versions, tag. **Ask before** pushing tags or deploying; those are outward-facing.
5. Deploy checklist: env vars added, jobs/schedules, rollback plan, post-deploy smoke test (login, directory loads, validate endpoint, one allocation in staging).
