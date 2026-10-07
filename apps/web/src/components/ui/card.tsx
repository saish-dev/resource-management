import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Card({
  title,
  actions,
  className,
  children,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  title?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section
      className={cn('rounded-lg border border-line bg-raised p-4', className)}
      {...props}
    >
      {(title || actions) && (
        <header className="mb-3 flex items-center justify-between gap-2">
          {title && <h2 className="text-base font-bold">{title}</h2>}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
