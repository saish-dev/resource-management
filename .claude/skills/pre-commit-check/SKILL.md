---
name: pre-commit-check
description: Run lint, typecheck and tests for changed packages and report results honestly. Use before declaring any task done or committing.
---

# Pre-commit check

1. Find changed packages (`git status`, `git diff --name-only`).
2. Run in order and stop to fix on first failure: `pnpm lint`, `pnpm typecheck`, `pnpm test` (use `--filter` for changed packages). If scripts don't exist yet, say so rather than skipping silently.
3. If the schema changed, confirm a migration exists and `prisma validate` passes.
4. Check no `.env*` or secrets are staged.
5. Report: what ran, pass/fail, exact failing output. Never say "passing" for something not run.
