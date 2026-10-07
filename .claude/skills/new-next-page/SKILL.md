---
name: new-next-page
description: Scaffold a Next.js App Router route in apps/web that mirrors a prototype screen (page, query hooks, loading/error/empty states). Use when building any screen from the prototype.
---

# New Next.js page

Argument: route (e.g. `/people/[id]`) or prototype screen name.

1. Run `/port-from-prototype <screen>` first if no screen brief exists; use its output as the spec.
2. Create `apps/web/src/app/<route>/page.tsx` (server component for initial read where practical), plus `loading.tsx` and `error.tsx`.
3. Interactive parts go in small `'use client'` components under `apps/web/src/features/<area>/`. Data access via typed hooks (TanStack Query once confirmed) calling the API with types from `packages/shared`.
4. No business rules in the UI. Validation results, status, utilisation and fit % come from the API; the UI only renders them.
5. Use design tokens/components from the shared UI layer (`/ui-component`); handle loading, empty, error, and permission-denied states.
6. Copy: sentence case, outcome-oriented, reuse the prototype's toast/validation wording.
7. Accessibility: labelled controls, keyboard operable, focus visible, works in light and dark.
8. Add a component test and, for key journeys, a Playwright test via `/write-tests`. Run `/pre-commit-check`.
