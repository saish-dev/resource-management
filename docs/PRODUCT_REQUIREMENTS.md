# Product Requirements

Source of truth for behaviour: the prototype. Section names map to its navigation: Dashboard, People, Projects, Allocate, Locks, Bench, Planning, Reports, Settings (+ Notifications, Search).

## Core business rules

1. **Capacity ceiling** — total allocation % for a person across overlapping dates must be ≤ 100. Exceeding is a **hard block**.
2. **Duplicate** — a person cannot have two overlapping allocations on the same project (block).
3. **Skill fit** — compare person's _verified_ skills to project/demand skills. No overlap = warning; behaviour is configurable (`Warn, allow with acknowledgment` | `Hard block` | `Warn, require manager override`).
4. **Locks** — a confirmed lock overlapping the window blocks (Admin override only). A tentative lock overlapping warns; allocating overrides and releases it.
5. **Start before project start** — warning; pre-start time recorded as non-billable ramp-up.
6. **Overlap with other work** — informational; load is shared and counted in the capacity check.
7. **Status derivation** — locks > allocation (>0%) > On Leave > Bench (explicit or released) > Available.
8. **Bench** — status Bench with days-since > threshold is flagged; counter starts on the effective release date.
9. **Skills** — employee _claims_ a skill; a lead verifies/declines; only verified skills count in matching.
10. **HRIS-owned fields** (name, role, band, location, employment dates) are read-only once linked.
11. Every release/override writes to the **audit trail** with user id and reason.

## Feature areas and acceptance criteria

### 1. Dashboard

- KPIs: average utilisation (excl. on leave), bench count and number past threshold, open demand (need − filled across projects), people at ≥100%.
- Team utilisation bars; alerts count; link-outs to Bench, Capacity, Notifications.
- Export snapshot.
- **AC:** numbers recalculate immediately after any allocation/lock/release.

### 2. People (directory + profile)

- Table and card views; search by name/skill; filters: status, skill, team, band, location, extra (past-bench, full); sort; pagination; multi-select (bulk lock).
- Each row shows status lozenge, utilisation bar, and a hint (free %, "held for X until date", best matching open role, bench days).
- Profile: allocations (with release action), 24-week load chart, leave calendar (month grid, holidays by region, approved leave), skills + verification state, audit trail, top-3 suggested demand matches, add leave.
- Create/edit person (HRIS fields locked when linked).
- **AC:** a user can find "Available React developers in Lisbon" in ≤3 interactions.

### 3. Projects and demand

- Project list (priority, dates, phase, staffing fill %). Detail: demand lines (role, skills, need, filled, window, state Open/Partly filled/Fulfilled), allocated team, effort/budget (effort, used, billable %).
- Create/edit project (code unique, name required). New project starts with no demand.
- Add demand line (role, skills, headcount ≥1) with "Raise" or "Raise and staff now"; shows who can fill today.
- Close project: select team members, set release date/reason, shows bench forecast.
- **AC:** adding a demand line updates project need and the skill-gap view.

### 4. Allocate (board)

- Pick project, filter candidates by skill; modes: single person or whole demand line (multi-pick).
- Form: % (10–100), billable, start/end. Live validation panel (error/warning/success/info) per rules above; capacity-after preview.
- Warnings require acknowledgment; errors disable save; in multi mode blocked people are skipped and reported.
- **AC:** saving updates utilisation, status, demand fulfilment and profile immediately; toast confirms.

### 5. Locks and pipeline

- List/timeline of locks sorted by expiry with countdown (red when ≤30 days tentative). Create (single/bulk), promote tentative→confirmed, override (tentative by RM; confirmed by Admin), allocate from lock.
- Auto-release at expiry; reminder 7 days before.

### 6. Release

- Immediate or planned date; reason; optional knowledge transfer with an incoming person (validated for capacity) for a 5-day overlap.
- Preview of before/after status, downstream effects (demand fulfilment drops, open demand line raised, audit entry).

### 7. Bench

- People past threshold ranked by days; suggested open demand with fit %; actions: Allocate, Escalate to practice lead, Soft-book (lock). Compare-to-open-demand view.

### 8. Planning

- Allocation timeline (weekly/monthly) with billable, non-billable and lock bars, today marker.
- Capacity vs demand per skill: supply (unallocated incl. tentative locks, excl. confirmed) vs demand, gap in FTE.

### 9. Reports

- Types: Allocation, Utilization, Forecast vs actual. Weekly/monthly, date range, team filter, chart + table, note.
- Export CSV/Excel; save report; schedule (e.g., monthly to leadership).

### 10. Notifications and rules (Settings)

- Rules (event, trigger, audience, channel in-app/email, frequency): over-allocation attempted, bench threshold passed, lock about to expire (7d), release approaching (14d), skill gap on demand line (off by default), leave request overlapping allocation.
- Notification feed with kind filters.

### 11. Settings / Admin

- Roles & access matrix, bench threshold, skill-mismatch rule, notification rules, saved/scheduled reports.

### 12. Leave

- Leave requests (annual/sick/parental; Pending/Approved/Rejected). Approved leave shows on calendar and affects availability. Regional holidays (India, South Korea, Europe, Japan, All).

### Cross-cutting

- **Sign-in**: users sign in with Microsoft or Google (OIDC); no local passwords. Only users already provisioned by an Admin can sign in (matched on verified email); unknown accounts see a plain "no access, contact an admin" message. A user may link both providers to one account. Role comes from `users.role`, never from the provider. _(confirmed: no self-signup, Admin pre-provisions)_
- Global search; light/dark theme persisted per user; accessible (keyboard, labels, contrast); toasts for outcomes.

## Open questions

- Who is source of truth for leave (HRIS vs here)? Prototype lets users add approved leave.
- Fiscal horizon: fixed 12 months (Jul–Jun) or rolling?
- Email delivery provider and digest scheduling.
- HRIS integration (vendor, sync cadence).
- Microsoft tenant: single-tenant (company only) or multi-tenant? Google: restrict to the company Workspace domain (`hd`) or allow any Google account that matches a provisioned email?
