'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';

// Native <dialog>: focus is trapped, Escape closes, and focus returns to the opener.
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-xl border border-line bg-raised p-0 text-ink shadow-xl"
    >
      <div className="p-6">
        <h2 id={titleId} className="mb-4 text-xl font-bold">
          {title}
        </h2>
        {children}
      </div>
      {footer && (
        <div className="flex justify-end gap-2 px-6 pb-6">{footer}</div>
      )}
    </dialog>
  );
}
