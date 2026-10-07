import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Table({
  caption,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableElement> & { caption?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-raised">
      <table
        className={cn('w-full border-collapse text-left', className)}
        {...props}
      >
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

export function Th({
  className,
  scope = 'col',
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope={scope}
      className={cn(
        'border-b-2 border-line p-2 text-xs font-bold text-subtle',
        className,
      )}
      {...props}
    />
  );
}

export function Td({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('border-b border-line p-2', className)} {...props} />
  );
}

export function Tr({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('hover:bg-hover', className)} {...props} />;
}
