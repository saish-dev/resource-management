---
name: dev-pipeline
description: Orchestrator that runs the full development pipeline for a task - pick/plan, port prototype spec, schema, rules, API, UI, tests, checks, review, docs sync. Use to build a feature end to end (e.g. "/dev-pipeline allocate board") or to take the next task from TASK_BREAKDOWN.
---

# Dev pipeline (orchestrator)

Argument: a feature/screen, or empty to take the first unchecked item under "Next up" in `docs/TASK_BREAKDOWN.md`.

Run the stages in order. Skip a stage only if clearly not applicable, and say which and why. Stop and ask the user at the marked gates. Commit automatically on a feature branch when checks pass (no need to ask); don't merge to `main` or push unless asked.

## 0. Intake

- Read `CLAUDE.md`, then the sections of `PRODUCT_REQUIREMENTS.md`, `API_DESIGN.md`, `DATABASE_DESIGN.md` relevant to the task.
- State the task, acceptance criteria (from the PRD), and which phase/milestone it belongs to.
- If scaffold is missing (no `apps/`), the task is Phase 0: set up the monorepo first, then `/docker-local` for the Dockerfiles and compose services.
- Make sure the local stack is up (`docker compose up -d db redis`) before data-layer or integration-test stages.

## 1. Plan (GATE: confirm if scope is large or touches unconfirmed _(proposed)_ tech)

- List stages needed, files to create/change, risks. Keep it short.
- If a _(proposed)_ choice in `TECH_STACK.md` is needed and unconfirmed, ask now.

## 2. Spec from prototype

- UI task -> `/port-from-prototype <screen>`; capture the brief.

## 3. Data layer

- Schema change needed -> `/prisma-change`. Seed needed -> `/seed-data`.

## 4. Domain rules

- Any validation/lock/release/bench behaviour -> `/add-business-rule` (API-only).

## 5. API

- New domain area -> `/new-nest-module`; endpoints -> `/api-endpoint`; background effects -> `/new-job`; reports -> `/new-report`.

## 6. Frontend

- Shared pieces -> `/ui-component`; screen -> `/new-next-page`.

## 7. Tests

- `/write-tests` for each layer touched (unit for rules, integration for API, e2e for key journeys).

## 8. Verify

- `/pre-commit-check`. Fix failures and re-run; if still failing, report rather than proceed.
- If UI changed, run the app and exercise the golden path and one error path (use the `run` skill).

## 9. Review

- Invoke the `rules-reviewer` agent on the diff.
- `/security-check` if auth, roles, data scoping, exports or integrations changed.
- Fix findings, re-run stage 8.

## 10. Close out

- `/docs-sync`: update docs and tick `TASK_BREAKDOWN.md`.
- Summarise: what was built, tests run and results, deviations from docs/prototype, open questions, suggested next task.
- Commit (Conventional Commits, one commit per logical unit, formatting-only changes in their own `style:` commit) on the feature branch. Don't wait for approval. Offer to merge/push afterwards.

## Rules for the orchestrator

- Each stage invokes the named skill; follow that skill's instructions rather than improvising.
- Independent stages (e.g. API and UI for a settled contract) may run in parallel via subagents; the contract in `packages/shared` must be written first.
- Never mark done on unrun checks. Report outcomes faithfully.
- Release is separate: use `/release` only when asked.
