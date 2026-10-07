'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

export type ToastKind = 'success' | 'error' | 'info';
type ToastItem = { id: number; kind: ToastKind; message: string };

const kinds: Record<ToastKind, string> = {
  success: 'bg-success-bg text-success-fg',
  error: 'bg-danger-bg text-danger-fg',
  info: 'bg-info-bg text-info-fg',
};

const ToastContext = createContext<
  ((message: string, kind?: ToastKind) => void) | null
>(null);

export function useToast() {
  const push = useContext(ToastContext);
  if (!push) throw new Error('useToast must be used inside <ToastProvider>');
  return push;
}

export function ToastProvider({
  children,
  durationMs = 5000,
}: {
  children: ReactNode;
  durationMs?: number;
}) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback(
    (id: number) => setItems((l) => l.filter((t) => t.id !== id)),
    [],
  );
  const push = useCallback(
    (message: string, kind: ToastKind = 'success') => {
      const id = nextId.current++;
      setItems((l) => [...l, { id, kind, message }]);
      setTimeout(() => dismiss(id), durationMs);
    },
    [dismiss, durationMs],
  );
  const value = useMemo(() => push, [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              'flex items-start justify-between gap-2 rounded-lg p-3 shadow-lg',
              kinds[t.kind],
            )}
          >
            <span>{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="rounded-xs px-1 hover:bg-neutral"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
