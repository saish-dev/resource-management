# Project Overview — Resource Management

## What it is
An internal web app for an engineering services organisation to see who is available, assign people to projects, hold people for future work, release them when work ends, and plan capacity against demand. It replaces spreadsheets and ad-hoc messaging with a single source of truth for allocation.

The current artefact is a **clickable prototype** (`resource_management_v2.html`, built with an Atlassian-style design system, React, in-memory seeded data). It is the UX/behaviour reference for the real build: **Next.js (frontend) + NestJS (backend)**.

## Problem being solved
- Nobody can see true availability: allocations, tentative holds, leave, and bench time live in different places.
- Over-allocation (>100%) and skill mismatches are caught late, if at all.
- People sit on the bench unnoticed; ending projects release people with no knowledge-transfer planning.
- Leadership cannot see skill supply vs. upcoming demand, so hiring/reskilling is reactive.

## Goals
1. One accurate, live view of every person's status and utilisation.
2. Make allocation safe: validate capacity, skills, dates and locks *before* saving.
3. Soft-book people for pipeline work with locks (tentative / confirmed) that auto-expire.
4. Surface bench risk and open demand early, with suggested matches.
5. Give leadership capacity-vs-demand and utilisation reporting.

## Non-goals (for now)
- Timesheets / actual hours capture (forecast-vs-actual FTE uses imported actuals).
- Payroll, HR master data (name, role, band, location, employment dates sync **from HRIS**, read-only here).
- Recruiting/ATS workflow.

## Users and roles
| Role | Purpose |
|---|---|
| Admin | Everything, plus thresholds, roles, integrations, confirmed-lock overrides |
| Resource manager | Allocate, release, place/override tentative locks, manage bench |
| Delivery manager | Raise demand, view own team and pipeline, request locks |
| Practice lead | View skill supply vs demand, manage bench in their capability, verify skills |
| Employee | Read-only view of own allocation, availability, upcoming assignments |

## Domain glossary
- **Allocation** — a person assigned to a project at a % of capacity for a date range; billable or non-billable.
- **Utilisation** — sum of a person's concurrent allocation %. Ceiling is 100%.
- **Status** — Available, Allocated, Locked-Tentative, Locked-Confirmed, On Leave, Bench.
- **Lock** — soft booking of a person for a project with an expiry. Tentative: any resource manager can override; auto-releases at expiry. Confirmed: blocks others; only Admin can override.
- **Bench** — unallocated beyond a threshold (default 14 days, configurable 5–60).
- **Demand line** — a request on a project: role, skills, headcount needed vs filled.
- **Band** — seniority grade B2–B6.
- **Release** — ending an allocation, immediate or planned, optionally with a knowledge-transfer overlap (default 5 days).

## Reference data in the prototype
12 hand-written people + 238 generated, 5 projects (P-101 … P-105), 4 teams (Platform engineering, Digital product, Quality engineering, Data and analytics), planning horizon 1 Jul 2026 – 30 Jun 2027.
