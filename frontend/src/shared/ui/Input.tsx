import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { cn } from '@/shared/lib/cn';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label?: string;
  icon?: ReactNode;
  error?: string;
  id?: string;
  ref?: Ref<HTMLInputElement>;
};

export function Input({
  label,
  icon,
  error,
  className,
  id,
  ref,
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-800">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            'w-full rounded-md border bg-white py-2.5 text-sm text-slate-800 outline-none transition-colors',
            'placeholder:text-slate-500',
            'focus:ring-2',
            'disabled:cursor-not-allowed disabled:opacity-60',
            icon ? 'pl-10 pr-3' : 'px-3',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20',
            className,
          )}
          {...rest}
        />
      </div>

      {error && (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
