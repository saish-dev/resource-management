import type { ReactNode } from 'react';
import type { PersonStatus } from '@rm/shared';
import { cn } from '@/lib/cn';

export type LozengeAppearance =
  'success' | 'inprogress' | 'moved' | 'new' | 'default' | 'removed';

const appearances: Record<LozengeAppearance, string> = {
  success: 'bg-success-bg text-success-fg',
  inprogress: 'bg-info-bg text-info-fg',
  moved: 'bg-warning-bg text-warning-fg',
  new: 'bg-brand text-on-brand',
  default: 'bg-neutral text-ink',
  removed: 'bg-danger-bg text-danger-fg',
};

// Text always carries the meaning; colour only reinforces it.
export function Lozenge({
  appearance = 'default',
  children,
}: {
  appearance?: LozengeAppearance;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-block max-w-full truncate rounded-sm px-1 text-[0.6875rem] font-bold uppercase leading-4 tracking-wide',
        appearances[appearance],
      )}
    >
      {children}
    </span>
  );
}

const statusAppearance: Record<PersonStatus, LozengeAppearance> = {
  AVAILABLE: 'success',
  ALLOCATED: 'inprogress',
  LOCKED_TENTATIVE: 'moved',
  LOCKED_CONFIRMED: 'new',
  ON_LEAVE: 'default',
  BENCH: 'removed',
};

const statusLabel: Record<PersonStatus, string> = {
  AVAILABLE: 'Available',
  ALLOCATED: 'Allocated',
  LOCKED_TENTATIVE: 'Locked, tentative',
  LOCKED_CONFIRMED: 'Locked, confirmed',
  ON_LEAVE: 'On leave',
  BENCH: 'On bench',
};

export function StatusLozenge({ status }: { status: PersonStatus }) {
  return (
    <Lozenge appearance={statusAppearance[status]}>
      {statusLabel[status]}
    </Lozenge>
  );
}
