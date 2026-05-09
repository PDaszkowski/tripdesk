import { useId, type InputHTMLAttributes, type Ref } from 'react';
import { HiCheck } from 'react-icons/hi2';
import { cn } from '@/shared/lib/cn';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
  ref?: Ref<HTMLInputElement>;
};

export function Checkbox({
  label,
  className,
  id,
  ref,
  disabled,
  ...rest
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex items-center gap-2 select-none',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      )}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className={cn(
            'peer h-5 w-5 appearance-none rounded border border-slate-200 bg-white transition-colors',
            'checked:border-sky-500 checked:bg-sky-500',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/30',
            'disabled:cursor-not-allowed',
            !disabled && 'cursor-pointer',
          )}
          {...rest}
        />
        <HiCheck className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" />
      </span>

      {label && <span className="text-sm text-slate-500">{label}</span>}
    </label>
  );
}
