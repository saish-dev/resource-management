---
name: ui-component
description: Build a shared UI component in apps/web from the prototype's design tokens (light/dark, lozenges, bars, tags, tables, modals, toasts) with accessibility built in.
---

# UI component

1. Tokens come from the prototype (`THEMES` / `themeTokens`): brand lime `#98B828`, dark primary `#2D3328`, status colours (ok/warn/bad), neutral surfaces. Implement as CSS variables with a light and a dark set; theme choice persisted per user.
2. Component lives in `apps/web/src/components/ui/`, typed props, no data fetching.
3. Status lozenge mapping: Available=success, Allocated=in progress, Locked-Tentative=moved/warning, Locked-Confirmed=new/discovery, On Leave=default, Bench=removed/danger.
4. Utilisation bar turns danger colour above 100%.
5. Accessibility: semantic elements, labels, keyboard support, visible focus, contrast >= WCAG AA in both themes, no colour-only meaning (lozenges carry text).
6. Add a component test (Testing Library) and a story/example if Storybook is present.
