import type { ReactNode } from 'react';

export function Tag({
  children,
  onRemove,
}: {
  children: ReactNode;
  onRemove?: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm bg-neutral px-1.5 text-xs leading-5 text-ink">
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${typeof children === 'string' ? children : 'tag'}`}
          className="rounded-xs px-0.5 text-subtle hover:bg-neutral-hover hover:text-ink"
        >
          ×
        </button>
      )}
    </span>
  );
}
