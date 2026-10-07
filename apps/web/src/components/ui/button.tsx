import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'subtle' | 'danger';
export type ButtonSize = 'default' | 'compact';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-on-brand hover:bg-brand-hover active:bg-brand-pressed',
  secondary: 'bg-neutral text-ink hover:bg-neutral-hover',
  subtle: 'bg-transparent text-ink hover:bg-neutral',
  danger: 'bg-danger-bg text-danger-fg hover:bg-danger-bg hover:brightness-95',
};

const sizes: Record<ButtonSize, string> = {
  default: 'h-8 px-3 rounded-md',
  compact: 'h-6 px-2 rounded-sm text-xs',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = 'secondary',
  size = 'default',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-1 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
