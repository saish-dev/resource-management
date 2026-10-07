---
name: docs-sync
description: Reconcile the 8 project docs with the code and update TASK_BREAKDOWN checkboxes. Use after finishing a task or before a release.
---

# Docs sync

1. Diff what exists in code against `docs/`: routes vs `API_DESIGN.md`, `schema.prisma` vs `DATABASE_DESIGN.md`, modules vs `SYSTEM_ARCHITECTURE.md`, dependencies vs `TECH_STACK.md`, rules vs `PRODUCT_REQUIREMENTS.md`.
2. Fix drift in the doc (or flag it if the code looks wrong; don't silently pick a side).
3. Tick finished items and move the "Next up" list in `docs/TASK_BREAKDOWN.md`; update "Current state".
4. Remove _(proposed)_ from `TECH_STACK.md` once a choice is confirmed and in use.
5. Update the Commands block in `CLAUDE.md` when scripts change.
6. Report a short list of what changed.
