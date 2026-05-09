import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  subtitle?: string
  footer?: ReactNode
  children: ReactNode
}

export function AuthCard({ title, subtitle, footer, children }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl text-slate-900">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      {children}
      {footer ? (
        <div className="mt-8 text-center text-sm text-slate-500">{footer}</div>
      ) : null}
    </div>
  )
}
