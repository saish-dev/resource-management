---
name: port-from-prototype
description: Extract a screen's behaviour, copy, data and validation from the bundled prototype HTML and turn it into a build brief mapped to docs, endpoints and tables. Use before building any screen.
---

# Port a prototype screen

The prototype is `resource_management_v2.html` (a bundle; never edit it).

1. Unpack to the scratchpad (not the repo): parse `<script type="__bundler/template">` (JSON string) from the HTML; the logic is in its `text/x-dc` script (class `Component`, state, `renderVals`) and markup uses `{{ }}` bindings.
2. For the requested screen (`dashboard, directory, profile, projects, projectDetail, board, pipeline, release, bench, timeline, capacity, reports, notifications, admin, forms, closeProject, search`) find its `renderVals` block and handlers (`confirmAlloc`, `confirmLock`, `confirmRelease`, ...).
3. Produce a brief: purpose, data shown, filters, actions, validation rules and exact copy, states (empty/error/success), derived values and how they're calculated.
4. Map to: `docs/PRODUCT_REQUIREMENTS.md` section, `docs/API_DESIGN.md` endpoints (flag missing ones), `docs/DATABASE_DESIGN.md` tables.
5. Call out prototype shortcuts that must not be copied: in-memory state, hard-coded dates (today = 2026-09-08), mocked report numbers, mutated global arrays, hard-coded alert counts.
6. Output the brief in chat (don't write it into the repo unless asked).
