---
name: add-business-rule
description: Add or change a business rule in the allocation/lock/release validators (capacity, skill fit, lock overlap, dates, bench). Use whenever domain behaviour changes. Rules live only in the API.
---

# Add or change a business rule

1. Read the rules section of `docs/PRODUCT_REQUIREMENTS.md`. Update it first (number, wording, level: error blocks, warning needs acknowledgment, information, success).
2. Implement in the single validator service in `apps/api/src/allocations/` returning `{ checks[], blocked, needsAck }`. Each check: `{ level, title, detail }` with the prototype's plain-language wording.
3. Used by both `POST /allocations/validate` (preview) and commit (re-validated inside a transaction, row lock on the person). Don't add a second code path.
4. Unit tests: one passing and one failing case per rule, plus boundaries (exactly 100%, adjacent dates, same-day lock expiry, confirmed vs tentative lock, each skill-mismatch mode).
5. If the rule is configurable, add the setting (`settings` table, `docs/API_DESIGN.md`, admin UI).
6. Never copy the rule into `apps/web`; the UI only renders `checks`.
7. Run `/pre-commit-check`; invoke the `rules-reviewer` agent on the diff.
