'use client';

import { useSyncExternalStore } from 'react';
import { Button } from './button';

export type Theme = 'light' | 'dark';
const KEY = 'rm-mode';

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => mo.disconnect();
}

// Choice is stored in this browser; once users exist it moves to the user profile.
export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    currentTheme,
    () => 'light' as Theme,
  );
  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  return (
    <Button
      variant="subtle"
      aria-label={`Switch to ${next} theme`}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem(KEY, next);
        } catch {
          /* storage blocked: the choice lasts for this page view */
        }
      }}
    >
      {theme === 'dark' ? 'Light theme' : 'Dark theme'}
    </Button>
  );
}
