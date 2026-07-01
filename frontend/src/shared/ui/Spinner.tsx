import { cn } from '@/shared/lib/cn'

interface SpinnerProps {
  label?: string
  className?: string
}

export function Spinner({ label, className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-20',
        className,
      )}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      {label && (
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {label}
        </p>
      )}
    </div>
  )
}
