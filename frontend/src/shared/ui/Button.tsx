import { type ButtonHTMLAttributes, type Ref } from 'react';
import { cn } from '@/shared/lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-sky-500 text-white hover:bg-sky-600 focus-visible:ring-sky-500/30',
  secondary:
    'bg-teal-500 text-white hover:bg-teal-600 focus-visible:ring-teal-500/30',
  outline:
    'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 focus-visible:ring-sky-500/30',
  ghost:
    'bg-transparent text-slate-800 hover:bg-slate-100 focus-visible:ring-sky-500/30',
};

export function Button({
  variant = 'primary',
  fullWidth,
  className,
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        fullWidth && 'w-full',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    />
  );
}
