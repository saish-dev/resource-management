---
name: new-report
description: Add a report type (query, chart data, table, CSV/XLSX export, saved/scheduled report) to the reports module and UI.
---

# New report

1. Define in `docs/PRODUCT_REQUIREMENTS.md` section 9: name, metrics, filters (date range, team, grain), chart, table, note.
2. API: `GET /reports/:type` returns `{ columns, rows, chart, note }`; export via `?format=csv|xlsx` using the same query (no second implementation). Aggregate in SQL.
3. Real data only: don't port the prototype's hard-coded numbers.
4. Saved/scheduled: reuse `saved_reports`.
5. UI: table + chart + weekly/monthly toggle, accessible chart (data table alternative).
6. Tests with known fixtures and exact expected figures. Update `docs/API_DESIGN.md`.
