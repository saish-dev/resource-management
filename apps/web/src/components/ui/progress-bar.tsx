import { cn } from '@/lib/cn';

// Utilisation bar. The business rules live in the API; this only shows a value,
// turning to the danger colour above 100%.
export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const over = value > 100;
  return (
    <div className="flex items-center gap-2">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(value, 100)}
        aria-valuetext={`${value}%`}
        className="h-2 flex-1 overflow-hidden rounded-sm bg-neutral"
      >
        <div
          className={cn('h-full', over ? 'bg-danger-fg' : 'bg-chart')}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
      <span
        className={cn(
          'w-10 text-right text-xs tabular-nums',
          over && 'font-bold text-danger-fg',
        )}
      >
        {value}%
      </span>
    </div>
  );
}
